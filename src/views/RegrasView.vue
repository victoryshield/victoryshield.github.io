<template>
  <div class="p-6 rounded-lg shadow bg-white dark:bg-slate-800">
      <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
        <font-awesome-icon :icon="['fas', 'book']" /><span>Regras do Jogo</span>
      </h2>

      <div class="mb-4 flex flex-col gap-y-4">
        <ul class="flex w-full -mb-px text-sm font-medium text-center sm:justify-start" id="default-tab"
          data-tabs-toggle="#default-tab-content" role="tablist">
          <li class="flex-grow sm:flex-none sm:w-auto" role="presentation">
            <button
              class="inline-block px-4 py-2 sm:p-4 rounded-md shadow-sm transition-all duration-300 ease-in-out flex items-center justify-center sm:gap-x-2"
              :class="{ 'bg-amber-500 text-white font-semibold dark:text-white': activeTab === 'pericias', 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-amber-500 hover:text-white dark:hover:text-slate-800': activeTab !== 'pericias' }"
              @click="activeTab = 'pericias'" type="button" role="tab" aria-controls="pericias" aria-selected="true">
              <font-awesome-icon :icon="['fas', 'graduation-cap']"
                :class="activeTab === 'pericias' ? 'text-white' : 'text-blue-600'" />
              <span class="font-semibold hidden sm:inline">&nbsp;Perícias</span>
            </button>
          </li>
          <li class="flex-grow sm:flex-none sm:w-auto" role="presentation">
            <button
              class="inline-block px-4 py-2 sm:p-4 rounded-md shadow-sm transition-all duration-300 ease-in-out flex items-center justify-center sm:gap-x-2"
              :class="{ 'bg-amber-500 text-white font-semibold dark:text-white': activeTab === 'vantagens', 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-amber-500 hover:text-white dark:hover:text-slate-800': activeTab !== 'vantagens' }"
              @click="activeTab = 'vantagens'" type="button" role="tab" aria-controls="vantagens" aria-selected="false">
              <font-awesome-icon :icon="['fas', 'thumbs-up']"
                :class="activeTab === 'vantagens' ? 'text-white' : 'text-green-600'" />
              <span class="font-semibold hidden sm:inline">&nbsp;Vantagens</span>
            </button>
          </li>
          <li class="flex-grow sm:flex-none sm:w-auto" role="presentation">
            <button
              class="inline-block px-4 py-2 sm:p-4 rounded-md shadow-sm transition-all duration-300 ease-in-out flex items-center justify-center sm:gap-x-2"
              :class="{ 'bg-amber-500 text-white font-semibold dark:text-white': activeTab === 'desvantagens', 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-amber-500 hover:text-white dark:hover:text-slate-800': activeTab !== 'desvantagens' }"
              @click="activeTab = 'desvantagens'" type="button" role="tab" aria-controls="desvantagens"
              aria-selected="false">
              <font-awesome-icon :icon="['fas', 'thumbs-down']"
                :class="activeTab === 'desvantagens' ? 'text-white' : 'text-red-600'" />
              <span class="font-semibold hidden sm:inline">&nbsp;Desvantagens</span>
            </button>
          </li>
          <li class="flex-grow sm:flex-none sm:w-auto" role="presentation">
            <button
              class="inline-block px-4 py-2 sm:p-4 rounded-md shadow-sm transition-all duration-300 ease-in-out flex items-center justify-center sm:gap-x-2"
              :class="{ 'bg-amber-500 text-white font-semibold dark:text-white': activeTab === 'tecnicas', 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-amber-500 hover:text-white dark:hover:text-slate-800': activeTab !== 'tecnicas' }"
              @click="activeTab = 'tecnicas'" type="button" role="tab" aria-controls="tecnicas" aria-selected="false">
              <font-awesome-icon :icon="['fas', 'hat-wizard']"
                :class="activeTab === 'tecnicas' ? 'text-white' : 'text-purple-600'" />
              <span class="font-semibold hidden sm:inline">&nbsp;Técnicas</span>
            </button>
          </li>
        </ul>
        <div class="sm:order-2 relative w-full sm:w-auto">
          <input type="text" v-model="searchTerm" placeholder="Buscar regras..."
            class="w-full p-2 pl-10 rounded-md shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500">
          <font-awesome-icon :icon="['fas', 'search']"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <button @click="clearSearch"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <font-awesome-icon :icon="['fas', 'times-circle']" />
          </button>
        </div>
      </div>

      <div id="default-tab-content">
        <div class="p-4 rounded-lg bg-gray-50 dark:bg-slate-700">
          <div v-if="periciasLoading || vantagensLoading || desvantagensLoading || tecnicasLoading"
            class="text-center text-slate-500 dark:text-slate-400">Carregando...</div>
          <div v-else-if="periciasError || vantagensError || desvantagensError || tecnicasError"
            class="text-center text-red-500">Erro ao carregar os dados.</div>
          <div v-else-if="filteredItems.length === 0" class="text-center text-slate-500 dark:text-slate-400">Nenhum
            resultado encontrado.</div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="item in filteredItems" :key="item.id + item.type"
              class="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-md">
              <h4 class="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-x-2 mb-2">
                <font-awesome-icon :icon="getIcon(item.type)" class="text-xl" />
                <span class="text-xl">{{ item.name }}</span>
              </h4>
              <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed" v-html="formatDescription(item.description)"></p>
              <p v-if="item.requirements" class="text-slate-600 dark:text-slate-400 text-xs mt-2">Requisitos: {{
                item.requirements }}</p>
              <p v-if="item.duration" class="text-slate-600 dark:text-slate-400 text-xs mt-1">Duração: {{ item.duration
                }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePericiasStore } from '../stores/pericias';
