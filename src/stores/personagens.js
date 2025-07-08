import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from './auth';

export const usePersonagensStore = defineStore('personagens', {
  state: () => ({
    personagens: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchPersonagens(campaignId) {
      this.loading = true;
      try {
        let query = supabase
          .from('personagens')
          .select(
            `
            id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida, image, campaign_id,
            personagens_pericias!left(*, pericias(id, name)),
            personagens_vantagens!left(*, vantagens(id, name)),
            personagens_desvantagens!left(*, desvantagens(id, name)),
            personagens_tecnicas!left(*, tecnicas(id, name))
            `
          );
        

        if (campaignId) {
          query = query.eq('campaign_id', campaignId);
        }

        const { data, error } = await query;
        if (error) throw error;
        this.personagens = data;
      } catch (error) {
        this.error = error;
        console.error('Error fetching personagens:', error);
      } finally {
        this.loading = false;
      }
    },
    async addPersonagem(personagemData) {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        if (!authStore.user) {
          throw new Error('User not authenticated.');
        }
        const { id, pericias, vantagens, desvantagens, tecnicas, ...rest } = personagemData;
        // Filter out relation properties from the rest object before inserting
        const cleanRest = { ...rest };
        delete cleanRest.personagens_pericias;
        delete cleanRest.personagens_vantagens;
        delete cleanRest.personagens_desvantagens;
        delete cleanRest.personagens_tecnicas;

        const { data: newPersonagem, error: personagemError } = await supabase
          .from('personagens')
          .insert([cleanRest])
          .select();
        if (personagemError) throw personagemError;

        const personagemId = newPersonagem[0].id;

        // Insert related data
        if (pericias && pericias.length > 0) {
          
          if (filteredPericias.length > 0) {
            const { error: periciasError } = await supabase
              .from('personagens_pericias')
              .insert(filteredPericias.map(p => ({ personagem_id: personagemId, pericia_id: p.pericia_id })));
            if (periciasError) throw periciasError;
          }
        }
        if (vantagens && vantagens.length > 0) {
          
          if (filteredVantagens.length > 0) {
            const { error: vantagensError } = await supabase
              .from('personagens_vantagens')
              .insert(filteredVantagens.map(v => ({ personagem_id: personagemId, vantagem_id: v.vantagem_id })));
            if (vantagensError) throw vantagensError;
          }
        }
        if (desvantagens && desvantagens.length > 0) {
          
          if (filteredDesvantagens.length > 0) {
            const { error: desvantagensError } = await supabase
              .from('personagens_desvantagens')
              .insert(filteredDesvantagens.map(d => ({ personagem_id: personagemId, desvantagem_id: d.desvantagem_id })));
            if (desvantagensError) throw desvantagensError;
          }
        }
        if (tecnicas && tecnicas.length > 0) {
          const filteredTecnicas = tecnicas.filter(t => t.tecnica_id !== null);
          if (filteredTecnicas.length > 0) {
            const { error: tecnicasError } = await supabase
              .from('personagens_tecnicas')
              .insert(filteredTecnicas.map(t => ({ personagem_id: personagemId, tecnica_id: t.tecnica_id })));
            if (tecnicasError) throw tecnicasError;
          }
        }

        // Re-fetch the newly added personagem with all its relations
        const { data: fetchedPersonagem, error: fetchError } = await supabase
          .from('personagens')
          .select(
            `
            id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida, image, campaign_id,
            personagens_pericias!left(*, pericias(id, name)),
            personagens_vantagens!left(*, vantagens(id, name)),
            personagens_desvantagens!left(*, desvantagens(id, name)),
            personagens_tecnicas!left(*, tecnicas(id, name))
            `
          )
          .eq('id', personagemId)
          .single();
        if (fetchError) throw fetchError;

        this.personagens.push(fetchedPersonagem);
      } catch (error) {
        this.error = error;
        console.error('Error adding personagem:', error);
      } finally {
        this.loading = false;
      }
    },
    async updatePersonagem(personagemData) {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        if (!authStore.user) {
          throw new Error('User not authenticated.');
        }
        const { id, pericias, vantagens, desvantagens, tecnicas, ...rest } = personagemData;
        // Filter out relation properties from the rest object before updating
        const cleanRest = { ...rest };
        delete cleanRest.personagens_pericias;
        delete cleanRest.personagens_vantagens;
        delete cleanRest.personagens_desvantagens;
        delete cleanRest.personagens_tecnicas;

        const { error: updateError } = await supabase
          .from('personagens')
          .update(cleanRest)
          .eq('id', id);
        if (updateError) throw updateError;

        // Update related data
        // Pericias
        await supabase.from('personagens_pericias').delete().eq('personagem_id', id);
        if (pericias && pericias.length > 0) {
          const filteredPericias = pericias.filter(p => p.pericia_id !== null);
          if (filteredPericias.length > 0) {
            const { error: periciasError } = await supabase
              .from('personagens_pericias')
              .insert(pericias.filter(p => p.pericia_id !== null).map(p => ({ personagem_id: id, pericia_id: p.pericia_id })));
            if (periciasError) throw periciasError;
          }
        }

        // Vantagens
        await supabase.from('personagens_vantagens').delete().eq('personagem_id', id);
        if (vantagens && vantagens.length > 0) {
          const filteredVantagens = vantagens.filter(v => v.vantagem_id !== null);
          if (filteredVantagens.length > 0) {
            const { error: vantagensError } = await supabase
              .from('personagens_vantagens')
              .insert(vantagens.filter(v => v.vantagem_id !== null).map(v => ({ personagem_id: id, vantagem_id: v.vantagem_id })));
            if (vantagensError) throw vantagensError;
          }
        }

        // Desvantagens
        await supabase.from('personagens_desvantagens').delete().eq('personagem_id', id);
        if (desvantagens && desvantagens.length > 0) {
          const filteredDesvantagens = desvantagens.filter(d => d.desvantagem_id !== null);
          if (filteredDesvantagens.length > 0) {
            const { error: desvantagensError } = await supabase
              .from('personagens_desvantagens')
              .insert(desvantagens.filter(d => d.desvantagem_id !== null).map(d => ({ personagem_id: id, desvantagem_id: d.desvantagem_id })));
            if (desvantagensError) throw desvantagensError;
          }
        }

        // Tecnicas
        await supabase.from('personagens_tecnicas').delete().eq('personagem_id', id);
        if (tecnicas && tecnicas.length > 0) {
          const filteredTecnicas = tecnicas.filter(t => t.tecnica_id !== null);
          if (filteredTecnicas.length > 0) {
            const { error: tecnicasError } = await supabase
              .from('personagens_tecnicas')
              .insert(tecnicas.filter(t => t.tecnica_id !== null).map(t => ({ personagem_id: id, tecnica_id: t.tecnica_id })));
            if (tecnicasError) throw tecnicasError;
          }
        }

        // Re-fetch the updated personagem with all its relations
        const { data: fetchedPersonagem, error: fetchError } = await supabase
          .from('personagens')
          .select(
            `
            id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida, image, campaign_id,
            personagens_pericias!left(*, pericias(id, name)),
            personagens_vantagens!left(*, vantagens(id, name)),
            personagens_desvantagens!left(*, desvantagens(id, name)),
            personagens_tecnicas!left(*, tecnicas(id, name))
            `
          )
          .eq('id', id)
          .single();
        if (fetchError) throw fetchError;

        const index = this.personagens.findIndex(p => p.id === id);
        if (index !== -1) {
          this.personagens[index] = fetchedPersonagem;
        }
      } catch (error) {
        this.error = error;
        console.error('Error updating personagem:', error);
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
        const filePath = `${authStore.user.id}/personagens/${fileName}`;

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
    async deletePersonagem(personagemId) {
      this.loading = true;
      try {
        const { error } = await supabase
          .from('personagens')
          .delete()
          .eq('id', personagemId);
        if (error) throw error;
        this.personagens = this.personagens.filter(p => p.id !== personagemId);
      } catch (error) {
        this.error = error;
        console.error('Error deleting personagem:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});