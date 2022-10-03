import { createRouter, createWebHistory } from 'vue-router'
import Weather from '../views/WeatherView.vue'
import FavoritesView from '../views/FavoritesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'weather',
      component: Weather
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView
    },
  ]
})

export default router
