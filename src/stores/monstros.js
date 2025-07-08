import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from './auth';

export const useMonstrosStore = defineStore('monstros', {
  state: () => ({
    monstros: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchMonstros(campaignId) {
      this.loading = true;
      try {
        let query = supabase
          .from('monstros')
          .select(
            `id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida, image, campaign_id,
            monstros_pericias!left(*, pericias(id, name)),
            monstros_vantagens!left(*, vantagens(id, name)),
            monstros_desvantagens!left(*, desvantagens(id, name)),
            monstros_tecnicas!left(*, tecnicas(id, name))`
          );

        if (campaignId) {
          query = query.eq('campaign_id', campaignId);
        }

        const { data, error } = await query;
        if (error) throw error;
        this.monstros = data;
      } catch (error) {
        this.error = error;
        console.error('Error fetching monstros:', error);
      } finally {
        this.loading = false;
      }
    },
    async addMonstro(monstroData) {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        if (!authStore.user) {
          throw new Error('User not authenticated.');
        }
        const { id, pericias, vantagens, desvantagens, tecnicas, ...rest } = monstroData;
        // Filter out relation properties from the rest object before inserting
        const cleanRest = { ...rest };
        delete cleanRest.monstros_pericias;
        delete cleanRest.monstros_vantagens;
        delete cleanRest.monstros_desvantagens;
        delete cleanRest.monstros_tecnicas;

        const { data: newMonstro, error: monstroError } = await supabase
          .from('monstros')
          .insert([cleanRest])
          .select();
        if (monstroError) throw monstroError;

        const monstroId = newMonstro[0].id;

        // Insert related data
        if (pericias && pericias.length > 0) {
          const filteredPericias = pericias.filter(p => p.pericia_id !== null);
          if (filteredPericias.length > 0) {
            const { error: periciasError } = await supabase
              .from('monstros_pericias')
              .insert(filteredPericias.map(p => ({ monstro_id: monstroId, pericia_id: p.pericia_id })));
            if (periciasError) throw periciasError;
          }
        }
        if (vantagens && vantagens.length > 0) {
          const filteredVantagens = vantagens.filter(v => v.vantagem_id !== null);
          if (filteredVantagens.length > 0) {
            const { error: vantagensError } = await supabase
              .from('monstros_vantagens')
              .insert(filteredVantagens.map(v => ({ monstro_id: monstroId, vantagem_id: v.vantagem_id })));
            if (vantagensError) throw vantagensError;
          }
        }
        if (desvantagens && desvantagens.length > 0) {
          const filteredDesvantagens = desvantagens.filter(d => d.desvantagem_id !== null);
          if (filteredDesvantagens.length > 0) {
            const { error: desvantagensError } = await supabase
              .from('monstros_desvantagens')
              .insert(filteredDesvantagens.map(d => ({ monstro_id: monstroId, desvantagem_id: d.desvantagem_id })));
            if (desvantagensError) throw desvantagensError;
          }
        }
        if (tecnicas && tecnicas.length > 0) {
          const filteredTecnicas = tecnicas.filter(t => t.tecnica_id !== null);
          if (filteredTecnicas.length > 0) {
            const { error: tecnicasError } = await supabase
              .from('monstros_tecnicas')
              .insert(filteredTecnicas.map(t => ({ monstro_id: monstroId, tecnica_id: t.tecnica_id })));
            if (tecnicasError) throw tecnicasError;
          }
        }

        // Re-fetch the newly added monstro with all its relations
        const { data: fetchedMonstro, error: fetchError } = await supabase
          .from('monstros')
          .select(
            `id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida, image, campaign_id,
            monstros_pericias!left(*, pericias(id, name)),
            monstros_vantagens!left(*, vantagens(id, name)),
            monstros_desvantagens!left(*, desvantagens(id, name)),
            monstros_tecnicas!left(*, tecnicas(id, name))`
          )
          .eq('id', monstroId)
          .single();
        if (fetchError) throw fetchError;

        this.monstros.push(fetchedMonstro);
      } catch (error) {
        this.error = error;
        console.error('Error adding monstro:', error);
      } finally {
        this.loading = false;
      }
    },
    async updateMonstro(monstroData) {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        if (!authStore.user) {
          throw new Error('User not authenticated.');
        }
        const { id, pericias, vantagens, desvantagens, tecnicas, ...rest } = monstroData;
        // Filter out relation properties from the rest object before updating
        const cleanRest = { ...rest };
        delete cleanRest.monstros_pericias;
        delete cleanRest.monstros_vantagens;
        delete cleanRest.monstros_desvantagens;
        delete cleanRest.monstros_tecnicas;

        const { error: updateError } = await supabase
          .from('monstros')
          .update(cleanRest)
          .eq('id', id);
        if (updateError) throw updateError;

        // Update related data
        // Pericias
        await supabase.from('monstros_pericias').delete().eq('monstro_id', id);
        if (pericias && pericias.length > 0) {
          const filteredPericias = pericias.filter(p => p.pericia_id !== null);
          if (filteredPericias.length > 0) {
            const { error: periciasError } = await supabase
              .from('monstros_pericias')
              .insert(pericias.filter(p => p.pericia_id !== null).map(p => ({ monstro_id: id, pericia_id: p.pericia_id })));
            if (periciasError) throw periciasError;
          }
        }

        // Vantagens
        await supabase.from('monstros_vantagens').delete().eq('monstro_id', id);
        if (vantagens && vantagens.length > 0) {
          const filteredVantagens = vantagens.filter(v => v.vantagem_id !== null);
          if (filteredVantagens.length > 0) {
            const { error: vantagensError } = await supabase
              .from('monstros_vantagens')
              .insert(vantagens.filter(v => v.vantagem_id !== null).map(v => ({ monstro_id: id, vantagem_id: v.vantagem_id })));
            if (vantagensError) throw vantagensError;
          }
        }

        // Desvantagens
        await supabase.from('monstros_desvantagens').delete().eq('monstro_id', id);
        if (desvantagens && desvantagens.length > 0) {
          const filteredDesvantagens = desvantagens.filter(d => d.desvantagem_id !== null);
          if (filteredDesvantagens.length > 0) {
            const { error: desvantagensError } = await supabase
              .from('monstros_desvantagens')
              .insert(desvantagens.filter(d => d.desvantagem_id !== null).map(d => ({ monstro_id: id, desvantagem_id: d.desvantagem_id })));
            if (desvantagensError) throw desvantagensError;
          }
        }

        // Tecnicas
        await supabase.from('monstros_tecnicas').delete().eq('monstro_id', id);
        if (tecnicas && tecnicas.length > 0) {
          const filteredTecnicas = tecnicas.filter(t => t.tecnica_id !== null);
          if (filteredTecnicas.length > 0) {
            const { error: tecnicasError } = await supabase
              .from('monstros_tecnicas')
              .insert(tecnicas.filter(t => t.tecnica_id !== null).map(t => ({ monstro_id: id, tecnica_id: t.tecnica_id })));
            if (tecnicasError) throw tecnicasError;
          }
        }

        // Re-fetch the updated monstro with all its relations
        const { data: fetchedMonstro, error: fetchError } = await supabase
          .from('monstros')
          .select(
            `id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida, image, campaign_id,
            monstros_pericias!left(*, pericias(id, name)),
            monstros_vantagens!left(*, vantagens(id, name)),
            monstros_desvantagens!left(*, desvantagens(id, name)),
            monstros_tecnicas!left(*, tecnicas(id, name))`
          )
          .eq('id', id)
          .single();
        if (fetchError) throw fetchError;

        const index = this.monstros.findIndex(m => m.id === id);
        if (index !== -1) {
          this.monstros[index] = fetchedMonstro;
        }
      } catch (error) {
        this.error = error;
        console.error('Error updating monstro:', error);
      } finally {
        this.loading = false;
      }
    },
    async uploadImage(file) {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        if (!authStore.user) {
          throw new Error('User not authenticated.');
        }
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${authStore.user.id}/monstros/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
      } catch (error) {
        this.error = error;
        console.error('Error uploading image:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteMonstro(monstroId) {
      this.loading = true;
      try {
        const { error } = await supabase
          .from('monstros')
          .delete()
          .eq('id', monstroId);
        if (error) throw error;
        this.monstros = this.monstros.filter(m => m.id !== monstroId);
      } catch (error) {
        this.error = error;
        console.error('Error deleting monstro:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});