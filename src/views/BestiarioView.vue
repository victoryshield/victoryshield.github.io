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
        @deleteEntity="deleteMonstro"
        @editEntity="editMonstro"
      />

      <EntityForm
        v-if="isEditMode"
        :entity="selectedMonstro"
        entityType="monstro"
        :campaignId="selectedCampaignId"
        :isEditMode="isEditMode"
        @save="handleSave"
        @close="handleClose"
        class="md:col-span-2"
      />

      <EntityDetailsView
        v-else-if="selectedMonstro"
        :selectedEntity="selectedMonstro"
        :selectedCampaignName="selectedCampaignName"
        entity-type="monstro"
        :loading="monstrosStore.loading"
      />

      <div v-else class="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex items-center justify-center">
        <p class="text-slate-600 dark:text-slate-400 text-lg">Selecione um monstro ou adicione um novo.</p>
      </div>
    </div>
  </section>

  <div v-if="message" :class="{'bg-green-500': messageType === 'success', 'bg-red-500': messageType === 'error'}" class="text-white p-3 rounded-lg mt-4 text-center">
    {{ message }}
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useMonstrosStore } from '../stores/monstros';
import { useAuthStore } from '../stores/auth';
import { useCampaignsStore } from '../stores/campaigns';
import EntityListView from '../components/EntityListView.vue';
import EntityForm from '../components/EntityForm.vue';
import EntityDetailsView from '../components/EntityDetailsView.vue';

const monstrosStore = useMonstrosStore();
const authStore = useAuthStore();
const campaignsStore = useCampaignsStore();

const selectedMonstro = ref(null);
const isEditMode = ref(false);
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
      selectMonstro(filteredMonstros.value[0]);
    } else {
      selectedMonstro.value = null;
      isEditMode.value = false;
    }
  }
});

const selectMonstro = (monstro) => {
  selectedMonstro.value = monstro;
  isEditMode.value = false;
};

const addMonstro = () => {
  selectedMonstro.value = null;
  isEditMode.value = true;
};

const editMonstro = (monstro) => {
  selectedMonstro.value = monstro;
  isEditMode.value = true;
};

const handleSave = async (entityData) => {
  try {
    if (entityData.id) {
      await monstrosStore.updateMonstro(entityData);
      message.value = 'Monstro atualizado com sucesso!';
    } else {
      await monstrosStore.addMonstro(entityData);
      message.value = 'Monstro adicionado com sucesso!';
    }
    messageType.value = 'success';
    isEditMode.value = false;
    await monstrosStore.fetchMonstros(selectedCampaignId.value);
    if (filteredMonstros.value.length > 0) {
      const updatedOrNewMonstro = monstrosStore.monstros.find(m => m.id === entityData.id) || filteredMonstros.value[filteredMonstros.value.length - 1];
      selectMonstro(updatedOrNewMonstro);
    } else {
      selectedMonstro.value = null;
    }
  } catch (error) {
    message.value = `Erro ao salvar monstro: ${error.message}`;
    messageType.value = 'error';
  } finally {
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
  }
};

const handleClose = () => {
  isEditMode.value = false;
  if (!selectedMonstro.value && filteredMonstros.value.length > 0) {
    selectMonstro(filteredMonstros.value[0]);
  }
};

const deleteMonstro = async (id) => {
  try {
    await monstrosStore.deleteMonstro(id);
    message.value = 'Monstro excluído com sucesso!';
    messageType.value = 'success';
    selectedMonstro.value = null;
    isEditMode.value = false;
    await monstrosStore.fetchMonstros(selectedCampaignId.value);
    if (filteredMonstros.value.length > 0) {
      selectMonstro(filteredMonstros.value[0]);
    }
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
  } catch (error) {
    message.value = `Erro ao excluir monstro: ${error.message}`;
    messageType.value = 'error';
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
  }
};

watch(selectedCampaignId, async (newCampaignId) => {
  if (authStore.user) {
    await monstrosStore.fetchMonstros(newCampaignId);
    if (filteredMonstros.value.length > 0) {
      selectMonstro(filteredMonstros.value[0]);
    } else {
      selectedMonstro.value = null;
      isEditMode.value = false;
    }
  }
});
</script>
