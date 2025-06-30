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

  <EditEntityForm
    v-if="showPersonagemForm"
    :entity-data="personagemToEdit"
    entity-type="personagem" @close="handleCloseForm" />

  <div v-if="message" :class="{'bg-green-500': messageType === 'success', 'bg-red-500': messageType === 'error'}" class="text-white p-3 rounded-lg mt-4 text-center">
    {{ message }}
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { usePersonagensStore } from '../stores/personagens';
import { useAuthStore } from '../stores/auth';
import { useCampaignsStore } from '../stores/campaigns';
// Importe o novo componente genérico
import EditEntityForm from '../components/EditEntityForm.vue';
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
  personagemToEdit.value = { ...personagem };
  showPersonagemForm.value = true;
};

const deletePersonagem = async (id) => {
  if (confirm('Tem certeza que deseja excluir este personagem?')) {
    try {
      await personagensStore.deletePersonagem(id);
      message.value = 'Personagem excluído com sucesso!';
      messageType.value = 'success';
      // Removido o fetch aqui, será feito no handleCloseForm
      selectedPersonagem.value = null;
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
    } catch (error) {
      message.value = `Erro ao excluir personagem: ${error.message}`;
      messageType.value = 'error';
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
    }
  }
};

// Removido handleSavePersonagem, pois a lógica de save está no EditEntityForm

const handleCloseForm = async () => {
  showPersonagemForm.value = false;
  personagemToEdit.value = null; // Limpa a entidade para edição

  // 1. Recarrega a lista de personagens do store
  await personagensStore.fetchPersonagens(selectedCampaignId.value);

  // 2. Após recarregar, atualiza a referência de selectedPersonagem
  if (selectedPersonagem.value) {
    // Tenta encontrar a versão atualizada do personagem na nova lista
    const updatedPersonagem = personagensStore.personagens.find(
      p => p.id === selectedPersonagem.value.id
    );

    if (updatedPersonagem) {
      selectedPersonagem.value = updatedPersonagem; // Atribui a nova referência
    } else {
      // Se o personagem selecionado não for encontrado (ex: foi excluído), limpa a seleção
      selectedPersonagem.value = null;
    }
  } 
  
  // Se não havia nenhum personagem selecionado antes de abrir o formulário
  // (caso de adição de novo personagem) e agora existem personagens,
  // selecione o primeiro da lista.
  else if (filteredPersonagens.value.length > 0) {
    selectedPersonagem.value = filteredPersonagens.value[0];
  }

  // Garante que selectedPersonagem é nulo se não houver personagens na lista filtrada
  if (filteredPersonagens.value.length === 0) {
    selectedPersonagem.value = null;
  }
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
