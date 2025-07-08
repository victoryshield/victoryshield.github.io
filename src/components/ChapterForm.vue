<template>
  <div class="p-4 rounded-lg shadow-md bg-white dark:bg-slate-800">
    <h3 class="text-2xl font-bold text-amber-700 dark:text-amber-500 mb-4">{{ chapter ? 'Editar Capítulo' : 'Novo Capítulo' }}</h3>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="chapter_number" class="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">Número do Capítulo:</label>
          <input
            type="number"
            id="chapter_number"
            v-model.number="form.chapter_number"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 dark:text-slate-300 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500"
          >
          <p v-if="validationErrors.chapter_number" class="text-red-500 text-xs italic mt-1">{{ validationErrors.chapter_number }}</p>
        </div>
        <div class="mb-4">
          <label for="content" class="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">Conteúdo:</label>
          <textarea
            id="content"
            v-model="form.content"
            rows="10"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 dark:text-slate-300 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-600 border-slate-300 dark:border-slate-500"
          ></textarea>
          <p v-if="validationErrors.content" class="text-red-500 text-xs italic mt-1">{{ validationErrors.content }}</p>
        </div>
        <div class="flex items-center justify-end gap-x-4">
          <button
            type="button"
            @click="closeForm"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white dark:hover:bg-slate-500 flex items-center gap-x-2"
          >
            <font-awesome-icon :icon="['fas', 'times']" />
            <span>Cancelar</span>
          </button>
          <button
            type="submit"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex items-center gap-x-2"
          >
            <font-awesome-icon :icon="['fas', 'save']" />
            <span>Salvar</span>
          </button>
        </div>
      </form>
    </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

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

const form = ref({
  id: null, // Explicitly include id, even if null for new chapters
  campaign_id: props.campaignId,
  chapter_number: null,
  content: ''
});

const validationErrors = ref({});

watch(() => props.chapter, (newChapter) => {
  if (newChapter) {
    // Update existing form.value properties
    Object.assign(form.value, newChapter);
  } else {
    // Reset form for new chapter
    form.value.id = null;
    form.value.campaign_id = props.campaignId;
    form.value.chapter_number = null;
    form.value.content = '';
  }
  validationErrors.value = {}; // Clear errors on chapter change
}, { immediate: true });

const submitForm = () => {
  if (validateForm()) {
    
    // Create a payload that only includes the ID if it's an existing chapter
    const payload = { ...form.value };
    if (!props.chapter) {
      delete payload.id; // Remove id for new chapters
    }
    emit('save', payload);
  }
};

const validateForm = () => {
  validationErrors.value = {};
  let isValid = true;

  if (!form.value.chapter_number) {
    validationErrors.value.chapter_number = 'O número do capítulo é obrigatório.';
    isValid = false;
  } else if (form.value.chapter_number <= 0) {
    validationErrors.value.chapter_number = 'O número do capítulo deve ser maior que zero.';
    isValid = false;
  }

  if (!form.value.content || form.value.content.trim() === '') {
    validationErrors.value.content = 'O conteúdo do capítulo é obrigatório.';
    isValid = false;
  }

  return isValid;
};

const closeForm = () => {
  emit('close');
};
</script>

<style scoped>
/* Adicione estilos específicos para este componente aqui, se necessário */
</style>