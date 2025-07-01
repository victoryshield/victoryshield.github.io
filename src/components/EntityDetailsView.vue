<template>
  <div class="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow min-h-[400px]">
    <!-- ESTADO DE CARREGAMENTO -->
    <div v-if="loading" class="text-center text-slate-500 dark:text-slate-400 flex items-center justify-center h-full">
      <p class="text-lg">Carregando {{ entityTypeName }}s...</p>
    </div>

    <!-- FORMULÁRIO DINÂMICO -->
    <div v-else-if="isEditMode">
      <EntityForm
        :entity="selectedEntity"
        :entityName="entityTypeName"
        @save="saveEntity"
        @close="cancelForm"
      />
    </div>

    <!-- VISUALIZAÇÃO DE DETALHES -->
    <div v-else-if="selectedEntity" class="flex flex-col sm:flex-row gap-6 items-start">
      <div class="flex-shrink-0 w-full sm:w-48">
        <img :src="selectedEntity.image || 'https://placehold.co/400x400/e2e8f0/475569?text=C'" :alt="'Retrato de ' + selectedEntity.name" class="bg-slate-300 dark:bg-slate-700 w-full h-auto object-cover rounded-lg shadow-lg" @error="$event.target.src='https://placehold.co/400x400/e2e8f0/475569?text=C'">
      </div>
      <div class="flex-grow">
        <h3 class="text-2xl font-bold text-amber-700 dark:text-amber-500">{{ selectedEntity.name }}</h3>
        <p class="text-md text-slate-600 dark:text-slate-400 italic mb-2">{{ selectedEntity.concept }}</p>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
          {{ selectedEntity.archetype }} • {{ selectedEntity.pontos }} pontos
          <span v-if="selectedEntity.campaign_id"> • Campanha: {{ selectedCampaignName }}</span>
        </p>
        <div class="mb-4">
          <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'list-ol']" class="text-slate-500" /><span>Atributos</span></h4>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mt-2">
            <div class="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-x-3 shadow-sm border dark:border-slate-700">
              <font-awesome-icon :icon="['fas', 'hand-fist']" class="fa-2x text-amber-700 dark:text-amber-500" />
              <div>
                <span class="block text-sm text-slate-600 dark:text-slate-400">Poder</span>
                <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedEntity.Poder }}</span>
              </div>
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-x-3 shadow-sm border dark:border-slate-700">
              <font-awesome-icon :icon="['fas', 'brain']" class="fa-2x text-amber-700 dark:text-amber-500" />
              <div>
                <span class="block text-sm text-slate-600 dark:text-slate-400">Habilidade</span>
                <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedEntity.Habilidade }}</span>
              </div>
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-x-3 shadow-sm border dark:border-slate-700">
              <font-awesome-icon :icon="['fas', 'shield-halved']" class="fa-2x text-amber-700 dark:text-amber-500" />
              <div>
                <span class="block text-sm text-slate-600 dark:text-slate-400">Resistência</span>
                <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedEntity.Resistencia }}</span>
              </div>
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-x-3 shadow-sm border dark:border-slate-700">
              <font-awesome-icon :icon="['fas', 'bolt']" class="fa-2x text-amber-700 dark:text-amber-500" />
              <div>
                <span class="block text-sm text-slate-600 dark:text-slate-400">Pontos de Ação</span>
                <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedEntity.Pontos_Acao }}</span>
              </div>
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-x-3 shadow-sm border dark:border-slate-700">
              <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" class="fa-2x text-amber-700 dark:text-amber-500" />
              <div>
                <span class="block text-sm text-slate-600 dark:text-slate-400">Pontos de Mana</span>
                <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedEntity.Pontos_Mana }}</span>
              </div>
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-x-3 shadow-sm border dark:border-slate-700">
              <font-awesome-icon :icon="['fas', 'heart-pulse']" class="fa-2x text-amber-700 dark:text-amber-500" />
              <div>
                <span class="block text-sm text-slate-600 dark:text-slate-400">Pontos de Vida</span>
                <span class="block text-xl font-bold text-slate-800 dark:text-slate-100">{{ selectedEntity.Pontos_Vida }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'graduation-cap']" class="text-slate-500" /><span>Perícias</span></h4>
          <p class="text-slate-600 dark:text-slate-400">Nenhuma</p>
        </div>
        <div class="mb-4">
          <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'thumbs-up']" class="text-green-600" /><span>Vantagens</span></h4>
          <p class="text-slate-600 dark:text-slate-400">Nenhuma</p>
        </div>
        <div>
          <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'thumbs-down']" class="text-red-600" /><span>Desvantagens</span></h4>
          <p class="text-slate-600 dark:text-slate-400">Nenhuma</p>
        </div>
      </div>
    </div>

    <!-- MENSAGEM INICIAL / SEM SELEÇÃO -->
    <div v-else class="text-center text-slate-500 dark:text-slate-400 flex items-center justify-center h-full">
      <div>
        <p class="text-lg">Selecione um item na lista para ver os detalhes.</p>
        <p class="text-sm">Ou adicione um novo para começar.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import EntityForm from './EntityForm.vue';
import { useNpcsStore } from '../stores/npcs';
import { usePersonagensStore } from '../stores/personagens';
import { useMonstrosStore } from '../stores/monstros';

const props = defineProps({
  selectedEntity: {
    type: Object,
    default: null
  },
  selectedCampaignName: {
    type: String,
    default: ''
  },
  entityType: {
    type: String,
    required: true,
    validator: (value) => ['personagem', 'npc', 'monstro'].includes(value),
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['entityUpdated', 'creationCancelled']);

const npcsStore = useNpcsStore();
const personagensStore = usePersonagensStore();
const monstrosStore = useMonstrosStore();

const entityTypeName = computed(() => {
  switch (props.entityType) {
    case 'personagem':
      return 'Personagem';
    case 'npc':
      return 'NPC';
    case 'monstro':
      return 'Monstro';
    default:
      return 'Entidade';
  }
});

const saveEntity = async (entityData) => {
  try {
    if (entityData.image && typeof entityData.image !== 'string') {
      let imageUrl = null;
      if (props.entityType === 'personagem') {
        imageUrl = await personagensStore.uploadImage(entityData.image);
      } else if (props.entityType === 'npc') {
        imageUrl = await npcsStore.uploadImage(entityData.image);
      } else if (props.entityType === 'monstro') {
        imageUrl = await monstrosStore.uploadImage(entityData.image);
      }
      entityData.image = imageUrl;
    }

    if (entityData.id) {
      if (props.entityType === 'personagem') {
        await personagensStore.updatePersonagem(entityData);
      } else if (props.entityType === 'npc') {
        await npcsStore.updateNpc(entityData);
      } else if (props.entityType === 'monstro') {
        await monstrosStore.updateMonstro(entityData);
      }
    } else {
      if (props.entityType === 'personagem') {
        await personagensStore.addPersonagem(entityData);
      } else if (props.entityType === 'npc') {
        await npcsStore.addNpc(entityData);
      } else if (props.entityType === 'monstro') {
        await monstrosStore.addMonstro(entityData);
      }
    }
    emit('entityUpdated');
  } catch (error) {
    console.error(`Erro ao salvar ${props.entityType}:`, error);
  }
};

const cancelForm = () => {
  emit('creationCancelled');
};
</script>