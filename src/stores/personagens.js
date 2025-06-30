import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';
import { v4 as uuidv4 } from 'uuid';

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
          .select('id, name, archetype, concept, Poder, Habilidade, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida, image, campaign_id');
        
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
        const { data, error } = await supabase
          .from('personagens')
          .insert([personagemData])
          .select();
        if (error) throw error;
        this.personagens.push(data[0]);
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
        const { data, error } = await supabase
          .from('personagens')
          .update(personagemData)
          .eq('id', personagemData.id)
          .select();
        if (error) throw error;
        const index = this.personagens.findIndex(p => p.id === personagemData.id);
        if (index !== -1) {
          this.personagens[index] = data[0];
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
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `personagens/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('personagens_images') // Substitua 'personagens_images' pelo nome do seu bucket no Supabase Storage
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('personagens_images')
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