import { useVantagensStore } from '../stores/vantagens';
import { useDesvantagensStore } from '../stores/desvantagens';
import { useTecnicasStore } from '../stores/tecnicas';

const activeTab = ref('pericias');
const searchTerm = ref('');

const clearSearch = () => {
  searchTerm.value = '';
};

const periciasStore = usePericiasStore();
const { pericias, loading: periciasLoading, error: periciasError } = storeToRefs(periciasStore);

const vantagensStore = useVantagensStore();
const { vantagens, loading: vantagensLoading, error: vantagensError } = storeToRefs(vantagensStore);

const desvantagensStore = useDesvantagensStore();
const { desvantagens, loading: desvantagensLoading, error: desvantagensError } = storeToRefs(desvantagensStore);

const tecnicasStore = useTecnicasStore();
const { tecnicas, loading: tecnicasLoading, error: tecnicasError } = storeToRefs(tecnicasStore);

const getIcon = (type) => {
  switch (type) {
    case 'Perícia':
      return ['fas', 'graduation-cap'];
    case 'Vantagem':
      return ['fas', 'thumbs-up'];
    case 'Desvantagem':
      return ['fas', 'thumbs-down'];
    case 'Técnica':
      return ['fas', 'hat-wizard'];
    default:
      return ['fas', 'question-circle'];
  }
};

const filteredItems = computed(() => {
  const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
  if (lowerCaseSearchTerm.length < 3) {
    switch (activeTab.value) {
      case 'pericias':
        return pericias.value.map(item => ({ ...item, type: 'Perícia' }));
      case 'vantagens':
        return vantagens.value.map(item => ({ ...item, type: 'Vantagem' }));
      case 'desvantagens':
        return desvantagens.value.map(item => ({ ...item, type: 'Desvantagem' }));
      case 'tecnicas':
        return tecnicas.value.map(item => ({ ...item, type: 'Técnica' }));
      default:
        return [];
    }
  } else {
    const allItems = [
      ...pericias.value.map(item => ({ ...item, type: 'Perícia' })),
      ...vantagens.value.map(item => ({ ...item, type: 'Vantagem' })),
      ...desvantagens.value.map(item => ({ ...item, type: 'Desvantagem' })),
      ...tecnicas.value.map(item => ({ ...item, type: 'Técnica' }))
    ];
    return allItems.filter(item =>
      item.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }
});



const formatDescription = (description) => {
  if (!description) return '';
  return description.replace(/•/g, '<br>•');
};

onMounted(async () => {
  await periciasStore.fetchPericias();
  await vantagensStore.fetchVantagens();
  await desvantagensStore.fetchDesvantagens();
  await tecnicasStore.fetchTecnicas();
});
</script>

<style scoped>
/* Adicione estilos específicos para este componente aqui, se necessário */
</style>
