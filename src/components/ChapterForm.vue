<template>
  <div class="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md h-full flex flex-col">
    <h2 class="text-2xl font-bold mb-4 text-amber-700 dark:text-amber-500">{{ chapter?.id ? 'Editar Capítulo' : 'Novo Capítulo' }}</h2>
    <form @submit.prevent="saveChapter" class="flex flex-col flex-grow">
      <div class="mb-4">
        <label for="chapter-number" class="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">Número do Capítulo:</label>
        <input
          type="number"
          id="chapter-number"
          v-model="currentChapter.chapter_number"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
          required
        />
      </div>
      <div class="mb-4 flex-grow flex flex-col">
        <label for="chapter-content" class="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">Conteúdo (Markdown):</label>
        <textarea
          id="chapter-content"
          v-model="currentChapter.content"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 flex-grow"
          rows="10"
        ></textarea>
      </div>
      <div class="flex justify-end gap-x-2 mt-4">
        <button
          type="button"
          @click="$emit('close')"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Salvar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  chapter: {
    type: Object,
    default: null
  },
  campaignId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['save', 'close']);

const currentChapter = ref({});

watch(() => props.chapter, (newChapter) => {
  currentChapter.value = newChapter ? { ...newChapter } : { campaign_id: props.campaignId, chapter_number: 1, content: '' };
}, { immediate: true });

const saveChapter = () => {
  emit('save', currentChapter.value);
};
</script>
