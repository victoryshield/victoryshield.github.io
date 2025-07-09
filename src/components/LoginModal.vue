<template>
  <div class="fixed inset-0 bg-white bg-opacity-75 dark:bg-black dark:bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl max-w-sm w-full relative">
      <button @click="$emit('close')" class="absolute top-3 right-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
        <font-awesome-icon :icon="['fas', 'times']" />
      </button>
      <h2 class="text-2xl font-bold mb-4 text-center text-slate-800 dark:text-slate-100">{{ isLoginMode ? 'Login' : 'Registrar' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4 relative">
          <label for="email" class="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">Email:</label>
          <div class="relative">
            <span class="absolute inset-y-0 right-0 flex items-center pr-3">
              <font-awesome-icon :icon="['fas', 'envelope']" class="text-slate-400" />
            </span>
            <input
              type="email"
              id="email"
              v-model="email"
              class="shadow appearance-none border rounded w-full py-2 pl-3 pr-10 text-slate-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
              required
            />
          </div>
        </div>
        <div class="mb-6 relative">
          <label for="password" class="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">Senha:</label>
          <div class="relative">
            <span class="absolute inset-y-0 right-0 flex items-center pr-3">
              <font-awesome-icon :icon="['fas', 'lock']" class="text-slate-400" />
            </span>
            <input
              type="password"
              id="password"
              v-model="password"
              class="shadow appearance-none border rounded w-full py-2 pl-3 pr-10 text-slate-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
              required
            />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <button
            type="button"
            @click="isLoginMode = !isLoginMode"
            class="inline-block align-baseline font-bold text-sm text-amber-500 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-600"
          >
            {{ isLoginMode ? 'Criar uma conta' : 'Já tenho uma conta' }}
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 flex items-center gap-2"
          >
            <font-awesome-icon :icon="isLoginMode ? ['fas', 'sign-in-alt'] : ['fas', 'user-plus']" />
            <span v-if="!loading">{{ isLoginMode ? 'Entrar' : 'Registrar' }}</span>
            <span v-else>Carregando...</span>
          </button>
        </div>
        <p v-if="error" class="text-red-500 text-xs italic mt-4">{{ error }}</p>
        <p v-if="successMessage" class="text-green-500 text-xs italic mt-4">{{ successMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../stores/auth';

const emit = defineEmits(['close']);

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref(null);
const successMessage = ref(null);
const isLoginMode = ref(true); // true for login, false for register

const authStore = useAuthStore();

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    if (isLoginMode.value) {
      // Login logic
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });

      if (signInError) {
        throw signInError;
      }

      await authStore.fetchUser();
      emit('close'); // Close the modal on successful login
    } else {
      // Register logic
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      });

      if (signUpError) {
        throw signUpError;
      }

      successMessage.value = 'Registro bem-sucedido! Por favor, verifique seu e-mail para confirmar sua conta.';
      // Optionally switch to login mode after successful registration
      isLoginMode.value = true;
    }
  } catch (err) {
    error.value = err.message;
    console.error('Authentication error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Add any specific styles for the modal here if needed */
</style>
