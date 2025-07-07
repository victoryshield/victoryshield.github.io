import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const useCampaignsStore = defineStore('campaigns', {
  state: () => ({
    campaigns: [],
    activeCampaign: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCampaigns(userId) {
      if (!userId) return;
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (error) throw error;
        this.campaigns = data;
        if (data.length > 0 && !this.activeCampaign) {
          this.setActiveCampaign(data[0]);
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    setActiveCampaign(campaign) {
      this.activeCampaign = campaign;
    },
    async addCampaign(campaign) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .insert(campaign)
          .select();
        if (error) throw error;
        this.campaigns.unshift(data[0]);
        if (!this.activeCampaign) {
          this.setActiveCampaign(data[0]);
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async updateCampaign(campaign) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .update(campaign)
          .eq('id', campaign.id)
          .select();
        if (error) throw error;
        const index = this.campaigns.findIndex(c => c.id === campaign.id);
        if (index !== -1) {
          this.campaigns[index] = data[0];
        }
        if (this.activeCampaign && this.activeCampaign.id === campaign.id) {
          this.setActiveCampaign(data[0]);
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteCampaign(id) {
      this.loading = true;
      this.error = null;
      try {
        await supabase.from('npcs').delete().eq('campaign_id', id);
        await supabase.from('personagens').delete().eq('campaign_id', id);
        await supabase.from('sessions').delete().eq('campaign_id', id);
        const { error } = await supabase.from('campaigns').delete().eq('id', id);
        if (error) throw error;
        this.campaigns = this.campaigns.filter(c => c.id !== id);
        if (this.activeCampaign && this.activeCampaign.id === id) {
          this.setActiveCampaign(this.campaigns.length > 0 ? this.campaigns[0] : null);
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
