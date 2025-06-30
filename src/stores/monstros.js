import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const useMonstrosStore = defineStore('monstros', {
  state: () => ({
    monstros: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchMonstros() {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('monstros')
          .select('id, name, archetype, concept, Poder, Habilidade, Resistencia, Pontos_Acao, Pontos_Mana, Pontos_Vida');
        if (error) throw error;
        this.monstros = data;
      } catch (error) {
        this.error = error;
        console.error('Error fetching monstros:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
