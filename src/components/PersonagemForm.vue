<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-bold mb-4 text-amber-500">{{ isEditing ? 'Editar Personagem' : 'Novo Personagem' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="name" class="block text-gray-300 text-sm font-bold mb-2">Nome:</label>
            <input type="text" id="name" v-model="form.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white" required>
            <p v-if="validationErrors.name" class="text-red-500 text-xs italic mt-1">{{ validationErrors.name }}</p>
          </div>
          <div>
            <label for="archetype" class="block text-gray-300 text-sm font-bold mb-2">Arquétipo:</label>
            <input type="text" id="archetype" v-model="form.archetype" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white">
          </div>
          <div class="md:col-span-2">
            <label for="concept" class="block text-gray-300 text-sm font-bold mb-2">Conceito:</label>
            <textarea id="concept" v-model="form.concept" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white" rows="3"></textarea>
          </div>
          <div class="md:col-span-2">
            <ImageUpload v-model="form.image" />
          </div>
        </div>

        <h3 class="text-xl font-bold mb-3 text-amber-500">Atributos</h3>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label for="poder" class="block text-gray-300 text-sm font-bold mb-2">Poder:</label>
            <input type="number" id="poder" v-model.number="form.Poder" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white" required>
          </div>
          <div>
            <label for="habilidade" class="block text-gray-300 text-sm font-bold mb-2">Habilidade:</label>
            <input type="number" id="habilidade" v-model.number="form.Habilidade" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white" required>
          </div>
          <div>
            <label for="resistencia" class="block text-gray-300 text-sm font-bold mb-2">Resistência:</label>
            <input type="number" id="resistencia" v-model.number="form.Resistencia" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white" required>
          </div>
          <div>
            <label for="pontos_acao" class="block text-gray-300 text-sm font-bold mb-2">Pontos de Ação:</label>
            <input type="number" id="pontos_acao" v-model.number="form.Pontos_Acao" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white" required>
          </div>
          <div>
            <label for="pontos_mana" class="block text-gray-300 text-sm font-bold mb-2">Pontos de Mana:</label>
            <input type="number" id="pontos_mana" v-model.number="form.Pontos_Mana" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white" required>
          </div>
          <div>
            <label for="pontos_vida" class="block text-gray-300 text-sm font-bold mb-2">Pontos de Vida:</label>
            <input type="number" id="pontos_vida" v-model.number="form.Pontos_Vida" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white" required>
            <p v-if="validationErrors.Pontos_Vida" class="text-red-500 text-xs italic mt-1">{{ validationErrors.Pontos_Vida }}</p>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button type="button" @click="$emit('close')" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Cancelar
          </button>
          <button type="submit" class="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {{ isEditing ? 'Salvar Alterações' : 'Adicionar Personagem' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import ImageUpload from './ImageUpload.vue';
import { useCampaignsStore } from '../stores/campaigns';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  personagem: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'save']);

const campaignsStore = useCampaignsStore();
const authStore = useAuthStore();

const isEditing = ref(false);
const form = ref({
  id: null,
  name: '',
  archetype: '',
  concept: '',
  Poder: 0,
  Habilidade: 0,
  Resistencia: 0,
  Pontos_Acao: 0,
  Pontos_Mana: 0,
  Pontos_Vida: 0,
  image: null, // Adicionado campo para imagem
  campaign_id: null, // Adicionado campo para campaign_id
});

const validationErrors = ref({});

onMounted(async () => {
  if (authStore.user) {
    await campaignsStore.fetchCampaigns(authStore.user.id);
  }
});

watch(() => props.personagem, (newVal) => {
  if (newVal) {
    isEditing.value = true;
    Object.assign(form.value, newVal);
  } else {
    isEditing.value = false;
    resetForm();
  }
}, { immediate: true });

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    archetype: '',
    concept: '',
    Poder: 0,
    Habilidade: 0,
    Resistencia: 0,
    Pontos_Acao: 0,
    Pontos_Mana: 0,
    Pontos_Vida: 0,
    image: null,
    campaign_id: null,
  };
  validationErrors.value = {};
};

const handleImageChange = (file) => {
  form.value.image = file;
};

const validateForm = () => {
  validationErrors.value = {};
  if (!form.value.name) {
    validationErrors.value.name = 'Nome é obrigatório.';
  }
  if (!form.value.campaign_id) {
    validationErrors.value.campaign_id = 'Campanha é obrigatória.';
  }
  const numericFields = ['Poder', 'Habilidade', 'Resistencia', 'Pontos_Acao', 'Pontos_Mana', 'Pontos_Vida'];
  numericFields.forEach(field => {
    if (typeof form.value[field] !== 'number' || isNaN(form.value[field])) {
      validationErrors.value[field] = `${field.replace('_', ' ')} deve ser um número.`;
    }
  });
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
