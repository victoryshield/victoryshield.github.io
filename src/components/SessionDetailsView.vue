<template>
  <div class="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow min-h-[400px]">
    <!-- ESTADO DE CARREGAMENTO -->
    <div v-if="loading" class="text-center text-slate-500 dark:text-slate-400 flex items-center justify-center h-full">
      <p class="text-lg">Carregando Sessões...</p>
    </div>

    <!-- FORMULÁRIO DE EDIÇÃO/CRIAÇÃO -->
    <div v-else-if="isEditMode">
      <SessionForm
        :session="selectedSession"
        @save="saveSession"
        @close="cancelForm"
      />
    </div>

    <!-- VISUALIZAÇÃO DE DETALHES DA SESSÃO -->
    <div v-else-if="selectedSession">
      <h3 class="text-2xl font-bold text-amber-700 dark:text-amber-500 mb-2">{{ selectedSession.title }}</h3>
      <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
        <span v-if="selectedSession.campaign_id">Campanha: {{ selectedCampaignName }} • </span>
        Criada em: {{ formatDate(selectedSession.created_at) }}
      </p>

      <div class="mb-4">
        <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'book-open']" class="text-slate-500" /><span>Descrição</span></h4>
        <p class="text-slate-600 dark:text-slate-400">{{ selectedSession.description || 'Nenhuma descrição.' }}</p>
      </div>

      <div class="mb-4">
        <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'bolt']" class="text-slate-500" /><span>Começo Forte</span></h4>
        <p class="text-slate-600 dark:text-slate-400">{{ selectedSession.comeco_forte || 'Nenhum começo forte definido.' }}</p>
      </div>

      <div class="mb-4">
        <h4 class="font-bold mb-1 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'arrow-right']" class="text-slate-500" /><span>Gancho Próxima Aventura</span></h4>
        <p class="text-slate-600 dark:text-slate-400">{{ selectedSession.gancho_proxima_aventura || 'Nenhum gancho definido.' }}</p>
      </div>

      <!-- Seções de detalhes relacionados (sub-tabelas) -->
      <div class="mt-6">
        <h3 class="text-xl font-bold text-amber-700 dark:text-amber-500 mb-3">Detalhes da Sessão</h3>

        <!-- Ganchos de Personagens -->
        <div class="mb-4">
          <h4 class="font-bold mb-2 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'user-tag']" class="text-slate-500" /><span>Ganchos de Personagens</span></h4>
          <ul v-if="sessionGanchosPersonagens.length">
            <li v-for="gancho in sessionGanchosPersonagens" :key="gancho.id" class="text-slate-600 dark:text-slate-400 mb-1">
              <span class="font-semibold">{{ gancho.personagem_name || 'Geral' }}:</span> {{ gancho.description }}
            </li>
          </ul>
          <p v-else class="text-slate-600 dark:text-slate-400">Nenhum gancho de personagem.</p>
        </div>

        <!-- Locais Interessantes -->
        <div class="mb-4">
          <h4 class="font-bold mb-2 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'map-marker-alt']" class="text-slate-500" /><span>Locais Interessantes</span></h4>
          <ul v-if="sessionLocaisInteressantes.length">
            <li v-for="local in sessionLocaisInteressantes" :key="local.id" class="text-slate-600 dark:text-slate-400 mb-1">
              <span class="font-semibold">{{ local.name }}</span>
              <ul v-if="local.caracteristicas && local.caracteristicas.length" class="ml-4 list-disc list-inside">
                <li v-for="carac in local.caracteristicas" :key="carac.id">{{ carac.description }}</li>
              </ul>
            </li>
          </ul>
          <p v-else class="text-slate-600 dark:text-slate-400">Nenhum local interessante.</p>
        </div>

        <!-- NPCs Importantes -->
        <div class="mb-4">
          <h4 class="font-bold mb-2 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'user-friends']" class="text-slate-500" /><span>NPCs Importantes</span></h4>
          <ul v-if="sessionNpcsImportantes.length">
            <li v-for="npc in sessionNpcsImportantes" :key="npc.id" class="text-slate-600 dark:text-slate-400">{{ npc.name }}</li>
          </ul>
          <p v-else class="text-slate-600 dark:text-slate-400">Nenhum NPC importante.</p>
        </div>

        <!-- Objetivos -->
        <div class="mb-4">
          <h4 class="font-bold mb-2 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'bullseye']" class="text-slate-500" /><span>Objetivos</span></h4>
          <ul v-if="sessionObjetivos.length">
            <li v-for="obj in sessionObjetivos" :key="obj.id" class="text-slate-600 dark:text-slate-400">
              <span class="font-semibold">{{ obj.type }}:</span> {{ obj.description }}
            </li>
          </ul>
          <p v-else class="text-slate-600 dark:text-slate-400">Nenhum objetivo.</p>
        </div>

        <!-- Segredos e Rumores -->
        <div class="mb-4">
          <h4 class="font-bold mb-2 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'mask']" class="text-slate-500" /><span>Segredos e Rumores</span></h4>
          <ul v-if="sessionSegredosRumores.length">
            <li v-for="sr in sessionSegredosRumores" :key="sr.id" class="text-slate-600 dark:text-slate-400">{{ sr.description }}</li>
          </ul>
          <p v-else class="text-slate-600 dark:text-slate-400">Nenhum segredo ou rumor.</p>
        </div>

        <!-- Tesouros e Recompensas -->
        <div class="mb-4">
          <h4 class="font-bold mb-2 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'coins']" class="text-slate-500" /><span>Tesouros e Recompensas</span></h4>
          <ul v-if="sessionTesourosRecompensas.length">
            <li v-for="tr in sessionTesourosRecompensas" :key="tr.id" class="text-slate-600 dark:text-slate-400">
              <span class="font-semibold">{{ tr.name }}:</span> {{ tr.description_mecanica || 'Sem descrição mecânica.' }}
            </li>
          </ul>
          <p v-else class="text-slate-600 dark:text-slate-400">Nenhum tesouro ou recompensa.</p>
        </div>

        <!-- Encontros e Desafios -->
        <div class="mb-4">
          <h4 class="font-bold mb-2 flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'dragon']" class="text-slate-500" /><span>Encontros e Desafios</span></h4>
          <ul v-if="sessionEncontrosDesafios.length">
            <li v-for="ed in sessionEncontrosDesafios" :key="ed.id" class="text-slate-600 dark:text-slate-400">
              <span class="font-semibold">{{ ed.title }}:</span> {{ ed.description || 'Sem descrição.' }} (Mecânica: {{ ed.mecanica || 'N/A' }})
            </li>
          </ul>
          <p v-else class="text-slate-600 dark:text-slate-400">Nenhum encontro ou desafio.</p>
        </div>

      </div>
    </div>

    
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import SessionForm from './SessionForm.vue';
import { supabase } from '../services/supabase';

