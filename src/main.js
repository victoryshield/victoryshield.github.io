import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';
import { useAuthStore } from './stores/auth';
import { supabase } from './services/supabase';

const pinia = createPinia();

const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount('#app');
