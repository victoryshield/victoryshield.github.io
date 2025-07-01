<template>
  <div class="md:col-span-1 p-4 rounded-lg shadow bg-white dark:bg-slate-800 max-h-[600px] overflow-y-auto relative">
    <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center justify-between">
      <div class="flex items-center gap-x-2">
        <font-awesome-icon :icon="entityIcon" />
        <span>{{ entityTitle }}</span>
      </div>
    </h2>
    <div v-if="showCampaignFilter" class="mb-4">
      <label for="campaign-filter" class="block text-gray-300 text-sm font-bold mb-2">Filtrar por Campanha:</label>
      <select id="campaign-filter" :value="selectedCampaignId" @change="$emit('update:selectedCampaignId', Number($event.target.value))" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 dark:text-white leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600">
        <option :value="null">Todas as Campanhas</option>
        <option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">
          {{ campaign.name }}
        </option>
      </select>
    </div>
    <div v-if="loading" class="text-center text-slate-500 dark:text-slate-400">Carregando {{ entityTitle }}...</div>
    <div v-else-if="error" class="text-center text-red-500">Erro ao carregar {{ entityTitle }}: {{ error.message }}</div>
    <ul v-else class="space-y-1">
      <li v-for="entity in entities" :key="entity.id"
        class="p-3 rounded-md cursor-pointer transition-colors duration-200"
        :class="{'bg-amber-100 dark:bg-amber-800 ring-2 ring-amber-500': selectedEntity && selectedEntity.id === entity.id, 'hover:bg-amber-100 dark:hover:bg-slate-700': selectedEntity && selectedEntity.id !== entity.id}"
        @click="$emit('selectEntity', entity)">
        <div class="flex justify-between items-center">
          <p class="font-semibold" :class="{'text-amber-800 dark:text-amber-100': selectedEntity && selectedEntity.id === entity.id, 'dark:text-slate-100': selectedEntity && selectedEntity.id !== entity.id}">{{ entity.name }}</p>
          <div class="flex gap-x-2">
            <button @click.stop="$emit('editEntity', entity)" class="text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors duration-200">
              <font-awesome-icon :icon="['fas', 'pen-to-square']" />
            </button>
            <button @click.stop="openConfirmationModal(entity.id)" class="text-red-500 hover:text-red-700 transition-colors duration-200">
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </div>
        </div>
      </li>
    </ul>
    <button @click="$emit('addEntity')" class="absolute bottom-4 right-4 bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-full shadow-lg">
      <font-awesome-icon :icon="['fas', 'plus']" class="fa-2x" />
    </button>

    <ConfirmationModal
      v-if="showConfirmationModal"
      title="Confirmar Exclusão"
      message="Tem certeza que deseja excluir esta entidade?"
      @close="closeConfirmationModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ConfirmationModal from './ConfirmationModal.vue';

defineProps({
  entities: {
    type: Array,
    required: true
  },
  selectedEntity: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: Object,
    default: null
  },
  entityTitle: {
    type: String,
    required: true
  },
  entityIcon: {
    type: Array,
    required: true
  },
  showCampaignFilter: {
    type: Boolean,
    default: false
  },
  campaigns: {
    type: Array,
    default: () => []
  },
  selectedCampaignId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['selectEntity', 'editEntity', 'deleteEntity', 'addEntity', 'update:selectedCampaignId']);

const showConfirmationModal = ref(false);
const entityToDeleteId = ref(null);

const openConfirmationModal = (id) => {
  entityToDeleteId.value = id;
  showConfirmationModal.value = true;
};

const closeConfirmationModal = () => {
  showConfirmationModal.value = false;
  entityToDeleteId.value = null;
};

const confirmDelete = () => {
  emit('deleteEntity', entityToDeleteId.value);
  closeConfirmationModal();
};
</script>
