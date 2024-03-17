import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import LoginView from "../views/LoginView.vue";
import MainHomeView from "../views/MainHomeView.vue";
import Error503View from "../views/Error503View.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: MainHomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/error",
    name: "Error503",
    component: Error503View,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
