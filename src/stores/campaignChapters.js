import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const useCampaignChaptersStore = defineStore('campaignChapters', {
  state: () => ({
    chapters: [],
    latestChapter: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchChapters(campaignId) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('campaign_chapters')
          .select('*')
          .eq('campaign_id', campaignId)
          .order('chapter_number', { ascending: false });
        if (error) throw error;
        this.chapters = data;
        if (data.length > 0) {
          this.latestChapter = data[0];
        } else {
          this.latestChapter = null;
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async addChapter(chapter) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('campaign_chapters')
          .insert(chapter)
          .select();
        if (error) throw error;
        this.chapters.unshift(data[0]);
        this.latestChapter = data[0];
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async updateChapter(chapter) {
      this.loading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('campaign_chapters')
          .update(chapter)
          .eq('id', chapter.id)
          .select();
        if (error) throw error;
        const index = this.chapters.findIndex(c => c.id === chapter.id);
        if (index !== -1) {
          this.chapters[index] = data[0];
        }
        if (this.latestChapter && this.latestChapter.id === chapter.id) {
          this.latestChapter = data[0];
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteChapter(id) {
      this.loading = true;
      this.error = null;
      try {
        const { error } = await supabase.from('campaign_chapters').delete().eq('id', id);
        if (error) throw error;
        this.chapters = this.chapters.filter(c => c.id !== id);
        if (this.latestChapter && this.latestChapter.id === id) {
          this.latestChapter = this.chapters.length > 0 ? this.chapters[0] : null;
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
