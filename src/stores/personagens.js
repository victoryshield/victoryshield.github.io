import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const usePersonagensStore = defineStore('personagens', {
  state: () => ({
    personagens: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchPersonagens() {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('personagens')
          .select('id, name, archetype, concept, Poder, Habilidade, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida');
        if (error) throw error;
        this.personagens = data;
      } catch (error) {
        this.error = error;
        console.error('Error fetching personagens:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
