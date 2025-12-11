import { createRouter, createWebHistory } from 'vue-router'

// Vistas
import HomeView from '@/views/HomeView.vue'
import AddView from '@/views/AddView.vue'
import DetailView from '@/views/DetailView.vue'
import AllView from '@/views/AllView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/addBoardgame',
      name: 'addBoardgame',
      component: AddView,
    },
    {
      path: '/boardgame/:id',
      name: 'boardgameId',
      component: DetailView,
      props: true,
    },
    {
      path: '/boardgame',
      name: 'boardgame',
      component: AllView,
    }
    
  ],
})

export default router
