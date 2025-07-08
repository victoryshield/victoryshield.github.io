<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-bold mb-4 text-amber-500">{{ isEditing ? 'Editar Campanha' : 'Nova Campanha' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="name" class="block text-gray-300 text-sm font-bold mb-2">Nome da Campanha:</label>
          <input type="text" id="name" v-model="form.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white" required>
          <p v-if="validationErrors.name" class="text-red-500 text-xs italic mt-1">{{ validationErrors.name }}</p>
        </div>
        <div class="mb-6">
          <label for="description" class="block text-gray-300 text-sm font-bold mb-2">Descrição:</label>
          <textarea id="description" v-model="form.description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white" rows="4"></textarea>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white dark:hover:bg-slate-500 flex items-center justify-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'times']" />
            <span>Cancelar</span>
          </button>
          <button type="submit" class="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex items-center justify-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'save']" />
            <span>{{ isEditing ? 'Salvar Alterações' : 'Criar Campanha' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  campaign: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'save']);

const isEditing = ref(false);
const form = ref({
  id: null,
  name: '',
  description: '',
});

const validationErrors = ref({});

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    description: '',
  };
  validationErrors.value = {};
};

watch(() => props.campaign, (newVal) => {
  if (newVal) {
    isEditing.value = true;
    Object.assign(form.value, newVal);
  } else {
    isEditing.value = false;
    resetForm();
  }
}, { immediate: true });

const validateForm = () => {
  validationErrors.value = {};
  if (!form.value.name) {
    validationErrors.value.name = 'Nome da campanha é obrigatório.';
  }
  return Object.keys(validationErrors.value).length === 0;
};

const handleSubmit = () => {
  if (validateForm()) {
    emit('save', form.value);
  }
};
</script>

<style scoped>
/* Adicione estilos específicos do componente aqui, se necessário */
</style>
