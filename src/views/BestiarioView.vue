<template>
  <section id="bestiario">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1 p-4 rounded-lg shadow bg-white dark:bg-slate-800 max-h-[600px] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center justify-between">
          <div class="flex items-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'dragon']" />
            <span>Bestiário</span>
          </div>
          <button @click="addMonstro" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-1 px-3 rounded-lg text-sm">
            Adicionar
          </button>
        </h2>
        <div class="mb-4">
          <label for="campaign-filter" class="block text-gray-300 text-sm font-bold mb-2">Filtrar por Campanha:</label>
          <select id="campaign-filter" v-model="selectedCampaignId" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white">
            <option :value="null">Todas as Campanhas</option>
            <option v-for="campaign in campaignsStore.campaigns" :key="campaign.id" :value="campaign.id">
              {{ campaign.name }}
            </option>
          </select>
        </div>
        <div v-if="monstrosStore.loading" class="text-center text-slate-500 dark:text-slate-400">Carregando Monstros...</div>
        <div v-else-if="monstrosStore.error" class="text-center text-red-500">Erro ao carregar Monstros: {{ monstrosStore.error.message }}</div>
        <ul v-else class="space-y-1">
          <li v-for="monstro in filteredMonstros" :key="monstro.id"
            class="p-3 rounded-md cursor-pointer transition-colors duration-200"
            :class="{'bg-amber-100 dark:bg-amber-800 ring-2 ring-amber-500': selectedMonstro && selectedMonstro.id === monstro.id, 'hover:bg-amber-100 dark:hover:bg-slate-700': selectedMonstro && selectedMonstro.id !== monstro.id}"
            @click="selectMonstro(monstro)">
            <div class="flex justify-between items-center">
              <p class="font-semibold" :class="{'text-amber-800 dark:text-amber-100': selectedMonstro && selectedMonstro.id === monstro.id, 'dark:text-slate-100': selectedMonstro && selectedMonstro.id !== monstro.id}">{{ monstro.name }}</p>
              <div class="flex gap-x-2">
                <button @click.stop="editMonstro(monstro)" class="text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors duration-200">
                  <font-awesome-icon :icon="['fas', 'pen-to-square']" />
                </button>
                <button @click.stop="deleteMonstro(monstro.id)" class="text-red-500 hover:text-red-700 transition-colors duration-200">
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div id="monstro-details" class="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow min-h-[400px]">
        <div v-if="selectedMonstro" class="flex flex-col sm:flex-row gap-6 items-start">
          <div class="flex-shrink-0 w-full sm:w-48">
            <img :src="selectedMonstro.image || 'https://placehold.co/400x400/e2e8f0/475569?text=C'" :alt="'Retrato de ' + selectedMonstro.name" class="bg-slate-300 dark:bg-slate-700 w-full h-auto object-cover rounded-lg shadow-lg" @error="$event.target.src='https://placehold.co/400x400/e2e8f0/475569?text=C'">
          </div>
          <div class="flex-grow">
            <h3 class="text-2xl font-bold text-amber-700 dark:text-amber-500">{{ selectedMonstro.name }}</h3>
            <p class="text-md text-slate-600 dark:text-slate-400 italic mb-2">{{ selectedMonstro.concept }}</p>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">{{ selectedMonstro.archetype }} • {{ selectedMonstro.pontos }} pontos • Campanha: {{ selectedCampaignName }}</p>
            <div class="mb-4">
              <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'list-ol']" class="text-slate-500" /><span>Atributos</span></h4>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mt-2">
                <div class="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-x-3 shadow-sm border dark:border-slate-700">
                  <font-awesome-icon :icon="['fas', 'hand-fist']" class="fa-2x text-amber-700 dark:text-amber-500" />
                  <div>
                    <span class="block text-sm text-slate-600 dark:text-slate-400">Poder</span>
                    <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedMonstro.Poder }}</span>
                  </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-x-3 shadow-sm border dark:border-slate-700">
                  <font-awesome-icon :icon="['fas', 'brain']" class="fa-2x text-amber-700 dark:text-amber-500" />
                  <div>
                    <span class="block text-sm text-slate-600 dark:text-slate-400">Habilidade</span>
                    <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedMonstro.Habilidade }}</span>
                  </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-x-3 shadow-sm border dark:border-slate-700">
                  <font-awesome-icon :icon="['fas', 'shield-halved']" class="fa-2x text-amber-700 dark:text-amber-500" />
                  <div>
                    <span class="block text-sm text-slate-600 dark:text-slate-400">Resistência</span>
                    <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedMonstro.Resistencia }}</span>
                  </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-x-3 shadow-sm border dark:border-slate-700">
                  <font-awesome-icon :icon="['fas', 'bolt']" class="fa-2x text-amber-700 dark:text-amber-500" />
                  <div>
                    <span class="block text-sm text-slate-600 dark:text-slate-400">Pontos de Ação</span>
                    <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedMonstro.Pontos_Acao }}</span>
                  </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-x-3 shadow-sm border dark:border-700">
                  <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" class="fa-2x text-amber-700 dark:text-amber-500" />
                  <div>
                    <span class="block text-sm text-slate-600 dark:text-slate-400">Pontos de Mana</span>
                    <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedMonstro.Pontos_Mana }}</span>
                  </div>
                </div>
                <div class="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-x-3 shadow-sm border dark:border-700">
                  <font-awesome-icon :icon="['fas', 'heart-pulse']" class="fa-2x text-amber-700 dark:text-amber-500" />
                  <div>
                    <span class="block text-sm text-slate-600 dark:text-slate-400">Pontos de Vida</span>
                    <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedMonstro.Pontos_Vida }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-4">
              <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'graduation-cap']" class="text-slate-500" /><span>Perícias</span></h4>
              <p class="text-slate-600 dark:text-slate-400">Nenhuma</p>
            </div>
            <div class="mb-4">
              <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'thumbs-up']" class="text-green-600" /><span>Vantagens</span></h4>
              <p class="text-slate-600 dark:text-slate-400">Nenhuma</p>
            </div>
            <div>
              <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'thumbs-down']" class="text-red-600" /><span>Desvantagens</span></h4>
              <p class="text-slate-600 dark:text-slate-400">Nenhuma</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-slate-500 dark:text-slate-400">
          Selecione um Monstro na lista para ver os detalhes.
        </div>
      </div>
    </div>
    <div v-if="message" :class="{'bg-green-500': messageType === 'success', 'bg-red-500': messageType === 'error'}" class="text-white p-3 rounded-lg mt-4 text-center">
      {{ message }}
    </div>
  </section>

  <MonstroForm
    v-if="showMonstroForm"
    :monstro="monstroToEdit"
    @save="handleSaveMonstro"
    @close="handleCloseForm"
  />
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useMonstrosStore } from '../stores/monstros';
import { useAuthStore } from '../stores/auth';
import { useCampaignsStore } from '../stores/campaigns';
import MonstroForm from '../components/MonstroForm.vue';

