<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold text-amber-700 dark:text-amber-500 mb-4">{{ session?.id ? 'Editar Sessão' : 'Nova Sessão' }}</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
        <input
          type="text"
          id="title"
          v-model="formData.title"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          required
        />
      </div>

      <div class="mb-4">
        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
        <textarea
          id="description"
          v-model="formData.description"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        ></textarea>
      </div>

      <div class="mb-4">
        <label for="comeco_forte" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Começo Forte</label>
        <textarea
          id="comeco_forte"
          v-model="formData.comeco_forte"
          rows="2"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        ></textarea>
      </div>

      <div class="mb-4">
        <label for="gancho_proxima_aventura" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Gancho Próxima Aventura</label>
        <textarea
          id="gancho_proxima_aventura"
          v-model="formData.gancho_proxima_aventura"
          rows="2"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        ></textarea>
      </div>

      <div class="flex justify-end space-x-2">
        <button
          type="button"
          @click="emit('close')"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white dark:hover:bg-slate-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
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
  session: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['save', 'close']);

const formData = ref({
  title: '',
  description: '',
  comeco_forte: '',
  gancho_proxima_aventura: '',
});

watch(() => props.session, (newSession) => {
  if (newSession) {
    formData.value = { ...newSession };
  } else {
    // Reset form for new session creation
    formData.value = {
      title: '',
      description: '',
      comeco_forte: '',
      gancho_proxima_aventura: '',
    };
  }
}, { immediate: true });

const submitForm = () => {
  emit('save', formData.value);
};
</script>
