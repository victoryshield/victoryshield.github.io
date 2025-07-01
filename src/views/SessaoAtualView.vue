<template>
  <section id="sessao-atual">
    <div class="grid grid-cols-1 gap-6">
      <SessionDetailsView
        v-if="selectedSession || sessionsStore.loading"
        :selectedSession="selectedSession"
        :selectedCampaignName="selectedCampaignName"
        :is-edit-mode="false"
        :loading="sessionsStore.loading"
      />
      <div v-else class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow min-h-[400px] flex items-center justify-center">
        <div class="text-center text-slate-500 dark:text-slate-400">
          <p class="text-lg">Nenhuma sessão encontrada.</p>
          <p class="text-sm">Crie uma nova sessão na seção "Sessões" para vê-la aqui.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useSessionsStore } from '../stores/sessions';
import { useAuthStore } from '../stores/auth';
import { useCampaignsStore } from '../stores/campaigns';
import SessionDetailsView from '../components/SessionDetailsView.vue';

const sessionsStore = useSessionsStore();
const authStore = useAuthStore();
const campaignsStore = useCampaignsStore();

const selectedSession = ref(null);

const selectedCampaignName = computed(() => {
  if (selectedSession.value && selectedSession.value.campaign_id) {
    const campaign = campaignsStore.campaigns.find(c => c.id === selectedSession.value.campaign_id);
    return campaign ? campaign.name : 'N/A';
  }
  return '';
});

onMounted(async () => {
  if (authStore.user) {
    await campaignsStore.fetchCampaigns(authStore.user.id);
    // Fetch all sessions for the user, ordered by created_at descending
    await sessionsStore.fetchSessions(null); // Pass null to fetch all sessions regardless of campaign

    if (sessionsStore.sessions.length > 0) {
      // Find the most recent session
      const mostRecentSession = sessionsStore.sessions.reduce((prev, current) => {
        return (new Date(prev.created_at) > new Date(current.created_at)) ? prev : current;
      });
      selectedSession.value = mostRecentSession;
    }
  }
});
</script>