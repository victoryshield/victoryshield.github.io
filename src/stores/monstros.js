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
          .select('id, name, archetype, concept, Poder, Habilidade, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida, image, campaign_id');

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
        const { data, error } = await supabase
          .from('monstros')
          .insert([monstroData])
          .select();
        if (error) throw error;
        this.monstros.push(data[0]);
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
        const { data, error } = await supabase
          .from('monstros')
          .update(monstroData)
          .eq('id', monstroData.id)
          .select();
        if (error) throw error;
        const index = this.monstros.findIndex(m => m.id === monstroData.id);
        if (index !== -1) {
          this.monstros[index] = data[0];
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
        const authStore = useAuthStore(); // Adicionado
        if (!authStore.user) { // Adicionado
          throw new Error('User not authenticated.'); // Adicionado
        }
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        // Caminho do arquivo modificado para incluir o UID do usuário
        const filePath = `${authStore.user.id}/monstros/${fileName}`; // MODIFICADO

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
  },
});
