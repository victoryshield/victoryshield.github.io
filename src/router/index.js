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
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
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
    meta: { requiresAuth: true },
  },
  {
    path: '/npcs',
    name: 'NPCs',
    component: NpcsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/bestiario',
    name: 'Bestiario',
    component: BestiarioView,
    meta: { requiresAuth: true },
  },
  {
        path: '/sessoes',
        name: 'Sessões',
        component: () => import('../views/SessaoAtualView.vue'),
        meta: { requiresAuth: true, title: 'Sessão Atual', icon: ['fas', 'scroll'] }
      },
  {
    path: '/campanha',
    name: 'Campanha',
    component: CampanhaView,
    meta: { requiresAuth: true },
  },
  {
    path: '/testes',
    name: 'Testes',
    component: () => import('../views/TestesView.vue'),
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
    next('/');
  } else {
    next();
  }
});

export default router;

