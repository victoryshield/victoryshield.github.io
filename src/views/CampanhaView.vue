<template>
  <section id="campanha">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1 p-4 rounded-lg shadow bg-white dark:bg-slate-800 max-h-[600px] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center justify-between">
          <div class="flex items-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'book-open']" />
            <span>Campanhas</span>
          </div>
          <button @click="addCampaign" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-1 px-3 rounded-lg text-sm">
            Adicionar
          </button>
        </h2>
        <div v-if="campaignsStore.loading" class="text-center text-slate-500 dark:text-slate-400">Carregando Campanhas...</div>
        <div v-else-if="campaignsStore.error" class="text-center text-red-500">Erro ao carregar Campanhas: {{ campaignsStore.error.message }}</div>
        <ul v-else class="space-y-1">
          <li v-for="campaign in campaignsStore.campaigns" :key="campaign.id"
            class="p-3 rounded-md cursor-pointer transition-colors duration-200"
            :class="{'bg-amber-100 dark:bg-amber-800 ring-2 ring-amber-500': selectedCampaign && selectedCampaign.id === campaign.id, 'hover:bg-amber-100 dark:hover:bg-slate-700': selectedCampaign && selectedCampaign.id !== campaign.id}"
            @click="selectCampaign(campaign)">
            <div class="flex justify-between items-center">
              <p class="font-semibold" :class="{'text-amber-800 dark:text-amber-100': selectedCampaign && selectedCampaign.id === campaign.id, 'dark:text-slate-100': selectedCampaign && selectedCampaign.id !== campaign.id}">{{ campaign.name }}</p>
              <div class="flex gap-x-2">
                <button @click.stop="editCampaign(campaign)" class="text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors duration-200">
                  <font-awesome-icon :icon="['fas', 'pen-to-square']" />
                </button>
                <button @click.stop="deleteCampaign(campaign.id)" class="text-red-500 hover:text-red-700 transition-colors duration-200">
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div id="campaign-details" class="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow min-h-[400px]">
        <div v-if="selectedCampaign">
          <h3 class="text-2xl font-bold text-amber-700 dark:text-amber-500 mb-2">{{ selectedCampaign.name }}</h3>
          <p class="text-md text-slate-600 dark:text-slate-400 italic mb-4">{{ selectedCampaign.description }}</p>
          
          <!-- Adicionar mais detalhes da campanha aqui conforme necessário -->

        </div>
        <div v-else class="text-center text-slate-500 dark:text-slate-400">
          Selecione uma Campanha na lista para ver os detalhes.
        </div>
      </div>
    </div>
    <div v-if="message" :class="{'bg-green-500': messageType === 'success', 'bg-red-500': messageType === 'error'}" class="text-white p-3 rounded-lg mt-4 text-center">
      {{ message }}
    </div>
  </section>

  <CampaignForm
    v-if="showCampaignForm"
    :campaign="campaignToEdit"
    @save="handleSaveCampaign"
    @close="handleCloseForm"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useCampaignsStore } from '../stores/campaigns';
import { useAuthStore } from '../stores/auth';
import CampaignForm from '../components/CampaignForm.vue';

const campaignsStore = useCampaignsStore();
const authStore = useAuthStore();
const selectedCampaign = ref(null);
const showCampaignForm = ref(false);
const campaignToEdit = ref(null);
const message = ref('');
const messageType = ref('');

onMounted(async () => {
  if (authStore.user) {
    await campaignsStore.fetchCampaigns(authStore.user.id);
    if (campaignsStore.campaigns.length > 0) {
      selectedCampaign.value = campaignsStore.campaigns[0];
    }
  }
});

const selectCampaign = (campaign) => {
  selectedCampaign.value = campaign;
};

const addCampaign = () => {
  campaignToEdit.value = null;
  showCampaignForm.value = true;
};

const editCampaign = (campaign) => {
  campaignToEdit.value = { ...campaign };
  showCampaignForm.value = true;
};

const deleteCampaign = async (id) => {
  if (confirm('Tem certeza que deseja excluir esta campanha?')) {
    try {
      await campaignsStore.deleteCampaign(id);
      message.value = 'Campanha excluída com sucesso!';
      messageType.value = 'success';
      await campaignsStore.fetchCampaigns(authStore.user.id); // Recarrega a lista
      selectedCampaign.value = null; // Limpa a seleção
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
    } catch (error) {
      message.value = `Erro ao excluir campanha: ${error.message}`;
      messageType.value = 'error';
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
    }
  }
};

const handleSaveCampaign = async (campaignData) => {
  try {
    if (campaignData.id) {
      await campaignsStore.updateCampaign(campaignData);
      message.value = 'Campanha atualizada com sucesso!';
      messageType.value = 'success';
    } else {
      campaignData.user_id = authStore.user.id; // Atribui o user_id
      await campaignsStore.addCampaign(campaignData);
      message.value = 'Campanha adicionada com sucesso!';
      messageType.value = 'success';
    }
    await campaignsStore.fetchCampaigns(authStore.user.id); // Recarrega a lista
    showCampaignForm.value = false;
    campaignToEdit.value = null;
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
  } catch (error) {
    message.value = `Erro: ${error.message}`;
    messageType.value = 'error';
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
  }
};

const handleCloseForm = () => {
  showCampaignForm.value = false;
  campaignToEdit.value = null;
};
</script>
