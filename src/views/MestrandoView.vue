<template>
  <section id="mestrando">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <div class="info-card p-6 rounded-lg shadow bg-white dark:bg-slate-800">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'layer-group']" />
          <span>Escalas de Poder</span>
        </h2>
        <p class="mb-4 text-sm text-slate-600 dark:text-slate-300">Efeitos por nível de diferença entre o personagem de escala superior
              e o inferior.</p>
        <ul class="space-y-3">
          <li class="flex items-start gap-x-2"><font-awesome-icon :icon="['fas', 'stairs']" class="mt-1 text-slate-500" /><span><strong>Níveis:</strong> Ningen → Sugoi
                  → Kiodai → Kami</span></li>
          <li class="flex items-start gap-x-2"><font-awesome-icon :icon="['fas', 'circle-plus']" class="mt-1 text-green-600" /><span>Recebe <strong>+1 Ganho</strong>
                  por nível.</span></li>
          <li class="flex items-start gap-x-2"><font-awesome-icon :icon="['fas', 'star']" class="mt-1 text-yellow-500" /><span>Recebe <strong>+1 crítico
                    automático</strong> por nível.</span></li>
          <li class="flex items-start gap-x-2"><font-awesome-icon :icon="['fas', 'shield-heart']" class="mt-1 text-blue-500" /><span>A defesa é <strong>sempre
                    perfeita</strong> (dano mínimo de 1 PV é ignorado).</span></li>
          <li class="flex items-start gap-x-2"><font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="mt-1 text-orange-500" /><span>Um crítico no dado pode
                  anular temporariamente a vantagem da escala.</span></li>
        </ul>
      </div>

      <div class="info-card p-6 rounded-lg shadow bg-white dark:bg-slate-800">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'award']" />
          <span>Recompensas de XP</span>
        </h2>
        <table class="w-full text-left">
          <tbody class="text-slate-600 dark:text-slate-300">
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'check']" class="text-slate-500" /><span>Objetivo Menor</span></td>
              <td class="p-2 text-right">1 XP</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'trophy']" class="text-slate-500" /><span>Objetivo Maior</span></td>
              <td class="p-2 text-right">5 XP</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'masks-theater']" class="text-slate-500" /><span>Interpretação</span></td>
              <td class="p-2 text-right">+1 XP / sessão</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'flag-checkered']" class="text-slate-500" /><span>Marco de Campanha</span></td>
              <td class="p-2 text-right">+10 XP</td>
            </tr>
            <tr>
              <td class="p-2 font-semibold text-amber-700 dark:text-amber-500 flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'right-left']" /><span>Conversão</span></td>
              <td class="p-2 text-right text-amber-700 dark:text-amber-500">10 XP = 1 Ponto de Personagem</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="lg:col-span-2 info-card p-6 rounded-lg shadow bg-white dark:bg-slate-800">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'user-plus']" />
          <span>Gerador Rápido de NPCs</span>
        </h2>
        <div class="text-center">
          <button @click="generateNPC" class="px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition mb-4 flex items-center justify-center gap-x-2 mx-auto">
            <font-awesome-icon :icon="['fas', 'dice']" />
            <span>Gerar NPC Aleatório</span>
          </button>
          <div id="npc-result" class="dynamic-panel p-4 rounded-lg min-h-[120px] flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-900">
            <p class="text-sm text-slate-600 dark:text-slate-300">{{ npcResult }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const npcResult = ref('Clique para gerar uma ideia de NPC.');

const generateNPC = () => {
  const archetypes = ['Humano', 'Aberrante', 'Abissal', 'Alien', 'Anão', 'Anfíbio', 'Celestial', 'Centauro', 'Ciborgue', 'Construto', 'Dahllan', 'Elfo', 'Fada', 'Fantasma', 'Goblin', 'Hynne', 'Kallyanach', 'Kemono', 'Medusa', 'Minotauro', 'Ogro', 'Osteon', 'Qareen', 'Sauroide', 'Vampiro'];
  const concepts = [
    'um bravo guerreiro',
    'um mago misterioso',
    'um ladino astuto',
    'um curandeiro gentil',
    'um cientista louco',
    'um artista performático',
    'um detetive particular',
    'um piloto de mecha',
    'um chef de cozinha',
    'um bardo viajante',
    'um caçador de monstros',
    'um diplomata carismático',
    'um mercenário sem escrúpulos',
    'um monge recluso',
    'um ciborgue com problemas de memória',
    'um fantasma em busca de redenção',
    'um goblin inventor',
    'um vampiro que não bebe sangue',
    'um minotauro bailarino',
    'um elfo programador',
  ];

  const randomArchetype = archetypes[Math.floor(Math.random() * archetypes.length)];
  const randomConcept = concepts[Math.floor(Math.random() * concepts.length)];

  npcResult.value = `${randomArchetype}, ${randomConcept}.`;
};
</script>
