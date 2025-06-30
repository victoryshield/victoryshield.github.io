import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';
import { v4 as uuidv4 } from 'uuid';

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
        const { data, error } = await supabase
          .from('npcs')
          .insert([npcData])
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
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `npcs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('npcs_images') // Substitua 'npcs_images' pelo nome do seu bucket no Supabase Storage
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('npcs_images')
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