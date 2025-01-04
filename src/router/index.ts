import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Home/index.vue";
import SuccessView from "../views/Success/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/paysuccess",
      name: "success",
      component: SuccessView,
    },
  ],
});

export default router;
