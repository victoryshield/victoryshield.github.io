<template>
  <section id="campanha">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1 p-4 rounded-lg shadow bg-white dark:bg-slate-800 max-h-[600px] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'book-open']" />
          <span>Campanhas</span>
        </h2>
        <div v-if="campaignsStore.loading" class="text-center text-slate-500 dark:text-slate-400">Carregando Campanhas...</div>
        <div v-else-if="campaignsStore.error" class="text-center text-red-500">Erro ao carregar Campanhas: {{ campaignsStore.error.message }}</div>
        <ul v-else class="space-y-1">
          <li v-for="campaign in campaignsStore.campaigns" :key="campaign.id"
            class="p-3 rounded-md cursor-pointer transition-colors duration-200"
            :class="{'bg-amber-100 dark:bg-amber-800 ring-2 ring-amber-500': selectedCampaign && selectedCampaign.id === campaign.id, 'hover:bg-amber-100 dark:hover:bg-slate-700': selectedCampaign && selectedCampaign.id !== campaign.id}"
            @click="selectCampaign(campaign)">
            <p class="font-semibold" :class="{'text-amber-800 dark:text-amber-100': selectedCampaign && selectedCampaign.id === campaign.id, 'dark:text-slate-100': selectedCampaign && selectedCampaign.id !== campaign.id}">{{ campaign.name }}</p>
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
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useCampaignsStore } from '../stores/campaigns';

const campaignsStore = useCampaignsStore();
const selectedCampaign = ref(null);

onMounted(async () => {
  await campaignsStore.fetchCampaigns();
  if (campaignsStore.campaigns.length > 0) {
    selectedCampaign.value = campaignsStore.campaigns[0];
  }
});

const selectCampaign = (campaign) => {
  selectedCampaign.value = campaign;
};
</script>