const monstrosStore = useMonstrosStore();
const authStore = useAuthStore();
const campaignsStore = useCampaignsStore();

const selectedMonstro = ref(null);
const showMonstroForm = ref(false);
const monstroToEdit = ref(null);
const message = ref('');
const messageType = ref('');
const selectedCampaignId = ref(null);

const filteredMonstros = computed(() => {
  if (!selectedCampaignId.value) {
    return monstrosStore.monstros;
  }
  return monstrosStore.monstros.filter(m => m.campaign_id === selectedCampaignId.value);
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
    await monstrosStore.fetchMonstros(selectedCampaignId.value);
    if (filteredMonstros.value.length > 0) {
      selectedMonstro.value = filteredMonstros.value[0];
    }
  }
});

const selectMonstro = (monstro) => {
  selectedMonstro.value = monstro;
};

const addMonstro = () => {
  monstroToEdit.value = null;
  showMonstroForm.value = true;
};

const editMonstro = (monstro) => {
  monstroToEdit.value = { ...monstro };
  showMonstroForm.value = true;
};

const deleteMonstro = async (id) => {
  if (confirm('Tem certeza que deseja excluir este monstro?')) {
    try {
      await monstrosStore.deleteMonstro(id);
      message.value = 'Monstro excluído com sucesso!';
      messageType.value = 'success';
      await monstrosStore.fetchMonstros(selectedCampaignId.value); // Recarrega a lista
      selectedMonstro.value = null; // Limpa a seleção
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
    } catch (error) {
      message.value = `Erro ao excluir monstro: ${error.message}`;
      messageType.value = 'error';
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
    }
  }
};

const handleSaveMonstro = async (monstroData) => {
  try {
    if (monstroData.image instanceof File) {
      const imageUrl = await monstrosStore.uploadImage(monstroData.image);
      monstroData.image = imageUrl;
    } else if (monstroData.image === null) {
      monstroData.image = null;
    }

    if (monstroData.id) {
      await monstrosStore.updateMonstro(monstroData);
      message.value = 'Monstro atualizado com sucesso!';
      messageType.value = 'success';
    } else {
      await monstrosStore.addMonstro(monstroData);
      message.value = 'Monstro adicionado com sucesso!';
      messageType.value = 'success';
    }
    await monstrosStore.fetchMonstros(selectedCampaignId.value); // Recarrega a lista
    showMonstroForm.value = false;
    monstroToEdit.value = null;
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
  } catch (error) {
    message.value = `Erro: ${error.message}`;
    messageType.value = 'error';
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
  }
};

const handleCloseForm = () => {
  showMonstroForm.value = false;
  monstroToEdit.value = null;
};

// Watch for changes in selectedCampaignId and refetch monsters
watch(selectedCampaignId, async (newCampaignId) => {
  if (authStore.user) {
    await monstrosStore.fetchMonstros(newCampaignId);
    if (filteredMonstros.value.length > 0) {
      selectedMonstro.value = filteredMonstros.value[0];
    } else {
      selectedMonstro.value = null;
    }
  }
});
</script>
