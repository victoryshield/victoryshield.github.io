<template>
  <section id="bestiario">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <EntityListView
        :entities="filteredMonstros"
        :selectedEntity="selectedMonstro"
        :loading="monstrosStore.loading"
        :error="monstrosStore.error"
        entityTitle="Bestiário"
        :entityIcon="['fas', 'dragon']"
        :showCampaignFilter="true"
        :campaigns="campaignsStore.campaigns"
        :selectedCampaignId="selectedCampaignId"
        @update:selectedCampaignId="selectedCampaignId = $event"
        @selectEntity="selectMonstro"
        @addEntity="addMonstro"
        @editEntity="editMonstro"
        @deleteEntity="deleteMonstro"
      />

      <EntityDetailsView
        :selectedEntity="selectedMonstro"
        :selectedCampaignName="selectedCampaignName"
      />
    </div>
    <div v-if="message" :class="{'bg-green-500': messageType === 'success', 'bg-red-500': messageType === 'error'}" class="text-white p-3 rounded-lg mt-4 text-center">
      {{ message }}
    </div>
  </section>

  <EditEntityForm
    v-if="showMonstroForm"
    :entity-data="monstroToEdit"
    entity-type="monstro" @close="handleCloseForm" />
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useMonstrosStore } from '../stores/monstros';
import { useAuthStore } from '../stores/auth';
import { useCampaignsStore } from '../stores/campaigns';
// Importe o novo componente genérico
import EditEntityForm from '../components/EditEntityForm.vue';
import EntityListView from '../components/EntityListView.vue';
import EntityDetailsView from '../components/EntityDetailsView.vue';

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
      // Removido o fetch aqui, será feito no handleCloseForm
      selectedMonstro.value = null;
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
    } catch (error) {
      message.value = `Erro ao excluir monstro: ${error.message}`;
      messageType.value = 'error';
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
    }
  }
};

// Removido handleSaveMonstro, pois a lógica de save está no EditEntityForm

const handleCloseForm = async () => {
  showMonstroForm.value = false;
  monstroToEdit.value = null;

  // 1. Recarrega a lista de Monstros do store
  await monstrosStore.fetchMonstros(selectedCampaignId.value);

  // 2. Após recarregar, atualiza a referência de selectedMonstro
  if (selectedMonstro.value) {
    const updatedMonstro = monstrosStore.monstros.find(
      m => m.id === selectedMonstro.value.id
    );

    if (updatedMonstro) {
      selectedMonstro.value = updatedMonstro;
    } else {
      selectedMonstro.value = null;
    }
  } else if (filteredMonstros.value.length > 0) {
    selectedMonstro.value = filteredMonstros.value[0];
  }

  if (filteredMonstros.value.length === 0) {
    selectedMonstro.value = null;
  }
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
