<template>
  <div class="image-upload-container">
    <label class="block text-gray-300 text-sm font-bold mb-2">Imagem:</label>
    <div class="flex items-center space-x-4">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept="image/*"
        class="hidden"
      />
      <button
        type="button"
        @click="fileInput.click()"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Selecionar Imagem
      </button>
      <span v-if="fileName" class="text-gray-400">{{ fileName }}</span>
      <span v-else class="text-gray-500">Nenhuma imagem selecionada</span>
    </div>
    <p v-if="error" class="text-red-500 text-xs italic mt-1">{{ error }}</p>
    <div v-if="previewUrl" class="mt-4">
      <img :src="previewUrl" alt="Pré-visualização da imagem" class="max-w-xs h-auto rounded-lg shadow-md" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, File],
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'error']);

const fileInput = ref(null);
const fileName = ref('');
const previewUrl = ref(null);
const error = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      error.value = 'Por favor, selecione um arquivo de imagem válido.';
      fileName.value = '';
      previewUrl.value = null;
      emit('update:modelValue', null);
      emit('error', error.value);
      return;
    }
    error.value = null;
    fileName.value = file.name;
    previewUrl.value = URL.createObjectURL(file);
    emit('update:modelValue', file);
  } else {
    fileName.value = '';
    previewUrl.value = null;
    emit('update:modelValue', null);
  }
};

watch(() => props.modelValue, (newVal) => {
  if (typeof newVal === 'string' && newVal) {
    previewUrl.value = newVal;
    fileName.value = newVal.split('/').pop(); // Tenta extrair o nome do arquivo da URL
  } else if (!newVal) {
    previewUrl.value = null;
    fileName.value = '';
  }
}, { immediate: true });

</script>

<style scoped>
/* Adicione estilos específicos do componente aqui, se necessário */
</style>
