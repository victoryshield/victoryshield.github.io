<template>
  <section id="sessoes">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <EntityListView
        :entities="filteredSessions"
        :selectedEntity="selectedSession"
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
        @deleteEntity="deleteSession"
        @editEntity="editSession"
      />

      <SessionDetailsView
        :selectedSession="selectedSession"
        :selectedCampaignName="selectedCampaignName"
        :is-edit-mode="isEditMode"
        :loading="sessionsStore.loading"
        @sessionUpdated="handleSessionUpdate"
        @creationCancelled="cancelCreation"
        @startEditing="startEditingFromDetails"
      />
    </div>
  </section>

  <div v-if="message" :class="{'bg-green-500': messageType === 'success', 'bg-red-500': messageType === 'error'}" class="text-white p-3 rounded-lg mt-4 text-center">
    {{ message }}
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useSessionsStore } from '../stores/sessions';
import { useAuthStore } from '../stores/auth';
import { useCampaignsStore } from '../stores/campaigns';
import EntityListView from '../components/EntityListView.vue';
import SessionDetailsView from '../components/SessionDetailsView.vue';

const sessionsStore = useSessionsStore();
const authStore = useAuthStore();
const campaignsStore = useCampaignsStore();

const selectedSession = ref(null);
const isEditMode = ref(false);
const message = ref('');
const messageType = ref('');
const selectedCampaignId = ref(null);

const filteredSessions = computed(() => {
  if (!selectedCampaignId.value) {
    return sessionsStore.sessions;
  }
  return sessionsStore.sessions.filter(s => s.campaign_id === selectedCampaignId.value);
});

const selectedCampaignName = computed(() => {
  const campaign = campaignsStore.campaigns.find(c => c.id === selectedCampaignId.value);
  return campaign ? campaign.name : 'Todas as Campanhas';
});

onMounted(async () => {
  if (authStore.user) {
    await campaignsStore.fetchCampaigns(authStore.user.id);
    if (campaignsStore.campaigns.length > 0) {
      selectedCampaignId.value = campaignsStore.campaigns[0].id;
    }
    await sessionsStore.fetchSessions(selectedCampaignId.value);
    if (filteredSessions.value.length > 0) {
      selectSession(filteredSessions.value[0]);
    } else {
      selectedSession.value = null;
      isEditMode.value = false;
    }
  }
});

const selectSession = (session) => {
  selectedSession.value = session;
  isEditMode.value = false;
};

const addSession = () => {
  selectedSession.value = null;
  isEditMode.value = true;
};

const editSession = (session) => {
  selectedSession.value = session;
  isEditMode.value = true;
};

const cancelCreation = () => {
  isEditMode.value = false;
  if (!selectedSession.value && filteredSessions.value.length > 0) {
    selectSession(filteredSessions.value[0]);
  }
};

const startEditingFromDetails = () => {
  isEditMode.value = true;
};

const deleteSession = async (id) => {
  try {
    await sessionsStore.deleteSession(id);
    message.value = 'Sessão excluída com sucesso!';
    messageType.value = 'success';
    selectedSession.value = null;
    isEditMode.value = false;
    await sessionsStore.fetchSessions(selectedCampaignId.value);
    if (filteredSessions.value.length > 0) {
      selectSession(filteredSessions.value[0]);
    }
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
  } catch (error) {
    message.value = `Erro ao excluir sessão: ${error.message}`;
    messageType.value = 'error';
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
  }
};

const handleSessionUpdate = async () => {
  isEditMode.value = false;
  await sessionsStore.fetchSessions(selectedCampaignId.value);
  if (filteredSessions.value.length > 0) {
    const updatedOrNewSession = sessionsStore.sessions.find(s => s.id === selectedSession.value?.id) || filteredSessions.value[filteredSessions.value.length - 1];
    selectSession(updatedOrNewSession);
  } else {
    selectedSession.value = null;
  }
};

watch(selectedCampaignId, async (newCampaignId) => {
  if (authStore.user) {
    await sessionsStore.fetchSessions(newCampaignId);
    if (filteredSessions.value.length > 0) {
      selectSession(filteredSessions.value[0]);
    } else {
      selectedSession.value = null;
      isEditMode.value = false;
    }
  }
});
</script>