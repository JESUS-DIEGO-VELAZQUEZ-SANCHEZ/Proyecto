import { createRouter, createWebHistory } from 'vue-router'

// Vistas
import HomeView from '@/views/HomeView.vue'
import AddView from '@/views/AddView.vue'
import EditView from '@/views/EditView.vue'
import DetailView from '@/views/DetailView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
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
      path: '/agregar',
      name: 'agregar',
      component: AddView,
    },
    {
      path: '/editar/:id',
      name: 'editar',
      component: EditView,
      props: true, // hace que el :id llegue como prop
    },
    {
      path: '/detalle/:id',
      name: 'detalle',
      component: DetailView,
      props: true,
    },
    {
      path: '/favoritos',
      name: 'favoritos',
      component: FavoritesView,
    },
    {
      path: '/boardgame',
      name: 'boardgame',
      component: AllView,
    }
    
  ],
})

export default router
