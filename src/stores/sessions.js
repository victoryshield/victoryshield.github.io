import { defineStore } from 'pinia';
import { supabase } from '../services/supabase';

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    sessions: [],
    activeSession: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchSessions(campaignId) {
      this.loading = true;
      this.error = null;
      if (!campaignId) {
        this.sessions = [];
        this.loading = false;
        return;
      }
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
    async fetchLatestSessionWithDetails(campaignId) {
      this.loading = true;
      this.error = null;
      this.activeSession = null;
      if (!campaignId) {
        this.loading = false;
        return;
      }
      try {
        const { data, error } = await supabase
          .from('sessions')
          .select(`
            *,
            session_encontros_desafios(*),
            session_ganchos_personagens(*),
            session_locais_interessantes(*, session_locais_caracteristicas(*)),
            session_npcs_importantes(*, npcs(id, name, concept, image)),
            session_objetivos(*),
            session_segredos_rumores(*),
            session_tesouros_recompensas(*)
          `)
          .eq('campaign_id', campaignId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          if (error.code === 'PGRST116') { // "single()" row not found
            
            this.activeSession = null;
          } else {
            throw error;
          }
        } else {
          this.activeSession = data;
        }
      } catch (err) {
        this.error = err.message;
        console.error('Erro ao buscar sessão mais recente:', err);
      } finally {
        this.loading = false;
      }
    },
    async addSession(sessionData) {
      this.loading = true;
      this.error = null;
      try {
        // 1. Insert main session data
        const { title, description, comeco_forte, gancho_proxima_aventura, campaign_id } = sessionData;
        const { data: newSession, error: sessionError } = await supabase
          .from('sessions')
          .insert({ title, description, comeco_forte, gancho_proxima_aventura, campaign_id })
          .select()
          .single();

        if (sessionError) throw sessionError;

        // 2. Insert related data
        const sessionId = newSession.id;

        const insertPromises = [];

        if (sessionData.session_objetivos && sessionData.session_objetivos.length > 0) {
          insertPromises.push(supabase.from('session_objetivos').insert(sessionData.session_objetivos.map(obj => ({ ...obj, session_id: sessionId }))));
        }
        if (sessionData.session_ganchos_personagens && sessionData.session_ganchos_personagens.length > 0) {
          insertPromises.push(supabase.from('session_ganchos_personagens').insert(sessionData.session_ganchos_personagens.map(gancho => ({ ...gancho, session_id: sessionId }))));
        }
        if (sessionData.session_locais_interessantes && sessionData.session_locais_interessantes.length > 0) {
          for (const local of sessionData.session_locais_interessantes) {
            const { data: newLocal, error: localError } = await supabase
              .from('session_locais_interessantes')
              .insert({ name: local.name, session_id: sessionId })
              .select()
              .single();
            if (localError) throw localError;

            if (local.session_locais_caracteristicas && local.session_locais_caracteristicas.length > 0) {
              insertPromises.push(supabase.from('session_locais_caracteristicas').insert(local.session_locais_caracteristicas.map(carac => ({ ...carac, local_id: newLocal.id }))));
            }
          }
        }
        if (sessionData.session_npcs_importantes && sessionData.session_npcs_importantes.length > 0) {
          insertPromises.push(supabase.from('session_npcs_importantes').insert(sessionData.session_npcs_importantes.map(npc => ({ ...npc, session_id: sessionId }))));
        }
        if (sessionData.session_encontros_desafios && sessionData.session_encontros_desafios.length > 0) {
          insertPromises.push(supabase.from('session_encontros_desafios').insert(sessionData.session_encontros_desafios.map(encontro => ({ ...encontro, session_id: sessionId }))));
        }
        if (sessionData.session_segredos_rumores && sessionData.session_segredos_rumores.length > 0) {
          insertPromises.push(supabase.from('session_segredos_rumores').insert(sessionData.session_segredos_rumores.map(segredo => ({ ...segredo, session_id: sessionId }))));
        }
        if (sessionData.session_tesouros_recompensas && sessionData.session_tesouros_recompensas.length > 0) {
          insertPromises.push(supabase.from('session_tesouros_recompensas').insert(sessionData.session_tesouros_recompensas.map(tesouro => ({ ...tesouro, session_id: sessionId }))));
        }

        await Promise.all(insertPromises);

        this.sessions.unshift(newSession);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async updateSession(sessionData) {
      this.loading = true;
      this.error = null;
      try {
        const { id, title, description, comeco_forte, gancho_proxima_aventura, campaign_id } = sessionData;

        // 1. Update main session data
        const { data: updatedSession, error: sessionError } = await supabase
          .from('sessions')
          .update({ title, description, comeco_forte, gancho_proxima_aventura })
          .eq('id', id)
          .select()
          .single();

        if (sessionError) throw sessionError;

        // 2. Delete existing related data
        const deletePromises = [
          supabase.from('session_objetivos').delete().eq('session_id', id),
          supabase.from('session_ganchos_personagens').delete().eq('session_id', id),
          supabase.from('session_locais_interessantes').delete().eq('session_id', id), // This will cascade delete caracteristicas
          supabase.from('session_npcs_importantes').delete().eq('session_id', id),
          supabase.from('session_encontros_desafios').delete().eq('session_id', id),
          supabase.from('session_segredos_rumores').delete().eq('session_id', id),
          supabase.from('session_tesouros_recompensas').delete().eq('session_id', id),
        ];
        await Promise.all(deletePromises);

        // 3. Insert new related data
        const insertPromises = [];

        if (sessionData.session_objetivos && sessionData.session_objetivos.length > 0) {
          insertPromises.push(supabase.from('session_objetivos').insert(sessionData.session_objetivos.map(obj => ({ ...obj, session_id: id }))));
        }
        if (sessionData.session_ganchos_personagens && sessionData.session_ganchos_personagens.length > 0) {
          insertPromises.push(supabase.from('session_ganchos_personagens').insert(sessionData.session_ganchos_personagens.map(gancho => ({ ...gancho, session_id: id }))));
        }
        if (sessionData.session_locais_interessantes && sessionData.session_locais_interessantes.length > 0) {
          for (const local of sessionData.session_locais_interessantes) {
            const { data: newLocal, error: localError } = await supabase
              .from('session_locais_interessantes')
              .insert({ name: local.name, session_id: id })
              .select()
              .single();
            if (localError) throw localError;

            if (local.session_locais_caracteristicas && local.session_locais_caracteristicas.length > 0) {
              insertPromises.push(supabase.from('session_locais_caracteristicas').insert(local.session_locais_caracteristicas.map(carac => ({ ...carac, local_id: newLocal.id }))));
            }
          }
        }
        if (sessionData.session_npcs_importantes && sessionData.session_npcs_importantes.length > 0) {
          insertPromises.push(supabase.from('session_npcs_importantes').insert(sessionData.session_npcs_importantes.map(npc => ({ ...npc, session_id: id }))));
        }
        if (sessionData.session_encontros_desafios && sessionData.session_encontros_desafios.length > 0) {
          insertPromises.push(supabase.from('session_encontros_desafios').insert(sessionData.session_encontros_desafios.map(encontro => ({ ...encontro, session_id: id }))));
        }
        if (sessionData.session_segredos_rumores && sessionData.session_segredos_rumores.length > 0) {
          insertPromises.push(supabase.from('session_segredos_rumores').insert(sessionData.session_segredos_rumores.map(segredo => ({ ...segredo, session_id: id }))));
        }
        if (sessionData.session_tesouros_recompensas && sessionData.session_tesouros_recompensas.length > 0) {
          insertPromises.push(supabase.from('session_tesouros_recompensas').insert(sessionData.session_tesouros_recompensas.map(tesouro => ({ ...tesouro, session_id: id }))));
        }

        await Promise.all(insertPromises);

        // Update the local store state
        const index = this.sessions.findIndex(s => s.id === id);
        if (index !== -1) {
          this.sessions[index] = updatedSession;
        }
        if (this.activeSession && this.activeSession.id === id) {
          // No need to fetch latest session with details here, as the active session will be updated by the handleSessionUpdate in the view
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteSession(id, campaignId) {
      this.loading = true;
      this.error = null;
      try {
        const { error } = await supabase.from('sessions').delete().eq('id', id);
        if (error) throw error;
        this.sessions = this.sessions.filter(s => s.id !== id);
        if (this.activeSession && this.activeSession.id === id) {
          // No need to fetch latest session with details here, as the active session will be updated by the handleSessionUpdate in the view
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});