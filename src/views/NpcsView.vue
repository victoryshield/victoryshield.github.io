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

  <NpcForm
    v-if="showNpcForm"
    :npc="npcToEdit"
    @save="handleSaveNpc"
    @close="handleCloseForm"
  />
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useNpcsStore } from '../stores/npcs';
import { useAuthStore } from '../stores/auth';
import { useCampaignsStore } from '../stores/campaigns';
import NpcForm from '../components/NpcForm.vue';
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
      await npcsStore.fetchNpcs(selectedCampaignId.value); // Recarrega a lista
    } catch (error) {
      message.value = `Erro ao excluir NPC: ${error.message}`;
      messageType.value = 'error';
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
    }
  }
};

const handleSaveNpc = async (npcData) => {
  try {
    if (npcData.image instanceof File) {
      const imageUrl = await npcsStore.uploadImage(npcData.image);
      npcData.image = imageUrl;
    } else if (npcData.image === null) {
      npcData.image = null;
    }

    if (npcData.id) {
      await npcsStore.updateNpc(npcData);
      message.value = 'NPC atualizado com sucesso!';
      messageType.value = 'success';
    } else {
      await npcsStore.addNpc(npcData);
      message.value = 'NPC adicionado com sucesso!';
      messageType.value = 'success';
    }
    await npcsStore.fetchNpcs(selectedCampaignId.value); // Recarrega a lista
  } catch (error) {
    message.value = `Erro: ${error.message}`;
    messageType.value = 'error';
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
  }
};

const handleCloseForm = () => {
  showNpcForm.value = false;
  npcToEdit.value = null;
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
