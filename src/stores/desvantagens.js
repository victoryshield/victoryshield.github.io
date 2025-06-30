import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const useDesvantagensStore = defineStore('desvantagens', {
  state: () => ({
    desvantagens: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchDesvantagens() {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('desvantagens')
          .select('id, name, cost, description');
        if (error) throw error;
        this.desvantagens = data;
      } catch (error) {
        this.error = error;
        console.error('Error fetching desvantagens:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
