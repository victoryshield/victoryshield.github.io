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
          .select('id, name, archetype, concept, Poder, Habilidade, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida, image, campaign_id');

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
        const { id, ...rest } = npcData;
        const { data, error } = await supabase
          .from('npcs')
          .insert([rest])
          .select();
        if (error) throw error;
        this.npcs.push(data[0]);
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
        const { data, error } = await supabase
          .from('npcs')
          .update(npcData)
          .eq('id', npcData.id)
          .select();
        if (error) throw error;
        const index = this.npcs.findIndex(n => n.id === npcData.id);
        if (index !== -1) {
          this.npcs[index] = data[0];
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
