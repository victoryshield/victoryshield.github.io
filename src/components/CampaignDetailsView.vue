<template>
  <div class="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md h-full flex flex-col">
    <div v-if="campaign">
      <h3 class="text-2xl font-bold text-amber-700 dark:text-amber-500 mb-2">{{ campaign.name }}</h3>
      <p class="text-md text-slate-600 dark:text-slate-400 italic mb-4">{{ campaign.description || 'Nenhuma descrição.' }}</p>
      <p class="text-sm text-slate-600 dark:text-slate-400">Criada em: {{ formatDate(campaign.created_at) }}</p>

      <div class="mt-6 flex-grow flex flex-col">
        <h4 class="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2 border-b border-slate-300 dark:border-slate-600 pb-2">Detalhes do Capítulo</h4>
        <div v-if="selectedChapter" class="flex-grow p-4 border border-slate-200 dark:border-slate-600 rounded-md shadow-sm bg-slate-50 dark:bg-slate-700 overflow-y-auto">
          <h5 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">Capítulo {{ selectedChapter.chapter_number }}</h5>
          <MarkdownRenderer :markdown="selectedChapter.content" />
        </div>
        <div v-else class="text-center text-slate-500 dark:text-slate-400 flex-grow flex items-center justify-center">
          <p>Selecione um capítulo para visualizar seu conteúdo.</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-slate-500 dark:text-slate-400 h-full flex items-center justify-center">
      <p>Selecione uma Campanha na lista para ver os detalhes ou adicione uma nova.</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import MarkdownRenderer from './MarkdownRenderer.vue';

const props = defineProps({
  campaign: {
    type: Object,
    default: null
  },
  selectedChapter: {
    type: Object,
    default: null
  }
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};
</script>
