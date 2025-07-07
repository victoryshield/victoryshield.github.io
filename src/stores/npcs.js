import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from './auth';

export const useNpcsStore = defineStore('npcs', {
  state: () => ({
    npcs: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchNpcs(campaignId) {
      this.loading = true;
      try {
        let query = supabase
          .from('npcs')
          .select(
            `id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida, image, campaign_id,
            npcs_pericias!left(*, pericias(id, name)),
            npcs_vantagens!left(*, vantagens(id, name)),
            npcs_desvantagens!left(*, desvantagens(id, name)),
            npcs_tecnicas!left(*, tecnicas(id, name))`
          );

        if (campaignId) {
          query = query.eq('campaign_id', campaignId);
        }

        const { data, error } = await query;
        if (error) throw error;
        this.npcs = data;
      } catch (error) {
        this.error = error;
        console.error('Error fetching npcs:', error);
      } finally {
        this.loading = false;
      }
    },
    async addNpc(npcData) {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        if (!authStore.user) {
          throw new Error('User not authenticated.');
        }
        const { id, pericias, vantagens, desvantagens, tecnicas, ...rest } = npcData;
        // Filter out relation properties from the rest object before inserting
        const cleanRest = { ...rest };
        delete cleanRest.npcs_pericias;
        delete cleanRest.npcs_vantagens;
        delete cleanRest.npcs_desvantagens;
        delete cleanRest.npcs_tecnicas;

        const { data: newNpc, error: npcError } = await supabase
          .from('npcs')
          .insert([cleanRest])
          .select();
        if (npcError) throw npcError;

        const npcId = newNpc[0].id;

        // Insert related data
        if (pericias && pericias.length > 0) {
          const filteredPericias = pericias.filter(p => p.pericia_id !== null);
          console.log('Filtered Pericias for insert:', filteredPericias);
          if (filteredPericias.length > 0) {
            const { error: periciasError } = await supabase
              .from('npcs_pericias')
              .insert(filteredPericias.map(p => ({ npc_id: npcId, pericia_id: p.pericia_id })));
            if (periciasError) throw periciasError;
          }
        }
        if (vantagens && vantagens.length > 0) {
          const filteredVantagens = vantagens.filter(v => v.vantagem_id !== null);
          console.log('Filtered Vantagens for insert:', filteredVantagens);
          if (filteredVantagens.length > 0) {
            const { error: vantagensError } = await supabase
              .from('npcs_vantagens')
              .insert(filteredVantagens.map(v => ({ npc_id: npcId, vantagem_id: v.vantagem_id })));
            if (vantagensError) throw vantagensError;
          }
        }
        if (desvantagens && desvantagens.length > 0) {
          const filteredDesvantagens = desvantagens.filter(d => d.desvantagem_id !== null);
          console.log('Filtered Desvantagens for insert:', filteredDesvantagens);
          if (filteredDesvantagens.length > 0) {
            const { error: desvantagensError } = await supabase
              .from('npcs_desvantagens')
              .insert(filteredDesvantagens.map(d => ({ npc_id: npcId, desvantagem_id: d.desvantagem_id })));
            if (desvantagensError) throw desvantagensError;
          }
        }
        if (tecnicas && tecnicas.length > 0) {
          const filteredTecnicas = tecnicas.filter(t => t.tecnica_id !== null);
          console.log('Filtered Tecnicas for insert:', filteredTecnicas);
          if (filteredTecnicas.length > 0) {
            const { error: tecnicasError } = await supabase
              .from('npcs_tecnicas')
              .insert(filteredTecnicas.map(t => ({ npc_id: npcId, tecnica_id: t.tecnica_id })));
            if (tecnicasError) throw tecnicasError;
          }
        }

        // Re-fetch the newly added npc with all its relations
        const { data: fetchedNpc, error: fetchError } = await supabase
          .from('npcs')
          .select(
            `id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida, image, campaign_id,
            npcs_pericias!left(*, pericias(id, name)),
            npcs_vantagens!left(*, vantagens(id, name)),
            npcs_desvantagens!left(*, desvantagens(id, name)),
            npcs_tecnicas!left(*, tecnicas(id, name))`
          )
          .eq('id', npcId)
          .single();
        if (fetchError) throw fetchError;

        this.npcs.push(fetchedNpc);
      } catch (error) {
        this.error = error;
        console.error('Error adding npc:', error);
      } finally {
        this.loading = false;
      }
    },
    async updateNpc(npcData) {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        if (!authStore.user) {
          throw new Error('User not authenticated.');
        }
        const { id, pericias, vantagens, desvantagens, tecnicas, ...rest } = npcData;
        // Filter out relation properties from the rest object before updating
        const cleanRest = { ...rest };
        delete cleanRest.npcs_pericias;
        delete cleanRest.npcs_vantagens;
        delete cleanRest.npcs_desvantagens;
        delete cleanRest.npcs_tecnicas;

        const { error: updateError } = await supabase
          .from('npcs')
          .update(cleanRest)
          .eq('id', id);
        if (updateError) throw updateError;

        // Update related data
        // Pericias
        await supabase.from('npcs_pericias').delete().eq('npc_id', id);
        if (pericias && pericias.length > 0) {
          console.log('Raw Pericias before filter:', JSON.stringify(pericias, null, 2));
          const filteredPericias = pericias.filter(p => p.pericia_id !== null);
          console.log('Filtered Pericias for update:', JSON.stringify(filteredPericias, null, 2));
          if (filteredPericias.length > 0) {
            const { error: periciasError } = await supabase
              .from('npcs_pericias')
              .insert(filteredPericias.map(p => ({ npc_id: id, pericia_id: p.pericia_id })));
            if (periciasError) throw periciasError;
          }
        }

        // Vantagens
        await supabase.from('npcs_vantagens').delete().eq('npc_id', id);
        if (vantagens && vantagens.length > 0) {
          console.log('Raw Vantagens before filter:', JSON.stringify(vantagens, null, 2));
          const filteredVantagens = vantagens.filter(v => v.vantagem_id !== null);
          console.log('Filtered Vantagens for update:', JSON.stringify(filteredVantagens, null, 2));
          if (filteredVantagens.length > 0) {
            const { error: vantagensError } = await supabase
              .from('npcs_vantagens')
              .insert(filteredVantagens.map(v => ({ npc_id: id, vantagem_id: v.vantagem_id })));
            if (vantagensError) throw vantagensError;
          }
        }

        // Desvantagens
        await supabase.from('npcs_desvantagens').delete().eq('npc_id', id);
        if (desvantagens && desvantagens.length > 0) {
          console.log('Raw Desvantagens before filter:', JSON.stringify(desvantagens, null, 2));
          const filteredDesvantagens = desvantagens.filter(d => d.desvantagem_id !== null);
          console.log('Filtered Desvantagens for update:', JSON.stringify(filteredDesvantagens, null, 2));
          if (filteredDesvantagens.length > 0) {
            const { error: desvantagensError } = await supabase
              .from('npcs_desvantagens')
              .insert(desvantagens.filter(d => d.desvantagem_id !== null).map(d => ({ npc_id: id, desvantagem_id: d.desvantagem_id })));
            if (desvantagensError) throw desvantagensError;
          }
        }

        // Tecnicas
        await supabase.from('npcs_tecnicas').delete().eq('npc_id', id);
        if (tecnicas && tecnicas.length > 0) {
          console.log('Raw Tecnicas before filter:', JSON.stringify(tecnicas, null, 2));
          const filteredTecnicas = tecnicas.filter(t => t.tecnica_id !== null);
          console.log('Filtered Tecnicas for update:', JSON.stringify(filteredTecnicas, null, 2));
          if (filteredTecnicas.length > 0) {
            const { error: tecnicasError } = await supabase
              .from('npcs_tecnicas')
              .insert(tecnicas.filter(t => t.tecnica_id !== null).map(t => ({ npc_id: id, tecnica_id: t.tecnica_id })));
            if (tecnicasError) throw tecnicasError;
          }
        }

        // Re-fetch the updated npc with all its relations
        const { data: fetchedNpc, error: fetchError } = await supabase
          .from('npcs')
          .select(
            `id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida, image, campaign_id,
            npcs_pericias!left(*, pericias(id, name)),
            npcs_vantagens!left(*, vantagens(id, name)),
            npcs_desvantagens!left(*, desvantagens(id, name)),
            npcs_tecnicas!left(*, tecnicas(id, name))`
          )
          .eq('id', id)
          .single();
        if (fetchError) throw fetchError;

        const index = this.npcs.findIndex(n => n.id === id);
        if (index !== -1) {
          this.npcs[index] = fetchedNpc;
        }
      } catch (error) {
        this.error = error;
        console.error('Error updating npc:', error);
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
        const filePath = `${authStore.user.id}/npcs/${fileName}`;

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
    async deleteNpc(npcId) {
      this.loading = true;
      try {
        const { error } = await supabase
          .from('npcs')
          .delete()
          .eq('id', npcId);
        if (error) throw error;
        this.npcs = this.npcs.filter(n => n.id !== npcId);
      } catch (error) {
        this.error = error;
        console.error('Error deleting npc:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});