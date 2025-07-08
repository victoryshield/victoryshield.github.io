<template>
  <section id="basico">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="h-full p-6 rounded-lg shadow bg-white dark:bg-slate-800">
          <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'dice-d6']" />
            <span>A Mecânica Central: 3 Dados e Teste</span>
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <tbody>
                <tr class="border-b border-slate-200 dark:border-slate-700">
                  <td class="py-2 font-semibold flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'calculator']" class="fa-fw text-slate-500" /><span>Fórmula do Teste</span></td>
                  <td class="py-2 dark:text-slate-300">Atributo + (1d6 a 3d6) vs. Meta</td>
                </tr>
                <tr class="border-b border-slate-200 dark:border-slate-700">
                  <td class="py-2 font-semibold flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'dice-one']" class="fa-fw text-slate-500" /><span>1D (Base)</span></td>
                  <td class="py-2 dark:text-slate-300">Rolagem padrão.</td>
                </tr>
                <tr class="border-b border-slate-200 dark:border-slate-700">
                  <td class="py-2 font-semibold flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'circle-plus']" class="text-green-600" /><span>+1D (Perícia)</span></td>
                  <td class="py-2 dark:text-slate-300">Se possui a perícia adequada.</td>
                </tr>
                <tr class="border-b border-slate-200 dark:border-slate-700">
                  <td class="py-2 font-semibold flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'circle-plus']" class="text-green-600" /><span>+1D (Ganho)</span></td>
                  <td class="py-2 dark:text-slate-300">Vantagem tática, uso de 1 PA, etc.</td>
                </tr>
                <tr class="border-b border-slate-200 dark:border-slate-700">
                  <td class="py-2 font-semibold flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'circle-minus']" class="text-red-600" /><span>-1D (Perda)</span></td>
                  <td class="py-2 dark:text-slate-300">Desvantagem tática, terreno ruim, etc.</td>
                </tr>
                <tr class="border-b border-slate-200 dark:border-slate-700">
                  <td class="py-2 font-semibold flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'star']" class="fa-fw text-yellow-500" /><span>Acerto Crítico</span></td>
                  <td class="py-2 dark:text-slate-300">Resultado 6 no dado. Permite <strong>somar o Atributo de novo</strong>.</td>
                </tr>
                <tr>
                  <td class="py-2 font-semibold flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'skull-crossbones']" class="text-red-500" /><span>Erro Crítico</span></td>
                  <td class="py-2 dark:text-slate-300">Todos os dados resultam 1. Consequência narrativa.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="p-6 rounded-lg shadow bg-white dark:bg-slate-800">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'cubes']" />
          <span>Rolador de Dados</span>
        </h2>
        <div class="flex justify-around mb-4">
          <button @click="rollDice(1)" class="w-16 h-16 bg-slate-700 text-white font-bold rounded-lg text-2xl shadow-md hover:bg-slate-600 transition">1D</button>
          <button @click="rollDice(2)" class="w-16 h-16 bg-slate-700 text-white font-bold rounded-lg text-2xl shadow-md hover:bg-slate-600 transition">2D</button>
          <button @click="rollDice(3)" class="w-16 h-16 bg-slate-700 text-white font-bold rounded-lg text-2xl shadow-md hover:bg-slate-600 transition">3D</button>
        </div>
        <div id="dice-result" class="p-4 rounded-lg text-center min-h-[100px] flex flex-col justify-center bg-slate-200 dark:bg-slate-900 transition-colors duration-300">
          <div class="text-center">
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ rollMessage }}</p>
            <p class="text-3xl font-bold my-1 text-slate-800 dark:text-white">{{ totalRoll }}</p>
            <div class="flex justify-center gap-2">
              <span v-for="(die, index) in diceResults" :key="index" class="flex items-center justify-center w-8 h-8 rounded shadow font-bold"
                :class="{
                  'bg-yellow-400 text-black shadow-lg font-bold ring-2 ring-offset-2 ring-offset-slate-200 dark:ring-offset-slate-900 ring-yellow-500': die === 6,
                  'bg-red-500 text-white shadow-lg font-bold ring-2 ring-offset-2 ring-offset-slate-200 dark:ring-offset-slate-900 ring-red-600': die === 1,
                  'bg-white dark:bg-slate-700': die !== 6 && die !== 1
                }">
                {{ die }}
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">{{ criticalMessage }}</p>
          </div>
        </div>
      </div>
      <div class="p-6 rounded-lg shadow bg-white dark:bg-slate-800">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'bullseye']" />
          <span>Metas de Teste</span>
        </h2>
        <table class="w-full text-left">
          <tbody>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="py-2 dark:text-slate-300">Fácil</td>
              <td class="py-2 text-right font-semibold dark:text-slate-100">6</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="py-2 dark:text-slate-300">Médio</td>
              <td class="py-2 text-right font-semibold dark:text-slate-100">9</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="py-2 dark:text-slate-300">Difícil</td>
              <td class="py-2 text-right font-semibold dark:text-slate-100">12</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="py-2 dark:text-slate-300">Muito Difícil</td>
              <td class="py-2 text-right font-semibold dark:text-slate-100">15</td>
            </tr>
            <tr>
              <td class="py-2 dark:text-slate-300">Lendário</td>
              <td class="py-2 text-right font-semibold dark:text-slate-100">18+</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-6 rounded-lg shadow bg-white dark:bg-slate-800">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'user-pen']" />
          <span>Atributos & Recursos</span>
        </h2>
        <table class="w-full text-left">
          <tbody>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="py-2 flex items-center gap-x-2 dark:text-slate-300"><font-awesome-icon :icon="['fas', 'hand-fist']" class="w-4 text-center text-slate-500" /><span>Poder (P)</span></td>
              <td class="py-2 text-right dark:text-slate-300">Força, intimidação, carisma.</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="py-2 flex items-center gap-x-2 dark:text-slate-300"><font-awesome-icon :icon="['fas', 'brain']" class="w-4 text-center text-slate-500" /><span>Habilidade (H)</span>
              </td>
              <td class="py-2 text-right dark:text-slate-300">Agilidade, inteligência, mira.</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="py-2 flex items-center gap-x-2 dark:text-slate-300"><font-awesome-icon :icon="['fas', 'shield-halved']" class="w-4 text-center text-slate-500" /><span>Resistência (R)</span></td>
              <td class="py-2 text-right dark:text-slate-300">Vigor, força de vontade.</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="py-2 font-semibold flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'heart-pulse']" class="w-4 text-center text-slate-500" /><span>Pontos de Vida (PV)</span></td>
              <td class="py-2 text-right dark:text-slate-300">R x 5</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="py-2 font-semibold flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" class="w-4 text-center text-slate-500" /><span>Pontos de Mana (PM)</span></td>
              <td class="py-2 text-right dark:text-slate-300">H x 5</td>
            </tr>
            <tr>
              <td class="py-2 font-semibold flex items-center gap-x-2 dark:text-slate-100"><font-awesome-icon :icon="['fas', 'bolt']" class="w-4 text-center text-slate-500" /><span>Pontos de Ação (PA)</span>
              </td>
              <td class="py-2 text-right dark:text-slate-300">Poder (P)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-6 rounded-lg shadow bg-white dark:bg-slate-800">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'bed']" />
          <span>Recuperação</span>
        </h2>
        <table class="w-full text-left">
          <tbody>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="py-2 font-semibold dark:text-slate-100">Descanso (8h)</td>
              <td class="py-2 text-right dark:text-slate-300">Recupera todos os PV, PM e PA.</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="py-2 font-semibold dark:text-slate-100">Descanso Curto (2h)</td>
              <td class="py-2 text-right dark:text-slate-300">Recupera PV=R e PM=H. Não recupera PA.</td>
            </tr>
            <tr>
              <td class="py-2 font-semibold dark:text-slate-100">Lugar Ruim</td>
              <td class="py-2 text-right dark:text-slate-300">Recupera metade dos PV e PM.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const totalRoll = ref(0);
const diceResults = ref([]);
const rollMessage = ref('');
const criticalMessage = ref('');

const rollDice = (numDice) => {
  diceResults.value = [];
  let sum = 0;
  let hasSix = false;
  let allOnes = true;

  for (let i = 0; i < numDice; i++) {
    const roll = Math.floor(Math.random() * 6) + 1;
    diceResults.value.push(roll);
    sum += roll;
    if (roll === 6) {
      hasSix = true;
    }
    if (roll !== 1) {
      allOnes = false;
    }
  }

  totalRoll.value = sum;
  rollMessage.value = `Rolagem de ${numDice}D`;
  criticalMessage.value = '';

  if (hasSix) {
    criticalMessage.value = 'Crítico! Some o Atributo de novo.';
  } else if (allOnes) {
    criticalMessage.value = 'Erro Crítico!';
  }
};
</script>

