import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const useTecnicasStore = defineStore('tecnicas', {
  state: () => ({
    tecnicas: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchTecnicas() {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('tecnicas')
          .select('id, name, requirements, cost, duration, description');
        if (error) throw error;
        this.tecnicas = data;
      } catch (error) {
        this.error = error;
        console.error('Error fetching tecnicas:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
