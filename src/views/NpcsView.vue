<template>
  <section id="npcs">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <EntityListView
        :entities="filteredNpcs"
        :selectedEntity="selectedNpc"
        :loading="npcsStore.loading"
        :error="npcsStore.error"
        entityTitle="Personagens do Mestre"
        :entityIcon="['fas', 'address-book']"
        :showCampaignFilter="true"
        :campaigns="campaignsStore.campaigns"
        :selectedCampaignId="selectedCampaignId"
        @update:selectedCampaignId="selectedCampaignId = $event"
        @selectEntity="selectNpc"
        @addEntity="addNpc"
        @editEntity="editNpc"
        @deleteEntity="deleteNpc"
    />

    <EntityDetailsView
      :selectedEntity="selectedNpc"
      :selectedCampaignName="selectedCampaignName"
    />
  </div>
</section>

<EditEntityForm
  v-if="showNpcForm"
  :entity-data="npcToEdit"
  entity-type="npc" @close="handleCloseForm" />

<div v-if="message" :class="{'bg-green-500': messageType === 'success', 'bg-red-500': messageType === 'error'}" class="text-white p-3 rounded-lg mt-4 text-center">
  {{ message }}
</div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useNpcsStore } from '../stores/npcs';
import { useAuthStore } from '../stores/auth';
import { useCampaignsStore } from '../stores/campaigns';
// Importe o novo componente genérico
import EditEntityForm from '../components/EditEntityForm.vue';
import EntityListView from '../components/EntityListView.vue';
import EntityDetailsView from '../components/EntityDetailsView.vue';

const npcsStore = useNpcsStore();
const authStore = useAuthStore();
const campaignsStore = useCampaignsStore();

const selectedNpc = ref(null);
const showNpcForm = ref(false);
const npcToEdit = ref(null);
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
      selectedNpc.value = filteredNpcs.value[0];
    }
  }
});

const selectNpc = (npc) => {
  selectedNpc.value = npc;
};

const addNpc = () => {
  npcToEdit.value = null;
  showNpcForm.value = true;
};

const editNpc = (npc) => {
  npcToEdit.value = { ...npc };
  showNpcForm.value = true;
};

const deleteNpc = async (id) => {
  if (confirm('Tem certeza que deseja excluir este NPC?')) {
    try {
      await npcsStore.deleteNpc(id);
      message.value = 'NPC excluído com sucesso!';
      messageType.value = 'success';
      // Removido o fetch aqui, será feito no handleCloseForm
      selectedNpc.value = null;
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
    } catch (error) {
      message.value = `Erro ao excluir NPC: ${error.message}`;
      messageType.value = 'error';
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
    }
  }
};

// Removido handleSaveNpc, pois a lógica de save está no EditEntityForm

const handleCloseForm = async () => {
  showNpcForm.value = false;
  npcToEdit.value = null;

  // 1. Recarrega a lista de NPCs do store
  await npcsStore.fetchNpcs(selectedCampaignId.value);

  // 2. Após recarregar, atualiza a referência de selectedNpc
  if (selectedNpc.value) {
    const updatedNpc = npcsStore.npcs.find(
      n => n.id === selectedNpc.value.id
    );

    if (updatedNpc) {
      selectedNpc.value = updatedNpc;
    } else {
      selectedNpc.value = null;
    }
  } else if (filteredNpcs.value.length > 0) {
    selectedNpc.value = filteredNpcs.value[0];
  }

  if (filteredNpcs.value.length === 0) {
    selectedNpc.value = null;
  }
};

watch(selectedCampaignId, async (newCampaignId) => {
  if (authStore.user) {
    await npcsStore.fetchNpcs(newCampaignId);
    if (filteredNpcs.value.length > 0) {
      selectedNpc.value = filteredNpcs.value[0];
    } else {
      selectedNpc.value = null;
    }
  }
});
</script>
