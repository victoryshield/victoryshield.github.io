<template>
  <section id="sessao-atual">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Ganchos de Aventura -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'lightbulb']" class="fa-fw" />
          <span>Ganchos de Aventura</span>
        </h2>
        <div class="space-y-4">
          <div class="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
            <h3 class="font-semibold text-lg dark:text-slate-100">O Mistério da Floresta Sussurrante</h3>
            <p class="text-slate-600 dark:text-slate-400">Rumores de criaturas sombrias e sussurros estranhos vêm da Floresta Sussurrante, atraindo aventureiros em busca de glória ou respostas.</p>
          </div>
          <div class="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
            <h3 class="font-semibold text-lg dark:text-slate-100">A Relíquia Perdida de Eldoria</h3>
            <p class="text-slate-600 dark:text-slate-400">Um antigo mapa foi descoberto, apontando para uma relíquia poderosa escondida nas ruínas de Eldoria, um reino esquecido.</p>
          </div>
        </div>
      </div>

      <!-- Locais Interessantes -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="fa-fw" />
          <span>Locais Interessantes</span>
        </h2>
        <div class="space-y-4">
          <div class="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
            <h3 class="font-semibold text-lg dark:text-slate-100">A Taverna do Dragão Adormecido</h3>
            <p class="text-slate-600 dark:text-slate-400">Um ponto de encontro popular para aventureiros, conhecido por suas histórias e pela cerveja forte.</p>
          </div>
          <div class="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
            <h3 class="font-semibold text-lg dark:text-slate-100">As Minas Esquecidas de Moria</h3>
            <p class="text-slate-600 dark:text-slate-400">Antigas minas anãs, agora infestadas por goblins e rumores de tesouros escondidos.</p>
          </div>
        </div>
      </div>

      <!-- Encontros -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'fist-raised']" class="fa-fw" />
          <span>Encontros</span>
        </h2>
        <div class="space-y-4">
          <div class="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
            <h3 class="font-semibold text-lg dark:text-slate-100">Emboscada de Bandidos</h3>
            <p class="text-slate-600 dark:text-slate-400">Um grupo de 4 bandidos tenta roubar os viajantes na estrada principal.</p>
          </div>
          <div class="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
            <h3 class="font-semibold text-lg dark:text-slate-100">O Urso Enraivecido</h3>
            <p class="text-slate-600 dark:text-slate-400">Um urso gigante e agressivo bloqueia o caminho para a montanha.</p>
          </div>
        </div>
      </div>

      <!-- Desafios -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="fa-fw" />
          <span>Desafios</span>
        </h2>
        <div class="space-y-4">
          <div class="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
            <h3 class="font-semibold text-lg dark:text-slate-100">Travessia do Rio da Perdição</h3>
            <p class="text-slate-600 dark:text-slate-400">O rio está com correnteza forte e há rochas escorregadias. Teste de Habilidade (Difícil).</p>
          </div>
          <div class="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
            <h3 class="font-semibold text-lg dark:text-slate-100">O Enigma da Esfinge</h3>
            <p class="text-slate-600 dark:text-slate-400">Uma esfinge guarda a entrada de uma tumba antiga e só permite a passagem de quem resolver seu enigma.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>
