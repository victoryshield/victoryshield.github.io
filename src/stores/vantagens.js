import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const useVantagensStore = defineStore('vantagens', {
  state: () => ({
    vantagens: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchVantagens() {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('vantagens')
          .select('id, name, cost, description, requirements');
        if (error) throw error;
        this.vantagens = data;
      } catch (error) {
        this.error = error;
        console.error('Error fetching vantagens:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
