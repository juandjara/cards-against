import Vue from 'vue'
import Router from 'vue-router'
import UserSelect from '@/pages/UserSelect.vue'
import RoomSelect from '@/pages/RoomSelect.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: UserSelect,
      meta: { skipAuth: true }
    },
    {
      path: '/',
      name: 'room-select',
      component: RoomSelect
    }
  ]
})

export default router
