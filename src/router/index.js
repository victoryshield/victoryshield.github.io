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

export default router;
