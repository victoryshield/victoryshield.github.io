<template>
  <section id="sessoes">
    <h1 class="text-3xl font-bold text-amber-600 dark:text-amber-500 mb-6">Sessões de Jogo</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1">
        <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-4">Campanhas</h2>
          <select v-model="selectedCampaignId" @change="loadSessions" class="w-full p-2 border rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
            <option v-for="campaign in campaignsStore.campaigns" :key="campaign.id" :value="campaign.id">
              {{ campaign.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="md:col-span-2">
        <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-4">Sessões</h2>
          <div v-if="sessionsStore.loading">Carregando...</div>
          <div v-if="sessionsStore.error">{{ sessionsStore.error }}</div>
          <ul v-if="!sessionsStore.loading && !sessionsStore.error">
            <li v-for="session in sessionsStore.sessions" :key="session.id" class="mb-2 p-2 border-b dark:border-slate-700 flex justify-between items-center">
              <div>
                <h3 class="font-bold">{{ session.title }}</h3>
                <p>{{ new Date(session.date).toLocaleDateString() }}</p>
              </div>
              <div>
                <button @click="editSession(session)" class="text-slate-500 hover:text-amber-500 mr-2">
                  <font-awesome-icon :icon="['fas', 'pencil-alt']" />
                </button>
                <button @click="deleteSession(session.id)" class="text-slate-500 hover:text-red-500">
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </div>
            </li>
          </ul>
          <button @click="addSession" class="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">
            Nova Sessão
          </button>
        </div>
      </div>
    </div>

    <div v-if="showSessionForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 class="text-2xl font-bold mb-4">{{ sessionToEdit ? 'Editar Sessão' : 'Nova Sessão' }}</h2>
        <form @submit.prevent="saveSession">
          <div class="mb-4">
            <label for="title" class="block text-sm font-bold mb-2">Título</label>
            <input type="text" v-model="form.title" id="title" class="w-full p-2 border rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
          </div>
          <div class="mb-4">
            <label for="date" class="block text-sm font-bold mb-2">Data</label>
            <input type="date" v-model="form.date" id="date" class="w-full p-2 border rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
          </div>
          <div class="mb-4">
            <label for="summary" class="block text-sm font-bold mb-2">Resumo</label>
            <textarea v-model="form.summary" id="summary" rows="5" class="w-full p-2 border rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"></textarea>
          </div>
          <div class="flex justify-end gap-4">
            <button type="button" @click="showSessionForm = false" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
            <button type="submit" class="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useSessionsStore } from '../stores/sessions';
import { useCampaignsStore } from '../stores/campaigns';
import { useAuthStore } from '../stores/auth';

const sessionsStore = useSessionsStore();
const campaignsStore = useCampaignsStore();
const authStore = useAuthStore();

const selectedCampaignId = ref(null);
const showSessionForm = ref(false);
const sessionToEdit = ref(null);
const form = ref({
  title: '',
  date: '',
  summary: '',
  campaign_id: null
});

onMounted(async () => {
  if (authStore.user) {
    await campaignsStore.fetchCampaigns(authStore.user.id);
    if (campaignsStore.campaigns.length > 0) {
      selectedCampaignId.value = campaignsStore.campaigns[0].id;
      loadSessions();
    }
  }
});

const loadSessions = () => {
  if (selectedCampaignId.value) {
    sessionsStore.fetchSessions(selectedCampaignId.value);
  }
};

const addSession = () => {
  sessionToEdit.value = null;
  form.value = {
    title: '',
    date: new Date().toISOString().substr(0, 10),
    summary: '',
    campaign_id: selectedCampaignId.value
  };
  showSessionForm.value = true;
};

const editSession = (session) => {
  sessionToEdit.value = session;
  form.value = { ...session };
  showSessionForm.value = true;
};

const saveSession = async () => {
  if (sessionToEdit.value) {
    await sessionsStore.updateSession(form.value);
  } else {
    await sessionsStore.addSession(form.value);
  }
  showSessionForm.value = false;
};

const deleteSession = async (id) => {
  if (confirm('Tem certeza que deseja excluir esta sessão?')) {
    await sessionsStore.deleteSession(id);
  }
};

watch(selectedCampaignId, loadSessions);

</script>
