<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-amber-500">{{ title }}</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-6">{{ message }}</p>
      <div class="flex justify-end gap-4">
        <button @click="$emit('close')" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:bg-slate-600 dark:border-slate-500 dark:text-white dark:hover:bg-slate-500 flex items-center justify-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'times']" />
          <span>Cancelar</span>
        </button>
        <button @click="$emit('confirm')" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center gap-x-2">
          <font-awesome-icon :icon="['fas', 'check']" />
          <span>Confirmar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

defineEmits(['close', 'confirm']);
</script>