const props = defineProps({
  selectedSession: {
    type: Object,
    default: null
  },
  selectedCampaignName: {
    type: String,
    default: ''
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

const emit = defineEmits(['sessionUpdated', 'creationCancelled', 'startEditing']);

const sessionGanchosPersonagens = ref([]);
const sessionLocaisInteressantes = ref([]);
const sessionNpcsImportantes = ref([]);
const sessionObjetivos = ref([]);
const sessionSegredosRumores = ref([]);
const sessionTesourosRecompensas = ref([]);
const sessionEncontrosDesafios = ref([]);

const fetchSessionDetails = async (sessionId) => {
  if (!sessionId) {
    resetDetails();
    return;
  }
  try {
    // Ganchos de Personagens
    const { data: ganchos, error: ganchosError } = await supabase
      .from('session_ganchos_personagens')
      .select('*')
      .eq('session_id', sessionId);
    if (ganchosError) throw ganchosError;
    sessionGanchosPersonagens.value = ganchos;

    // Locais Interessantes (com características aninhadas)
    const { data: locais, error: locaisError } = await supabase
      .from('session_locais_interessantes')
      .select(`
        *,
        caracteristicas:session_locais_caracteristicas(*)
      `)
      .eq('session_id', sessionId);
    if (locaisError) throw locaisError;
    sessionLocaisInteressantes.value = locais;

    // NPCs Importantes (com detalhes do NPC)
    const { data: npcs, error: npcsError } = await supabase
      .from('session_npcs_importantes')
      .select(`
        *,
        npcs(name)
      `)
      .eq('session_id', sessionId);
    if (npcsError) throw npcsError;
    sessionNpcsImportantes.value = npcs.map(item => ({ ...item, name: item.npcs.name }));

    // Objetivos
    const { data: objetivos, error: objetivosError } = await supabase
      .from('session_objetivos')
      .select('*')
      .eq('session_id', sessionId);
    if (objetivosError) throw objetivosError;
    sessionObjetivos.value = objetivos;

    // Segredos e Rumores
    const { data: segredos, error: segredosError } = await supabase
      .from('session_segredos_rumores')
      .select('*')
      .eq('session_id', sessionId);
    if (segredosError) throw segredosError;
    sessionSegredosRumores.value = segredos;

    // Tesouros e Recompensas
    const { data: tesouros, error: tesourosError } = await supabase
      .from('session_tesouros_recompensas')
      .select('*')
      .eq('session_id', sessionId);
    if (tesourosError) throw tesourosError;
    sessionTesourosRecompensas.value = tesouros;

    // Encontros e Desafios
    const { data: encontros, error: encontrosError } = await supabase
      .from('session_encontros_desafios')
      .select('*')
      .eq('session_id', sessionId);
    if (encontrosError) throw encontrosError;
    sessionEncontrosDesafios.value = encontros;

  } catch (error) {
    console.error("Erro ao buscar detalhes da sessão:", error.message);
    resetDetails();
  }
};

const resetDetails = () => {
  sessionGanchosPersonagens.value = [];
  sessionLocaisInteressantes.value = [];
  sessionNpcsImportantes.value = [];
  sessionObjetivos.value = [];
  sessionSegredosRumores.value = [];
  sessionTesourosRecompensas.value = [];
  sessionEncontrosDesafios.value = [];
};

watch(() => props.selectedSession, (newSession) => {
  if (newSession && !props.isEditMode) {
    fetchSessionDetails(newSession.id);
  } else if (!newSession) {
    resetDetails();
  }
}, { immediate: true });

const saveSession = async (sessionData) => {
  try {
    if (sessionData.id) {
      await supabase.from('sessions').update(sessionData).eq('id', sessionData.id);
    } else {
      await supabase.from('sessions').insert(sessionData);
    }
    emit('sessionUpdated');
  } catch (error) {
    console.error("Erro ao salvar sessão:", error.message);
  }
};

const cancelForm = () => {
  emit('creationCancelled');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};
</script>
