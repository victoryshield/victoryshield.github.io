<template>
  <section id="testes">
    <div class="container mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold text-amber-700 dark:text-amber-500 mb-6 text-center">Rolador de Dados</h2>

      <div class="mb-8">
        <label for="numDice" class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Número de Dados (1 a 10)</label>
        <input
          type="number"
          id="numDice"
          v-model.number="numDice"
          min="1"
          max="10"
          class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-center text-xl"
        />
      </div>

      <div class="mb-8">
        <label for="modifier" class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Modificador (opcional)</label>
        <input
          type="number"
          id="modifier"
          v-model.number="modifier"
          class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white text-center text-xl"
        />
      </div>

      <button
        @click="rollDice"
        class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        Rolar Dados
      </button>

      <div v-if="results.length > 0" class="mt-8 bg-gray-100 dark:bg-slate-700 p-6 rounded-lg shadow-inner">
        <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">Resultados:</h3>
        <div class="flex flex-wrap justify-center gap-4 mb-4">
          <div
            v-for="(roll, index) in results"
            :key="index"
            class="w-20 h-20 flex items-center justify-center bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 text-3xl font-extrabold rounded-lg shadow-md"
          >
            {{ roll }}
          </div>
        </div>
        <p class="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center">
          Total: <span class="text-amber-700 dark:text-amber-500">{{ total }}</span>
          <span v-if="modifier !== 0"> ({{ totalWithoutModifier }} + {{ modifier }})</span>
        </p>
      </div>

      <div v-if="error" class="mt-4 p-3 bg-red-500 text-white rounded-md text-center">
        {{ error }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const numDice = ref(1);
const modifier = ref(0);
const results = ref([]);
const total = ref(0);
const totalWithoutModifier = ref(0);
const error = ref(null);

const rollDice = () => {
  error.value = null;
  results.value = [];
  total.value = 0;
  totalWithoutModifier.value = 0;

  if (numDice.value < 1 || numDice.value > 10) {
    error.value = 'O número de dados deve ser entre 1 e 10.';
    return;
  }

  let currentTotal = 0;
  for (let i = 0; i < numDice.value; i++) {
    const roll = Math.floor(Math.random() * 6) + 1; // D6
    results.value.push(roll);
    currentTotal += roll;
  }

  totalWithoutModifier.value = currentTotal;
  total.value = currentTotal + modifier.value;
};
</script>
