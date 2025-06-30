<template>
  <section id="manobras">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'star-of-life']" />
          <span>Condições Comuns</span>
        </h2>
        <dl class="space-y-4">
          <div>
            <dt class="font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'person-falling-burst']" class="text-slate-500" /><span>Caído</span></dt>
            <dd class="text-sm text-slate-600 dark:text-slate-400 pl-6"><strong>Perda</strong> em todos os testes. Gasta um
              <strong>Movimento</strong> para se levantar.
            </dd>
          </div>
          <div>
            <dt class="font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'circle-question']" class="text-slate-500" /><span>Confuso</span></dt>
            <dd class="text-sm text-slate-600 dark:text-slate-400 pl-6">Alvos de perícias/vantagens são escolhidos ao acaso.</dd>
          </div>
          <div>
            <dt class="font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'face-dizzy']" class="text-slate-500" /><span>Derrotado</span></dt>
            <dd class="text-sm text-slate-600 dark:text-slate-400 pl-6"><strong>Perda</strong> em todos os testes e não consegue acertos
              críticos.</dd>
          </div>
          <div>
            <dt class="font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'user-slash']" class="text-slate-500" /><span>Desprevenido</span></dt>
            <dd class="text-sm text-slate-600 dark:text-slate-400 pl-6"><strong>Perda</strong> nos testes de defesa.</dd>
          </div>
          <div>
            <dt class="font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'user-xmark']" class="text-slate-500" /><span>Indefeso</span></dt>
            <dd class="text-sm text-slate-600 dark:text-slate-400 pl-6">Não rola dados na defesa. Ataques contra o alvo têm
              <strong>Ganho</strong>.
            </dd>
          </div>
          <div>
            <dt class="font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'handcuffs']" class="text-slate-500" /><span>Paralisado</span></dt>
            <dd class="text-sm text-slate-600 dark:text-slate-400 pl-6">Fica <strong>Indefeso</strong> e não pode realizar ações ou
              movimentos.</dd>
          </div>
        </dl>
      </div>

      <div class="space-y-6">
        <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'person-burst']" />
            <span>Manobras de Combate (1 Ação)</span>
          </h2>
          <dl class="space-y-4">
            <div>
              <dt class="font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'khanda']" class="text-slate-500" /><span>Ataque Total</span></dt>
              <dd class="text-sm text-slate-600 dark:text-slate-400 pl-6">Recebe <strong>Ganho</strong> no ataque, mas fica
                <strong>Desprevenido</strong> até o próximo turno.
              </dd>
            </div>
            <div>
              <dt class="font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'shield-halved']" class="text-slate-500" /><span>Defesa Total</span></dt>
              <dd class="text-sm text-slate-600 dark:text-slate-400 pl-6">Recebe <strong>Ganho</strong> em todas as jogadas de defesa
                até seu próximo turno.</dd>
            </div>
            <div>
              <dt class="font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'user-group']" class="text-slate-500" /><span>Agarrão</span></dt>
              <dd class="text-sm text-slate-600 dark:text-slate-400 pl-6">Teste de <strong>Poder</strong> vs. <strong>Poder</strong>.
                Vítima fica imobilizada e com <strong>Perda</strong> para atacar.</dd>
            </div>
            <div>
              <dt class="font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'person-running']" class="text-slate-500" /><span>Fuga</span></dt>
              <dd class="text-sm text-slate-600 dark:text-slate-400 pl-6">Teste de <strong>Habilidade (Meta 6 + nº de
                  oponentes)</strong> para escapar.</dd>
            </div>
          </dl>
        </div>

        <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500 flex items-center gap-x-2">
            <font-awesome-icon :icon="['fas', 'bolt-lightning']" />
            <span>Usando Pontos de Ação (PA)</span>
          </h2>
          <dl class="space-y-4">
            <div>
              <dt class="font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'circle-plus']" class="text-green-600" /><span>1 PA</span></dt>
              <dd class="text-sm text-slate-600 dark:text-slate-400 pl-6">Receber um <strong>Ganho</strong> ou anular uma
                <strong>Perda</strong> em um teste.
              </dd>
            </div>
            <div>
              <dt class="font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'plus-minus']" class="text-slate-500" /><span>1 PA (+Regras)</span></dt>
              <dd class="text-sm text-slate-600 dark:text-slate-400 pl-6">Recuperar 10 PV ou 10 PM. Pedir uma dica ao Mestre.</dd>
            </div>
            <div>
              <dt class="font-semibold flex items-center gap-x-2"><font-awesome-icon :icon="['fas', 'wand-sparkles']" class="text-slate-500" /><span>Custo da Vantagem
                    (+Regras)</span></dt>
              <dd class="text-sm text-slate-600 dark:text-slate-400 pl-6">Usar uma Vantagem que não possui por uma vez.</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>
