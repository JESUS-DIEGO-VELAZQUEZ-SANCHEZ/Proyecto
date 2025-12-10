import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AddView from '@/views/AddView.vue'
import EditView from '@/views/EditView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/agregar', name: 'agregar', component: AddView },
    { path: '/editar/:id', name: 'editar', component: EditView },
  ],
})

export default router
