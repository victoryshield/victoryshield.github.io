<template>
  <section id="sessoes" class="h-full">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      <EntityListView
        :entities="sessionsStore.sessions"
        :selectedEntity="sessionsStore.activeSession"
        :loading="sessionsStore.loading"
        :error="sessionsStore.error"
        entityTitle="Sessões"
        :entityIcon="['fas', 'scroll']"
        :showCampaignFilter="true"
        :campaigns="campaignsStore.campaigns"
        :selectedCampaignId="selectedCampaignId"
        @update:selectedCampaignId="selectedCampaignId = $event"
        @selectEntity="selectSession"
        @addEntity="addSession"
        @editEntity="editSession"
        @deleteEntity="deleteSession"
        class="h-full overflow-y-auto"
      />

      <div class="md:col-span-2 h-full">
        <SessionDetailsView
          v-if="!isEditMode"
          :selectedSession="sessionsStore.activeSession"
          :loading="sessionsStore.loading"
          @startEditing="editSession(sessionsStore.activeSession)"
          class="h-full"
        />
        <SessionForm
          v-else
          :session="sessionToEdit"
          :campaignId="campaignsStore.activeCampaign?.id"
          @save="handleSessionUpdate"
          @close="cancelCreation"
          class="h-full"
        />
      </div>
    </div>
  </section>

  <div v-if="message" :class="{'bg-green-500': messageType === 'success', 'bg-red-500': messageType === 'error'}" class="text-white p-3 rounded-lg mt-4 text-center">
    {{ message }}
  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useSessionsStore } from '../stores/sessions';
import { useCampaignsStore } from '../stores/campaigns';
import { useAuthStore } from '../stores/auth';
import EntityListView from '../components/EntityListView.vue';
import SessionDetailsView from '../components/SessionDetailsView.vue';
import SessionForm from '../components/SessionForm.vue';

const sessionsStore = useSessionsStore();
const campaignsStore = useCampaignsStore();
const authStore = useAuthStore();

const selectedCampaignId = ref(null);

const isEditMode = ref(false);
const sessionToEdit = ref(null);
const message = ref('');
const messageType = ref('');

const selectSession = (session) => {
  sessionsStore.activeSession = session;
  isEditMode.value = false;
};

const addSession = () => {
  sessionToEdit.value = { campaign_id: selectedCampaignId.value };
  isEditMode.value = true;
};

const editSession = async (session) => {
  await sessionsStore.fetchLatestSessionWithDetails(session.campaign_id);
  sessionToEdit.value = { ...sessionsStore.activeSession };
  isEditMode.value = true;
};

const deleteSession = async (id) => {
  if (confirm('Tem certeza que deseja excluir esta sessão?')) {
    try {
      await sessionsStore.deleteSession(id);
      message.value = 'Sessão excluída com sucesso!';
      messageType.value = 'success';
      await sessionsStore.fetchSessions(selectedCampaignId.value);
      if (sessionsStore.activeSession && sessionsStore.activeSession.id === id) {
        sessionsStore.activeSession = null;
      }
      setTimeout(() => { message.value = ''; }, 3000);
    } catch (error) {
      message.value = `Erro ao excluir sessão: ${error.message}`;
      messageType.value = 'error';
      setTimeout(() => { message.value = ''; }, 5000);
    }
  }
};

const handleSessionUpdate = async (sessionData) => {
  try {
    if (sessionData.id) {
      await sessionsStore.updateSession(sessionData);
      message.value = 'Sessão atualizada com sucesso!';
    } else {
      await sessionsStore.addSession(sessionData);
      message.value = 'Sessão adicionada com sucesso!';
    }
    messageType.value = 'success';
    isEditMode.value = false;
    await sessionsStore.fetchSessions(selectedCampaignId.value);
    if (sessionsStore.sessions.length > 0) {
      const updatedOrNewSession = sessionsStore.sessions.find(s => s.id === sessionData.id) || sessionsStore.sessions[sessionsStore.sessions.length - 1];
      sessionsStore.activeSession = updatedOrNewSession;
      // Fetch full details for the active session after update
      await sessionsStore.fetchLatestSessionWithDetails(sessionsStore.activeSession.campaign_id);
    } else {
      sessionsStore.activeSession = null;
    }
  } catch (error) {
    message.value = `Erro ao salvar sessão: ${error.message}`;
    messageType.value = 'error';
  } finally {
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
  }
};

const cancelCreation = () => {
  isEditMode.value = false;
  sessionToEdit.value = null;
  if (!sessionsStore.activeSession && sessionsStore.sessions.length > 0) {
    sessionsStore.activeSession = sessionsStore.sessions[0];
  }
};

const loadInitialData = async () => {
  if (!authStore.user) {
    sessionsStore.sessions = [];
    sessionsStore.activeSession = null;
    return;
  }

  await campaignsStore.fetchCampaigns(authStore.user.id);

  if (campaignsStore.campaigns.length > 0) {
    selectedCampaignId.value = campaignsStore.campaigns[0].id;
    await sessionsStore.fetchSessions(selectedCampaignId.value);
    if (sessionsStore.sessions.length > 0) {
      sessionsStore.activeSession = sessionsStore.sessions[0];
    } else {
      sessionsStore.activeSession = null;
      addSession(); // Open form to add new session if none exist
    }
  } else {
    sessionsStore.sessions = [];
    sessionsStore.activeSession = null;
  }
};

watch(selectedCampaignId, async (newCampaignId) => {
  if (authStore.user) {
    await sessionsStore.fetchSessions(newCampaignId);
    if (sessionsStore.sessions.length > 0) {
      sessionsStore.activeSession = sessionsStore.sessions[0];
    } else {
      sessionsStore.activeSession = null;
      addSession();
    }
  }
});

onMounted(() => {
  loadInitialData();
});

</script>

<style scoped>
/* Estilos para a scrollbar, se necessário */
</style>