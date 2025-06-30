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
        @editEntity="editPersonagem"
        @deleteEntity="deletePersonagem"
      />

      <EntityDetailsView
        :selectedEntity="selectedPersonagem"
        :selectedCampaignName="selectedCampaignName"
      />
    </div>
  </section>

  <PersonagemForm
    v-if="showPersonagemForm"
    :personagem="personagemToEdit"
    @save="handleSavePersonagem"
    @close="handleCloseForm"
  />
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { usePersonagensStore } from '../stores/personagens';
import { useAuthStore } from '../stores/auth';
import { useCampaignsStore } from '../stores/campaigns';
import PersonagemForm from '../components/PersonagemForm.vue';
import EntityListView from '../components/EntityListView.vue';
import EntityDetailsView from '../components/EntityDetailsView.vue';

const personagensStore = usePersonagensStore();
const authStore = useAuthStore();
const campaignsStore = useCampaignsStore();

const selectedPersonagem = ref(null);
const showPersonagemForm = ref(false);
const personagemToEdit = ref(null);
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
      selectedPersonagem.value = filteredPersonagens.value[0];
    }
  }
});

const selectPersonagem = (personagem) => {
  selectedPersonagem.value = personagem;
};

const addPersonagem = () => {
  personagemToEdit.value = null;
  showPersonagemForm.value = true;
};

const editPersonagem = (personagem) => {
  personagemToEdit.value = { ...personagem }; // Clone para evitar mutação direta
  showPersonagemForm.value = true;
};

const deletePersonagem = async (id) => {
  if (confirm('Tem certeza que deseja excluir este personagem?')) {
    try {
      await personagensStore.deletePersonagem(id);
      message.value = 'Personagem excluído com sucesso!';
      messageType.value = 'success';
      await personagensStore.fetchPersonagens(selectedCampaignId.value); // Recarrega a lista
      selectedPersonagem.value = null; // Limpa a seleção
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
    } catch (error) {
      message.value = `Erro ao excluir personagem: ${error.message}`;
      messageType.value = 'error';
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
    }
  }
};

const handleSavePersonagem = async (personagemData) => {
  try {
    if (personagemData.image instanceof File) {
      const imageUrl = await personagensStore.uploadImage(personagemData.image);
      personagemData.image = imageUrl;
    } else if (personagemData.image === null) {
      // Se a imagem foi removida no formulário, defina como null no banco de dados
      personagemData.image = null;
    }

    if (personagemData.id) {
      await personagensStore.updatePersonagem(personagemData);
      message.value = 'Personagem atualizado com sucesso!';
      messageType.value = 'success';
    } else {
      await personagensStore.addPersonagem(personagemData);
      message.value = 'Personagem adicionado com sucesso!';
      messageType.value = 'success';
    }
    await personagensStore.fetchPersonagens(selectedCampaignId.value); // Recarrega a lista
    showPersonagemForm.value = false;
    personagemToEdit.value = null;
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
  } catch (error) {
    message.value = `Erro: ${error.message}`;
    messageType.value = 'error';
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
  }
};

const handleCloseForm = () => {
  showPersonagemForm.value = false;
  personagemToEdit.value = null;
};

// Watch for changes in selectedCampaignId and refetch characters
watch(selectedCampaignId, async (newCampaignId) => {
  if (authStore.user) {
    await personagensStore.fetchPersonagens(newCampaignId);
    if (filteredPersonagens.value.length > 0) {
      selectedPersonagem.value = filteredPersonagens.value[0];
    } else {
      selectedPersonagem.value = null;
    }
  }
});
</script>

