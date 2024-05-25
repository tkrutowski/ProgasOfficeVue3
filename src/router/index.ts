import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import {useAuthorizationStore} from "@/stores/authorization.ts";
import LoginView from "../views/LoginView.vue";
import MainHomeView from "../views/MainHomeView.vue";
import Error503View from "../views/Error503View.vue";
import RefreshComponent from "@/components/RefreshComponent.vue";

//TASKS
import TasksHomeView from "../views/tasks/TasksHomeView.vue";
import GasConnectionsView from "../views/tasks/GasConnectionsView.vue";


const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Home",
        component: MainHomeView,
      props: true,
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
    {
        path: '/refresh',
        name:'refresh',
        component: RefreshComponent,
      props: true,
    },
    //----------------------------------------------TASKS--------------------------------------------
    {
        path: "/home-tasks",
        name: "TasksHome",
        component: TasksHomeView,
    },
    {
        path: "/tasks/gasconnection/all",
        name: "GasConnections",
        component: GasConnectionsView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
router.beforeEach((to, from, next) => {
    const authStore= useAuthorizationStore();
    console.log("ROUTE to: ",to,", from: ",from );
    if (to.path) {
        let history = JSON.parse(localStorage.getItem('navigationHistory') || '[]');
        history.push(to.path);
        localStorage.setItem('navigationHistory', JSON.stringify(history));
    }
    let refreshToken = localStorage.getItem('refreshToken') || null;
    if (to.name !== 'login' && !authStore.isAuthenticated && refreshToken === null) {
        next({name: 'login'})
    } else
        next()
})
export default router;
