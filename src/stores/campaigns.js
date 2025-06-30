import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const useCampaignsStore = defineStore('campaigns', {
  state: () => ({
    campaigns: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCampaigns() {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('id, name, description');
        if (error) throw error;
        this.campaigns = data;
      } catch (error) {
        this.error = error;
        console.error('Error fetching campaigns:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
