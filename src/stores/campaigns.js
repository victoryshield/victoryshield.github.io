import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const useCampaignsStore = defineStore('campaigns', {
  state: () => ({
    campaigns: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCampaigns(userId) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('id, name, description, user_id')
          .eq('user_id', userId);
        if (error) throw error;
        this.campaigns = data;
      } catch (error) {
        this.error = error;
        console.error('Error fetching campaigns:', error);
      } finally {
        this.loading = false;
      }
    },
    async addCampaign(campaignData) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .insert([campaignData])
          .select();
        if (error) throw error;
        this.campaigns.push(data[0]);
      } catch (error) {
        this.error = error;
        console.error('Error adding campaign:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateCampaign(campaignData) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .update(campaignData)
          .eq('id', campaignData.id)
          .select();
        if (error) throw error;
        const index = this.campaigns.findIndex(c => c.id === campaignData.id);
        if (index !== -1) {
          this.campaigns[index] = data[0];
        }
      } catch (error) {
        this.error = error;
        console.error('Error updating campaign:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteCampaign(campaignId) {
      this.loading = true;
      try {
        const { error } = await supabase
          .from('campaigns')
          .delete()
          .eq('id', campaignId);
        if (error) throw error;
        this.campaigns = this.campaigns.filter(c => c.id !== campaignId);
      } catch (error) {
        this.error = error;
        console.error('Error deleting campaign:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});