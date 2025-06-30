import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    sessions: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchSessions() {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('sessions')
          .select('id, title, description, comeco_forte, gancho_proxima_aventura');
        if (error) throw error;
        this.sessions = data;
      } catch (error) {
        this.error = error;
        console.error('Error fetching sessions:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
