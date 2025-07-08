<template>
  <section id="campanha" class="h-full">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      <EntityListView :entities="campaignsStore.campaigns" :selectedEntity="selectedCampaign"
        :loading="campaignsStore.loading" :error="campaignsStore.error" entityTitle="Campanhas"
        :entityIcon="['fas', 'book-open']" :showCampaignFilter="false" @selectEntity="selectCampaign"
        @addEntity="addCampaign" @deleteEntity="deleteCampaign" @editEntity="editCampaign"
        :nestedEntitiesByParent="chaptersByCampaign" :selectedNestedEntity="selectedChapter"
        nestedEntityTitle="Capítulo" :nestedEntityIcon="['fas', 'bookmark']"
        @selectNestedEntity="selectChapter" @addNestedEntity="addChapterForCampaign" @editNestedEntity="editChapterForCampaign" @deleteNestedEntity="deleteChapterForCampaign"
        class="h-full overflow-y-auto" />

      <div class="md:col-span-2 h-full">
        <CampaignDetailsView v-if="selectedCampaign && !isEditMode && !isChapterEditMode" :campaign="selectedCampaign" :selectedChapter="selectedChapter"
          @startEditing="editCampaign(selectedCampaign)" class="h-full" />
        <CampaignForm v-else-if="isEditMode" :campaign="campaignToEdit" @save="handleSaveCampaign" @close="handleCloseForm"
          class="h-full" />
        <ChapterForm v-else-if="isChapterEditMode" :chapter="chapterToEdit" :campaignId="selectedCampaign.id"
          @save="handleSaveChapter" @close="handleCloseChapterForm" class="h-full" />
      </div>
    </div>
    <div v-if="message" :class="{ 'bg-green-500': messageType === 'success', 'bg-red-500': messageType === 'error' }"
      class="text-white p-3 rounded-lg mt-4 text-center">
      {{ message }}
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useCampaignsStore } from '../stores/campaigns';
import { useAuthStore } from '../stores/auth';
import { useCampaignChaptersStore } from '../stores/campaignChapters';
import { storeToRefs } from 'pinia';
import EntityListView from '../components/EntityListView.vue';
import CampaignForm from '../components/CampaignForm.vue';
import CampaignDetailsView from '../components/CampaignDetailsView.vue';
import ChapterForm from '../components/ChapterForm.vue';

const campaignsStore = useCampaignsStore();
const authStore = useAuthStore();
const campaignChaptersStore = useCampaignChaptersStore();
const { campaigns, loading, error, activeCampaign } = storeToRefs(campaignsStore);

const selectedCampaign = ref(null);
const isEditMode = ref(false);
const campaignToEdit = ref(null);
const message = ref('');
const messageType = ref('');

const chaptersByCampaign = ref({});
const selectedChapter = ref(null);
const isChapterEditMode = ref(false);
const chapterToEdit = ref(null);

const selectCampaign = (campaign) => {
  selectedCampaign.value = campaign;
  isEditMode.value = false;
};

const addCampaign = () => {
  campaignToEdit.value = null;
  isEditMode.value = true;
};

const editCampaign = (campaign) => {
  campaignToEdit.value = { ...campaign };
  isEditMode.value = true;
};

const deleteCampaign = async (id) => {
  if (confirm('Tem certeza que deseja excluir esta campanha? Isso excluirá todos os personagens, npcs e sessões associados!')) {
    try {
      await campaignsStore.deleteCampaign(id);
      message.value = 'Campanha excluída com sucesso!';
      messageType.value = 'success';
      selectedCampaign.value = null;
      isEditMode.value = false;
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
    } catch (error) {
      message.value = `Erro ao excluir campanha: ${error.message}`;
      messageType.value = 'error';
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
    }
  }
};

const handleSaveCampaign = async (campaignData) => {
  try {
    if (campaignData.id) {
      await campaignsStore.updateCampaign(campaignData);
      message.value = 'Campanha atualizada com sucesso!';
      messageType.value = 'success';
    } else {
      campaignData.user_id = authStore.user.id; // Atribui o user_id
      await campaignsStore.addCampaign(campaignData);
      message.value = 'Campanha adicionada com sucesso!';
      messageType.value = 'success';
    }
    isEditMode.value = false;
    campaignToEdit.value = null;
    // Re-fetch campaigns to update the list and potentially activeCampaign
    await campaignsStore.fetchCampaigns(authStore.user.id);
    if (campaignsStore.campaigns.length > 0 && !selectedCampaign.value) {
      selectedCampaign.value = campaignsStore.campaigns[0];
    } else if (campaignsStore.campaigns.length > 0 && campaignData.id) {
      // If an existing campaign was updated, re-select it to show updated details
      selectedCampaign.value = campaignsStore.campaigns.find(c => c.id === campaignData.id) || campaignsStore.campaigns[0];
    }
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
  } catch (error) {
    message.value = `Erro: ${error.message}`;
    messageType.value = 'error';
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
  }
};

const handleCloseForm = () => {
  isEditMode.value = false;
  campaignToEdit.value = null;
  if (!selectedCampaign.value && campaignsStore.campaigns.length > 0) {
    selectedCampaign.value = campaignsStore.campaigns[0];
  }
};

