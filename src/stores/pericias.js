import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePericiasStore = defineStore('pericias', () => {
  const pericias = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchPericias = async () => {
    loading.value = true;
    error.value = null;
    try {
      // Simulate fetching data from a local JSON file
      const response = await fetch('/pericias.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      pericias.value = data;
    } catch (err) {
      error.value = err;
      console.error('Erro ao carregar perícias:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    pericias,
    loading,
    error,
    fetchPericias,
  };
});
