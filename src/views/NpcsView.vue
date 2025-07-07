<template>
  <section id="npcs">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <EntityListView :entities="filteredNpcs" :selectedEntity="selectedNpc" :loading="npcsStore.loading"
        :error="npcsStore.error" entityTitle="Personagens do Mestre" :entityIcon="['fas', 'address-book']"
        :showCampaignFilter="true" :campaigns="campaignsStore.campaigns" :selectedCampaignId="selectedCampaignId"
        @update:selectedCampaignId="selectedCampaignId = $event" @selectEntity="selectNpc" @addEntity="addNpc"
        @deleteEntity="deleteNpc" @editEntity="editNpc" />

      <EntityForm v-if="isEditMode" :entity="selectedNpc" entityType="npc" :campaignId="selectedCampaignId"
        :isEditMode="isEditMode" @save="handleSave" @close="handleClose" class="md:col-span-2" />

      <EntityDetailsView v-else-if="selectedNpc" :selectedEntity="selectedNpc"
        :selectedCampaignName="selectedCampaignName" entity-type="npc" :loading="npcsStore.loading" />

      <div v-else class="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex items-center justify-center">
        <p class="text-slate-600 dark:text-slate-400 text-lg">Selecione um NPC ou adicione um novo.</p>
      </div>
    </div>
  </section>

  <div v-if="message" :class="{ 'bg-green-500': messageType === 'success', 'bg-red-500': messageType === 'error' }"
    class="text-white p-3 rounded-lg mt-4 text-center">
    {{ message }}
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useNpcsStore } from '../stores/npcs';
import { useAuthStore } from '../stores/auth';
import { useCampaignsStore } from '../stores/campaigns';
import EntityListView from '../components/EntityListView.vue';
import EntityForm from '../components/EntityForm.vue';
import EntityDetailsView from '../components/EntityDetailsView.vue';

const npcsStore = useNpcsStore();
const authStore = useAuthStore();
const campaignsStore = useCampaignsStore();

const selectedNpc = ref(null);
const isEditMode = ref(false);
const message = ref('');
const messageType = ref('');
const selectedCampaignId = ref(null);

const filteredNpcs = computed(() => {
  if (!selectedCampaignId.value) {
    return npcsStore.npcs;
  }
  return npcsStore.npcs.filter(n => n.campaign_id === selectedCampaignId.value);
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
    await npcsStore.fetchNpcs(selectedCampaignId.value);
    if (filteredNpcs.value.length > 0) {
      selectNpc(filteredNpcs.value[0]);
    } else {
      selectedNpc.value = null;
      isEditMode.value = false;
    }
  }
});

const selectNpc = (npc) => {
  selectedNpc.value = npc;
  isEditMode.value = false;
};

const addNpc = () => {
  selectedNpc.value = null;
  isEditMode.value = true;
};

const editNpc = (npc) => {
  selectedNpc.value = npc;
  isEditMode.value = true;
};

const handleSave = async (entityData) => {
  try {
    if (entityData.id) {
      await npcsStore.updateNpc(entityData);
      message.value = 'NPC atualizado com sucesso!';
    } else {
      await npcsStore.addNpc(entityData);
      message.value = 'NPC adicionado com sucesso!';
    }
    messageType.value = 'success';
    isEditMode.value = false;
    await npcsStore.fetchNpcs(selectedCampaignId.value);
    if (filteredNpcs.value.length > 0) {
      const updatedOrNewNpc = npcsStore.npcs.find(n => n.id === entityData.id) || filteredNpcs.value[filteredNpcs.value.length - 1];
      selectNpc(updatedOrNewNpc);
    } else {
      selectedNpc.value = null;
    }
  } catch (error) {
    message.value = `Erro ao salvar NPC: ${error.message}`;
    messageType.value = 'error';
  } finally {
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
  }
};

const handleClose = () => {
  isEditMode.value = false;
  if (!selectedNpc.value && filteredNpcs.value.length > 0) {
    selectNpc(filteredNpcs.value[0]);
  }
};

const deleteNpc = async (id) => {
  try {
    await npcsStore.deleteNpc(id);
    message.value = 'NPC excluído com sucesso!';
    messageType.value = 'success';
    selectedNpc.value = null;
    isEditMode.value = false;
    await npcsStore.fetchNpcs(selectedCampaignId.value);
    if (filteredNpcs.value.length > 0) {
      selectNpc(filteredNpcs.value[0]);
    }
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
  } catch (error) {
    message.value = `Erro ao excluir NPC: ${error.message}`;
    messageType.value = 'error';
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
  }
};

watch(selectedCampaignId, async (newCampaignId) => {
  if (authStore.user) {
    await npcsStore.fetchNpcs(newCampaignId);
    if (filteredNpcs.value.length > 0) {
      selectNpc(filteredNpcs.value[0]);
    } else {
      selectedNpc.value = null;
      isEditMode.value = false;
    }
  }
});
</script>
