<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 p-4">
    <h1 class="text-3xl sm:text-4xl font-bold mb-6 text-center text-amber-700 dark:text-amber-500" style="font-family: 'Bangers', cursive;">Autenticação</h1>
    <div class="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <form @submit.prevent="handleLogin" v-if="isLogin">
        <h2 class="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Login</h2>
        <div class="mb-4 relative">
          <label for="email-login" class="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">Email:</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <font-awesome-icon :icon="['fas', 'envelope']" class="text-gray-400" />
          </div>
          <input
            type="email"
            id="email-login"
            v-model="email"
            class="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-slate-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
            placeholder="seu@email.com"
            required
          />
        </div>
        <div class="mb-6 relative">
          <label for="password-login" class="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">Senha:</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <font-awesome-icon :icon="['fas', 'lock']" class="text-gray-400" />
          </div>
          <input
            type="password"
            id="password-login"
            v-model="password"
            class="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-slate-700 dark:text-white mb-3 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
            placeholder="********"
            required
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center gap-x-2"
          >
            <font-awesome-icon :icon="['fas', 'sign-in-alt']" />
            <span>Entrar</span>
          </button>
          <a
            href="#"
            @click.prevent="isLogin = false"
            class="inline-block align-baseline font-bold text-sm text-amber-600 hover:text-amber-700"
          >
            Não tem uma conta? Registre-se
          </a>
        </div>
      </form>

      <form @submit.prevent="handleRegister" v-else>
        <h2 class="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Registro</h2>
        <div class="mb-4 relative">
          <label for="email-register" class="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">Email:</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <font-awesome-icon :icon="['fas', 'envelope']" class="text-gray-400" />
          </div>
          <input
            type="email"
            id="email-register"
            v-model="email"
            class="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-slate-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
            placeholder="seu@email.com"
            required
          />
        </div>
        <div class="mb-6 relative">
          <label for="password-register" class="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">Senha:</label>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <font-awesome-icon :icon="['fas', 'lock']" class="text-gray-400" />
          </div>
          <input
            type="password"
            id="password-register"
            v-model="password"
            class="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-slate-700 dark:text-white mb-3 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
            placeholder="********"
            required
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex items-center gap-x-2"
          >
            <font-awesome-icon :icon="['fas', 'user-plus']" />
            <span>Registrar</span>
          </button>
          <a
            href="#"
            @click.prevent="isLogin = true"
            class="inline-block align-baseline font-bold text-sm text-amber-600 hover:text-amber-700"
          >
            Já tem uma conta? Faça login
          </a>
        </div>
      </form>
      <p v-if="message" class="mt-4 text-center text-sm" :class="messageType === 'error' ? 'text-red-400' : 'text-green-400'">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../services/supabase';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const isLogin = ref(true);
const message = ref('');
const messageType = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    message.value = 'Login bem-sucedido!';
    messageType.value = 'success';
    router.push('/'); // Redireciona para a página inicial após o login
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  }
};

const handleRegister = async () => {
  try {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    message.value = 'Registro bem-sucedido! Verifique seu email para confirmar.';
    messageType.value = 'success';
    isLogin.value = true; // Volta para a tela de login após o registro
  } catch (error) {
    message.value = error.message;
    messageType.value = 'error';
  }
};
</script>


