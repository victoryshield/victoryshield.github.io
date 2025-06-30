<template>
  <section id="regras">
    <div class="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow">

      <div class="relative mb-6">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <font-awesome-icon :icon="['fas', 'search']" class="text-slate-400" />
        </span>
        <input type="search" id="regras-search-input" placeholder="Buscar por nome em todas as categorias..."
          class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400">
      </div>

      <div id="regras-nav" class="flex flex-wrap justify-center gap-2 mb-6 border-b-2 border-amber-500 pb-4">
      </div>

      <div id="regras-content">
      </div>

      <div id="regras-search-results" class="hidden">
      </div>

    </div>
  </section>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>
