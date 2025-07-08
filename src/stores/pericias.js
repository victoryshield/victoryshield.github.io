import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../services/supabase';

export const usePericiasStore = defineStore('pericias', () => {
  const pericias = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchPericias = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: supabaseError } = await supabase
        .from('pericias')
        .select('id, name, description');
      if (supabaseError) throw supabaseError;
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
