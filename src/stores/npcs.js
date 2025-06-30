import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const useNpcsStore = defineStore('npcs', {
  state: () => ({
    npcs: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchNpcs() {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('npcs')
          .select('id, name, archetype, concept, Poder, Habilidade, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida');
        if (error) throw error;
        this.npcs = data;
      } catch (error) {
        this.error = error;
        console.error('Error fetching NPCs:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