const fetchChaptersForCampaigns = async () => {
  for (const campaign of campaigns.value) {
    await campaignChaptersStore.fetchChapters(campaign.id);
    chaptersByCampaign.value[campaign.id] = campaignChaptersStore.chapters;
  }
};

const selectChapter = (chapter) => {
  selectedChapter.value = chapter;
  isChapterEditMode.value = false;
};

const addChapterForCampaign = (campaignId) => {
  selectedCampaign.value = campaigns.value.find(c => c.id === campaignId);
  chapterToEdit.value = null;
  selectedChapter.value = null;
  isChapterEditMode.value = true;
};

const editChapterForCampaign = (chapter) => {
  selectedCampaign.value = campaigns.value.find(c => c.id === chapter.campaign_id);
  chapterToEdit.value = { ...chapter };
  selectedChapter.value = chapter;
  isChapterEditMode.value = true;
};

const deleteChapterForCampaign = async (chapterId) => {
  if (confirm('Tem certeza que deseja excluir este capítulo?')) {
    try {
      const chapterToDelete = chaptersByCampaign.value[selectedCampaign.value.id].find(c => c.id === chapterId);
      await campaignChaptersStore.deleteChapter(chapterId);
      message.value = 'Capítulo excluído com sucesso!';
      messageType.value = 'success';
      // Re-fetch chapters for the specific campaign
      await campaignChaptersStore.fetchChapters(selectedCampaign.value.id);
      chaptersByCampaign.value[selectedCampaign.value.id] = campaignChaptersStore.chapters;
      if (selectedChapter.value && selectedChapter.value.id === chapterId) {
        selectedChapter.value = null; // Clear selected chapter if deleted
      }
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
    } catch (error) {
      message.value = `Erro ao excluir capítulo: ${error.message}`;
      messageType.value = 'error';
      setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
    }
  }
};

const handleSaveChapter = async (chapterData) => {
  try {
    if (chapterData.id) {
      await campaignChaptersStore.updateChapter(chapterData);
      message.value = 'Capítulo atualizado com sucesso!';
      messageType.value = 'success';
    } else {
      await campaignChaptersStore.addChapter(chapterData);
      message.value = 'Capítulo adicionado com sucesso!';
      messageType.value = 'success';
    }
    isChapterEditMode.value = false;
    chapterToEdit.value = null;
    // Re-fetch chapters for the specific campaign
    await campaignChaptersStore.fetchChapters(selectedCampaign.value.id);
    chaptersByCampaign.value[selectedCampaign.value.id] = campaignChaptersStore.chapters;
    // Select the newly saved/updated chapter
    if (chapterData.id) {
      selectedChapter.value = chaptersByCampaign.value[selectedCampaign.value.id].find(c => c.id === chapterData.id);
    } else {
      selectedChapter.value = chaptersByCampaign.value[selectedCampaign.value.id].sort((a, b) => a.chapter_number - b.chapter_number)[chaptersByCampaign.value[selectedCampaign.value.id].length - 1];
    }
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 3000);
  } catch (error) {
    message.value = `Erro ao salvar capítulo: ${error.message}`;
    messageType.value = 'error';
    setTimeout(() => { message.value = ''; messageType.value = ''; }, 5000);
  }
};

const handleCloseChapterForm = () => {
  isChapterEditMode.value = false;
  chapterToEdit.value = null;
  if (!selectedChapter.value && chaptersByCampaign.value[selectedCampaign.value.id] && chaptersByCampaign.value[selectedCampaign.value.id].length > 0) {
    selectedChapter.value = chaptersByCampaign.value[selectedCampaign.value.id].sort((a, b) => a.chapter_number - b.chapter_number)[0];
  }
};

// Watch for changes in campaigns and set selectedCampaign if none is selected
watch(campaigns, async (newCampaigns) => {
  if (newCampaigns.length > 0) {
    if (!selectedCampaign.value || !newCampaigns.some(c => c.id === selectedCampaign.value.id)) {
      selectedCampaign.value = newCampaigns[0];
    }
    await fetchChaptersForCampaigns();
    if (selectedCampaign.value && chaptersByCampaign.value[selectedCampaign.value.id] && chaptersByCampaign.value[selectedCampaign.value.id].length > 0) {
      selectedChapter.value = chaptersByCampaign.value[selectedCampaign.value.id].sort((a, b) => a.chapter_number - b.chapter_number)[0];
    } else {
      selectedChapter.value = null;
    }
  } else {
    selectedCampaign.value = null;
    selectedChapter.value = null;
    chaptersByCampaign.value = {};
  }
}, { immediate: true });

watch(selectedCampaign, async (newCampaign) => {
  if (newCampaign) {
    await campaignChaptersStore.fetchChapters(newCampaign.id);
    chaptersByCampaign.value[newCampaign.id] = campaignChaptersStore.chapters;
    if (chaptersByCampaign.value[newCampaign.id] && chaptersByCampaign.value[newCampaign.id].length > 0) {
      selectedChapter.value = chaptersByCampaign.value[newCampaign.id].sort((a, b) => a.chapter_number - b.chapter_number)[0];
    } else {
      selectedChapter.value = null;
    }
  }
});

onMounted(async () => {
  if (authStore.user) {
    await campaignsStore.fetchCampaigns(authStore.user.id);
  }
});
</script>
