import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    loading: false,
    error: null,
  }),
  actions: {
    setSession(session) {
      this.session = session;
      this.user = session?.user || null;
    },
    setUser(user) {
      this.user = user;
    },
    async signOut() {
      this.loading = true;
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        this.session = null;
        this.user = null;
      } catch (error) {
        this.error = error;
        console.error('Error signing out:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchUser() {
      this.loading = true;
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        this.setSession(session);
      } catch (error) {
        this.error = error;
        console.error('Error fetching user session:', error);
      } finally {
        this.loading = false;
      }
    },
    
  },
});