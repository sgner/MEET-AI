import {createRouter,createWebHashHistory} from "vue-router";
import Login from "@/views/login/index.vue"
const routes = [
  {
     path: '/',
     name: 'index',
     redirect: '/login'
  },
  {
     path: '/login',
     name: 'Login',
     component:()=> Login
  }
]
const router = createRouter({
   history: createWebHashHistory(),
   routes: routes
})

export default router;
