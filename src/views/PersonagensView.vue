<template>
  <section id="personagens">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <EntityListView
        :entities="filteredPersonagens"
        :selectedEntity="selectedPersonagem"
        :loading="personagensStore.loading"
        :error="personagensStore.error"
        entityTitle="Personagens Jogadores"
        :entityIcon="['fas', 'users']"
        :showCampaignFilter="true"
        :campaigns="campaignsStore.campaigns"
        :selectedCampaignId="selectedCampaignId"
        @update:selectedCampaignId="selectedCampaignId = $event"
        @selectEntity="selectPersonagem"
        @addEntity="addPersonagem"
        @deleteEntity="deletePersonagem"
        @editEntity="editPersonagem"
      />

      <EntityForm
        v-if="isEditMode"
        :entity="selectedPersonagem"
        entityType="personagem"
        :campaignId="selectedCampaignId"
        :isEditMode="isEditMode"
        @save="handleSave"
        @close="handleClose"
        class="md:col-span-2"
      />

      <EntityDetailsView
        v-else-if="selectedPersonagem"
        :selectedEntity="selectedPersonagem"
        :selectedCampaignName="selectedCampaignName"
        entity-type="personagem"
        :loading="personagensStore.loading"
      />

      <div v-else class="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex items-center justify-center">
        <p class="text-slate-600 dark:text-slate-400 text-lg">Selecione um personagem ou adicione um novo.</p>
      </div>
    </div>
  </section>

  <div v-if="message" :class="{'bg-green-500': messageType === 'success', 'bg-red-500': messageType === 'error'}" class="text-white p-3 rounded-lg mt-4 text-center">
    {{ message }}
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { usePersonagensStore } from '../stores/personagens';
import { useAuthStore } from '../stores/auth';
import { useCampaignsStore } from '../stores/campaigns';
import EntityListView from '../components/EntityListView.vue';
import EntityForm from '../components/EntityForm.vue';
import EntityDetailsView from '../components/EntityDetailsView.vue';

const personagensStore = usePersonagensStore();
const authStore = useAuthStore();
const campaignsStore = useCampaignsStore();

const selectedPersonagem = ref(null);
const isEditMode = ref(false);
const message = ref('');
const messageType = ref('');
const selectedCampaignId = ref(null);

const filteredPersonagens = computed(() => {
  if (!selectedCampaignId.value) {
    return personagensStore.personagens;
  }
  return personagensStore.personagens.filter(p => p.campaign_id === selectedCampaignId.value);
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
    await personagensStore.fetchPersonagens(selectedCampaignId.value);
    if (filteredPersonagens.value.length > 0) {
      selectPersonagem(filteredPersonagens.value[0]);
    } else {
      selectedPersonagem.value = null;
      isEditMode.value = false;
    }
  }
});

const selectPersonagem = (personagem) => {
  selectedPersonagem.value = personagem;
  isEditMode.value = false;
};

const addPersonagem = () => {
  selectedPersonagem.value = null;
  isEditMode.value = true;
};

const editPersonagem = (personagem) => {
  selectedPersonagem.value = personagem;
  isEditMode.value = true;
};

const handleSave = async (entityData) => {
  try {
    if (entityData.id) {
      await personagensStore.updatePersonagem(entityData);
      message.value = 'Personagem atualizado com sucesso!';
    } else {
      await personagensStore.addPersonagem(entityData);
      message.value = 'Personagem adicionado com sucesso!';
    }
    messageType.value = 'success';
    isEditMode.value = false;
    await personagensStore.fetchPersonagens(selectedCampaignId.value);
    if (filteredPersonagens.value.length > 0) {
      const updatedOrNewPersonagem = personagensStore.personagens.find(p => p.id === entityData.id) || filteredPersonagens.value[filteredPersonagens.value.length - 1];
      selectPersonagem(updatedOrNewPersonagem);
    } else {
      selectedPersonagem.value = null;
    }
  } catch (error) {
    message.value = `Erro ao salvar personagem: ${error.message}`;
    messageType.value = 'error';
  } finally {
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
  }
};

const handleClose = () => {
  isEditMode.value = false;
  if (!selectedPersonagem.value && filteredPersonagens.value.length > 0) {
    selectPersonagem(filteredPersonagens.value[0]);
  }
};

const deletePersonagem = async (id) => {
  try {
    await personagensStore.deletePersonagem(id);
    message.value = 'Personagem excluído com sucesso!';
    messageType.value = 'success';
    selectedPersonagem.value = null;
    isEditMode.value = false;
    await personagensStore.fetchPersonagens(selectedCampaignId.value);
    if (filteredPersonagens.value.length > 0) {
      selectPersonagem(filteredPersonagens.value[0]);
    }
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
  } catch (error) {
    message.value = `Erro ao excluir personagem: ${error.message}`;
    messageType.value = 'error';
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
  }
};

watch(selectedCampaignId, async (newCampaignId) => {
  if (authStore.user) {
    await personagensStore.fetchPersonagens(newCampaignId);
    if (filteredPersonagens.value.length > 0) {
      selectPersonagem(filteredPersonagens.value[0]);
    } else {
      selectedPersonagem.value = null;
      isEditMode.value = false;
    }
  }
});
</script>
