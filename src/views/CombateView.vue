<template>
  <section id="combate">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <div class="bg-white dark:bg-slate-800 lg:col-span-1 p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'list-ol']" />
          <span>Ordem de Combate</span>
        </h2>
        <ol class="space-y-3">
          <li class="flex items-start gap-x-2">
            <font-awesome-icon :icon="['fas', 'stopwatch']" class="mt-1 text-slate-500" />
            <span><strong>Iniciativa:</strong> Teste de <strong>Habilidade</strong>. Personagens agem em ordem
              decrescente.</span>
          </li>
          <li class="flex items-start gap-x-2">
            <font-awesome-icon :icon="['fas', 'rotate']" class="mt-1 text-slate-500" />
            <span><strong>Turno:</strong> <strong>1 Ação</strong> (atacar, usar Vantagem, etc.) e <strong>1
                Movimento</strong>.</span>
          </li>
          <li class="flex items-start gap-x-2">
            <font-awesome-icon :icon="['fas', 'right-left']" class="mt-1 text-slate-500" />
            <span><strong>Opções:</strong> Pode trocar <strong>Ação</strong> por <strong>Movimento</strong> extra,
              mas não o contrário.</span>
          </li>
        </ol>
      </div>

      <div class="bg-white dark:bg-slate-800 lg:col-span-2 p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'gavel']" />
          <span>Ataque e Defesa</span>
        </h2>
        <table class="w-full text-left">
          <thead class="table-header">
            <tr>
              <th class="p-2 rounded-l-lg">Ação</th>
              <th class="p-2 rounded-r-lg">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'khanda']" class="text-slate-500" /><span>Ataque (Padrão)</span></td>
              <td class="p-2 text-slate-600 dark:text-slate-400">Teste de <strong>Poder</strong> (corpo a corpo) ou <strong>Habilidade</strong> (à
                distância).</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'shield-halved']" class="text-slate-500" /><span>Defesa (Padrão)</span></td>
              <td class="p-2 text-slate-600 dark:text-slate-400">Teste de <strong>Resistência</strong>.</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'heart-crack']" class="text-red-600" /><span>Dano</span></td>
              <td class="p-2 text-slate-600 dark:text-slate-400">Total do Ataque - Total da Defesa.</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2">
                <font-awesome-icon :icon="['fas', 'heart']" class="text-amber-500" />
                <span>Dano Mínimo</span>
              </td>
              <td class="p-2 text-slate-600 dark:text-slate-400">Todo ataque bem-sucedido causa pelo menos <strong>1 PV</strong>.</td>
            </tr>
            <tr>
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'shield-heart']" class="text-green-600" /><span>Defesa Perfeita</span></td>
              <td class="p-2 text-slate-600 dark:text-slate-400">Defesa dobra o valor do Ataque. Dano é <strong>zero</strong>.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'shoe-prints']" />
          <span>Movimento & Distâncias</span>
        </h2>
        <table class="w-full text-left">
          <tbody>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'ruler-horizontal']" class="text-slate-500" /><span>Distâncias</span></td>
              <td class="p-2 text-right text-slate-600 dark:text-slate-400">Perto → Longe → Muito Longe → Fora de Alcance</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'person-running']" class="text-slate-500" /><span>Movimento</span></td>
              <td class="p-2 text-right text-slate-600 dark:text-slate-400">1 passo de distância por 1 movimento.</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'hand-fist']" class="text-slate-500" /><span>Ataque Corpo a Corpo</span></td>
              <td class="p-2 text-right text-slate-600 dark:text-slate-400">Apenas em alvos Perto.</td>
            </tr>
            <tr>
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'crosshairs']" class="text-slate-500" /><span>Ataque à Distância</span></td>
              <td class="p-2 text-right text-slate-600 dark:text-slate-400"><strong>Perda</strong> contra alvos <strong>Longe</strong> (sem Vantagem
                Alcance).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white dark:bg-slate-800 lg:col-span-2 p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'skull']" />
          <span>Derrota e Morte</span>
        </h2>
        <table class="w-full text-left">
          <thead class="table-header">
            <tr>
              <th class="p-2 rounded-l-lg">Condição</th>
              <th class="p-2 rounded-r-lg">Efeito</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'face-dizzy']" class="text-slate-500" /><span>0 PV (Derrotado)</span></td>
              <td class="p-2 text-slate-600 dark:text-slate-400">Sofre <strong>Perda</strong> em todos os testes até o fim da cena.</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2">
                <font-awesome-icon :icon="['fas', 'skull']" class="text-slate-500" />
                <span>Teste de Morte</span>
              </td>
              <td class="p-2 text-slate-600 dark:text-slate-400">Se com 0 PV sofre dano, faz Teste de <strong>Resistência (Meta 9)</strong>.</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'eye']" class="text-blue-500" /><span>Sucesso (12+)</span></td>
              <td class="p-2 text-slate-600 dark:text-slate-400"><strong>Caído:</strong> Consciente, mas não pode agir.</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'eye-slash']" class="text-slate-500" /><span>Sucesso (8-11)</span></td>
              <td class="p-2 text-slate-600 dark:text-slate-400"><strong>Inconsciente:</strong> Desmaia por 1 hora.</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'hourglass-half']" class="text-orange-500" /><span>Falha (6-7)</span></td>
              <td class="p-2 text-slate-600 dark:text-slate-400"><strong>Quase Morto:</strong> Morre em 1d rodadas se não for estabilizado.</td>
            </tr>
            <tr>
              <td class="p-2 font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'skull-crossbones']" class="fa-fw text-red-600" /><span>Falha (5 ou menos)</span></td>
              <td class="p-2 text-slate-600 dark:text-slate-400"><strong>Morto.</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>

