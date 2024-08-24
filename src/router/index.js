import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/auth/LoginView.vue"
import RegisterView from "@/views/auth/view/RegisterView.vue"
import TheDashboardView from "@/components/TheDashboardView.vue";

const routes = [
  {
    name:'register',
    path: '/register',
    component: RegisterView,
    requiresAuth: true,
    roles: [],
    meta: {
      slug: 'User Registration',
    },
  },
  {
    name:'login',
    path: '/',
    component: LoginView,
    meta: {
      slug: 'Login',
    },
  },
  {
    name:'dashboard',
    path: '/dashboard',
    component: TheDashboardView,
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;