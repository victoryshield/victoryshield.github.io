import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    sessions: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchSessions(campaignId) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .eq('campaign_id', campaignId)
          .order('created_at', { ascending: false });
        if (error) throw error;
        this.sessions = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async addSession(session) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('sessions')
          .insert(session)
          .select();
        if (error) throw error;
        this.sessions.push(data[0]);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async updateSession(session) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('sessions')
          .update(session)
          .eq('id', session.id)
          .select();
        if (error) throw error;
        const index = this.sessions.findIndex(s => s.id === session.id);
        if (index !== -1) {
          this.sessions[index] = data[0];
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteSession(id) {
      this.loading = true;
      this.error = null;
      try {
        const { error } = await supabase.from('sessions').delete().eq('id', id);
        if (error) throw error;
        this.sessions = this.sessions.filter(s => s.id !== id);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
