<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-bold mb-4 text-amber-500">{{ isEditing ? `Editar ${entityTypeName}` : `Novo ${entityTypeName}` }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="name" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Nome:</label>
            <input type="text" id="name" v-model="form.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 dark:text-white leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600" required>
            <p v-if="validationErrors.name" class="text-red-500 text-xs italic mt-1">{{ validationErrors.name }}</p>
          </div>
          <div>
            <label for="archetype" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Arquétipo:</label>
            <input type="text" id="archetype" v-model="form.archetype" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 dark:text-white leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600">
          </div>
          <div>
            <label for="campaign" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Campanha:</label>
            <select id="campaign" v-model.number="form.campaign_id" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 dark:text-white leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600" required>
              <option :value="null" disabled>Selecione uma campanha</option>
              <option v-for="campaign in campaignsStore.campaigns" :key="campaign.id" :value="campaign.id">
                {{ campaign.name }}
              </option>
            </select>
            <p v-if="validationErrors.campaign_id" class="text-red-500 text-xs italic mt-1">{{ validationErrors.campaign_id }}</p>
          </div>
          <div class="md:col-span-2">
            <label for="concept" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Conceito:</label>
            <textarea id="concept" v-model="form.concept" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 dark:text-white leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600" rows="3"></textarea>
          </div>
          <div class="md:col-span-2">
            <ImageUpload v-model="form.image" />
          </div>
        </div>

        <h3 class="text-xl font-bold mb-3 text-amber-700 dark:text-amber-500">Atributos</h3>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label for="poder" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Poder:</label>
            <input type="number" id="poder" v-model.number="form.Poder" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 dark:text-white leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600" required>
          </div>
          <div>
            <label for="habilidade" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Habilidade:</label>
            <input type="number" id="habilidade" v-model.number="form.Habilidade" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 dark:text-white leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600" required>
          </div>
          <div>
            <label for="resistencia" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Resistência:</label>
            <input type="number" id="resistencia" v-model.number="form.Resistencia" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 dark:text-white leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600" required>
          </div>
          <div>
            <label for="pontos_acao" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Pontos de Ação:</label>
            <input type="number" id="pontos_acao" v-model.number="form.Pontos_Acao" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 dark:text-white leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600" required>
          </div>
          <div>
            <label for="pontos_mana" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Pontos de Mana:</label>
            <input type="number" id="pontos_mana" v-model.number="form.Pontos_Mana" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 dark:text-white leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600" required>
          </div>
          <div>
            <label for="pontos_vida" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Pontos de Vida:</label>
            <input type="number" id="pontos_vida" v-model.number="form.Pontos_Vida" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 dark:text-white leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600" required>
            <p v-if="validationErrors.Pontos_Vida" class="text-red-500 text-xs italic mt-1">{{ validationErrors.Pontos_Vida }}</p>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button type="button" @click="$emit('close')" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Cancelar
          </button>
          <button type="submit" class="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {{ isEditing ? 'Salvar Alterações' : `Adicionar ${entityTypeName}` }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import ImageUpload from './ImageUpload.vue';
import { useCampaignsStore } from '../stores/campaigns';
import { useAuthStore } from '../stores/auth';
import { usePersonagensStore } from '../stores/personagens';
import { useNpcsStore } from '../stores/npcs';
import { useMonstrosStore } from '../stores/monstros';


const props = defineProps({
  entityData: {
    type: Object,
    default: null,
  },
  entityType: {
    type: String,
    required: true,
    validator: (value) => ['personagem', 'npc', 'monstro'].includes(value),
  },
});

// Removido 'save', agora apenas 'close'
const emit = defineEmits(['close']);

const campaignsStore = useCampaignsStore();
const authStore = useAuthStore();
const personagensStore = usePersonagensStore();
const npcsStore = useNpcsStore();
const monstrosStore = useMonstrosStore();


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
  image: null,
  campaign_id: null,
});

const validationErrors = ref({});

const entityTypeName = computed(() => {
  switch (props.entityType) {
    case 'personagem': return 'Personagem';
    case 'npc': return 'NPC';
    case 'monstro': return 'Monstro';
    default: return 'Entidade';
  }
});

onMounted(async () => {
  if (authStore.user) {
    await campaignsStore.fetchCampaigns(authStore.user.id);
  }
});

watch(() => props.entityData, (newVal) => {
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

const validateForm = () => {
  validationErrors.value = {};
  if (!form.value.name) {
    validationErrors.value.name = 'Nome é obrigatório.';
  }
  if (form.value.campaign_id === null || form.value.campaign_id === '') {
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

const handleSubmit = async () => {
  if (validateForm()) {
    try {
      // Lógica de upload de imagem (se houver)
      if (form.value.image instanceof File) {
        let imageUrl = null;
        if (props.entityType === 'personagem') {
          imageUrl = await personagensStore.uploadImage(form.value.image);
        } else if (props.entityType === 'npc') {
          imageUrl = await npcsStore.uploadImage(form.value.image);
        } else if (props.entityType === 'monstro') {
          imageUrl = await monstrosStore.uploadImage(form.value.image);
        }
        form.value.image = imageUrl;
      } else if (form.value.image === null && props.entityData?.image) {
        // Se a imagem foi removida no formulário, defina como null no banco de dados
        form.value.image = null;
      }

      if (form.value.id) { // Editando entidade existente
        if (props.entityType === 'personagem') {
          await personagensStore.updatePersonagem(form.value);
        } else if (props.entityType === 'npc') {
          await npcsStore.updateNpc(form.value);
        } else if (props.entityType === 'monstro') {
          await monstrosStore.updateMonstro(form.value);
        }
      } else { // Adicionando nova entidade
        if (props.entityType === 'personagem') {
          await personagensStore.addPersonagem(form.value);
        } else if (props.entityType === 'npc') {
          await npcsStore.addNpc(form.value);
        } else if (props.entityType === 'monstro') {
          await monstrosStore.addMonstro(form.value);
        }
      }
      emit('close'); // <--- Apenas emite 'close' após o sucesso
    } catch (error) {
      console.error(`Erro ao salvar ${props.entityType}:`, error);
      // Você pode adicionar uma lógica para exibir o erro na UI
    }
  }
};
</script>

<style scoped>
/* Seu CSS aqui */
</style>
