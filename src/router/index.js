import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RegrasView from '../views/RegrasView.vue';
import NpcsView from '../views/NpcsView.vue';
import CombateView from '../views/CombateView.vue';
import ManobrasView from '../views/ManobrasView.vue';
import MestrandoView from '../views/MestrandoView.vue';
import PersonagensView from '../views/PersonagensView.vue';
import BestiarioView from '../views/BestiarioView.vue';
import SessaoAtualView from '../views/SessaoAtualView.vue';
import CampanhaView from '../views/CampanhaView.vue';
import AuthView from '../views/AuthView.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
  },
  {
    path: '/combate',
    name: 'Combate',
    component: CombateView,
  },
  {
    path: '/manobras',
    name: 'Manobras',
    component: ManobrasView,
  },
  {
    path: '/regras',
    name: 'Regras',
    component: RegrasView,
  },
  {
    path: '/mestrando',
    name: 'Mestrando',
    component: MestrandoView,
  },
  {
    path: '/personagens',
    name: 'Personagens',
    component: PersonagensView,
  },
  {
    path: '/npcs',
    name: 'NPCs',
    component: NpcsView,
  },
  {
    path: '/bestiario',
    name: 'Bestiario',
    component: BestiarioView,
  },
  {
    path: '/sessao-atual',
    name: 'SessaoAtual',
    component: SessaoAtualView,
  },
  {
    path: '/campanha',
    name: 'Campanha',
    component: CampanhaView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  await authStore.fetchUser(); // Ensure user session is loaded

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = !!authStore.user;

  if (requiresAuth && !isAuthenticated) {
    next('/auth');
  } else if (to.path === '/auth' && isAuthenticated) {
    next('/personagens'); // Redirect authenticated users from auth/home to a protected route
  } else {
    next();
  }
});

export default router;
