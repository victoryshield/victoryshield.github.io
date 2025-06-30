<template>
  <div class="auth-container">
    <h1 class="text-3xl font-bold mb-6 text-center">Autenticação</h1>
    <div class="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <form @submit.prevent="handleLogin" v-if="isLogin">
        <h2 class="text-2xl font-semibold mb-4 text-white">Login</h2>
        <div class="mb-4">
          <label for="email-login" class="block text-gray-300 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="email-login"
            v-model="email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
            placeholder="seu@email.com"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password-login" class="block text-gray-300 text-sm font-bold mb-2">Senha:</label>
          <input
            type="password"
            id="password-login"
            v-model="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
            placeholder="********"
            required
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Entrar
          </button>
          <a
            href="#"
            @click.prevent="isLogin = false"
            class="inline-block align-baseline font-bold text-sm text-blue-400 hover:text-blue-600"
          >
            Não tem uma conta? Registre-se
          </a>
        </div>
      </form>

      <form @submit.prevent="handleRegister" v-else>
        <h2 class="text-2xl font-semibold mb-4 text-white">Registro</h2>
        <div class="mb-4">
          <label for="email-register" class="block text-gray-300 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="email-register"
            v-model="email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
            placeholder="seu@email.com"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password-register" class="block text-gray-300 text-sm font-bold mb-2">Senha:</label>
          <input
            type="password"
            id="password-register"
            v-model="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
            placeholder="********"
            required
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Registrar
          </button>
          <a
            href="#"
            @click.prevent="isLogin = true"
            class="inline-block align-baseline font-bold text-sm text-green-400 hover:text-green-600"
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

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px); /* Ajuste para a altura do header, se houver */
  padding: 1rem;
  background-color: #1a202c; /* Cor de fundo escura */
  color: #e2e8f0; /* Cor do texto principal */
}
</style>
