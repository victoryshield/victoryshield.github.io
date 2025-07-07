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
            npcs_pericias(pericia_id, pericias(id, name)),
            npcs_vantagens(vantagem_id, vantagens(id, name)),
            npcs_desvantagens(desvantagem_id, desvantagens(id, name)),
            npcs_tecnicas(tecnica_id, tecnicas(id, name))`
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
        const { data: newNpc, error: npcError } = await supabase
          .from('npcs')
          .insert([rest])
          .select();
        if (npcError) throw npcError;

        const npcId = newNpc[0].id;

        // Insert related data
        if (pericias && pericias.length > 0) {
          const { error: periciasError } = await supabase
            .from('npcs_pericias')
            .insert(pericias.map(p => ({ npc_id: npcId, pericia_id: p.pericia_id })));
          if (periciasError) throw periciasError;
        }
        if (vantagens && vantagens.length > 0) {
          const { error: vantagensError } = await supabase
            .from('npcs_vantagens')
            .insert(vantagens.map(v => ({ npc_id: npcId, vantagem_id: v.vantagem_id })));
          if (vantagensError) throw vantagensError;
        }
        if (desvantagens && desvantagens.length > 0) {
          const { error: desvantagensError } = await supabase
            .from('npcs_desvantagens')
            .insert(desvantagens.map(d => ({ npc_id: npcId, desvantagem_id: d.desvantagem_id })));
          if (desvantagensError) throw desvantagensError;
        }
        if (tecnicas && tecnicas.length > 0) {
          const { error: tecnicasError } = await supabase
            .from('npcs_tecnicas')
            .insert(tecnicas.map(t => ({ npc_id: npcId, tecnica_id: t.tecnica_id })));
          if (tecnicasError) throw tecnicasError;
        }

        // Re-fetch the newly added npc with all its relations
        const { data: fetchedNpc, error: fetchError } = await supabase
          .from('npcs')
          .select(
            `id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida, image, campaign_id,
            npcs_pericias(pericia_id, pericias(id, name)),
            npcs_vantagens(vantagem_id, vantagens(id, name)),
            npcs_desvantagens(desvantagem_id, desvantagens(id, name)),
            npcs_tecnicas(tecnica_id, tecnicas(id, name))`
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

        const { error: updateError } = await supabase
          .from('npcs')
          .update(rest)
          .eq('id', id);
        if (updateError) throw updateError;

        // Update related data
        // Pericias
        await supabase.from('npcs_pericias').delete().eq('npc_id', id);
        if (pericias && pericias.length > 0) {
          const { error: periciasError } = await supabase
            .from('npcs_pericias')
            .insert(pericias.map(p => ({ npc_id: id, pericia_id: p.pericia_id })));
          if (periciasError) throw periciasError;
        }

        // Vantagens
        await supabase.from('npcs_vantagens').delete().eq('npc_id', id);
        if (vantagens && vantagens.length > 0) {
          const { error: vantagensError } = await supabase
            .from('npcs_vantagens')
            .insert(vantagens.map(v => ({ npc_id: id, vantagem_id: v.vantagem_id })));
          if (vantagensError) throw vantagensError;
        }

        // Desvantagens
        await supabase.from('npcs_desvantagens').delete().eq('npc_id', id);
        if (desvantagens && desvantagens.length > 0) {
          const { error: desvantagensError } = await supabase
            .from('npcs_desvantagens')
            .insert(desvantagens.map(d => ({ npc_id: id, desvantagem_id: d.desvantagem_id })));
          if (desvantagensError) throw desvantagensError;
        }

        // Tecnicas
        await supabase.from('npcs_tecnicas').delete().eq('npc_id', id);
        if (tecnicas && tecnicas.length > 0) {
          const { error: tecnicasError } = await supabase
            .from('npcs_tecnicas')
            .insert(tecnicas.map(t => ({ npc_id: id, tecnica_id: t.tecnica_id })));
          if (tecnicasError) throw tecnicasError;
        }

        // Re-fetch the updated npc with all its relations
        const { data: fetchedNpc, error: fetchError } = await supabase
          .from('npcs')
          .select(
            `id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida, image, campaign_id,
            npcs_pericias(pericia_id, pericias(id, name)),
            npcs_vantagens(vantagem_id, vantagens(id, name)),
            npcs_desvantagens(desvantagem_id, desvantagens(id, name)),
            npcs_tecnicas(tecnica_id, tecnicas(id, name))`
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
        const authStore = useAuthStore(); // Adicionado
        if (!authStore.user) { // Adicionado
          throw new Error('User not authenticated.'); // Adicionado
        }
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        // Caminho do arquivo modificado para incluir o UID do usuário
        const filePath = `${authStore.user.id}/npcs/${fileName}`; // MODIFICADO

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
