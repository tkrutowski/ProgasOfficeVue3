<script setup lang="ts">
import { ref } from "vue";
import { useAuthorizationStore} from "../stores/authorization";
import OfficeButton from "../components/OfficeButton.vue";
import router from "../router";

const authorizationStore = useAuthorizationStore();
const items = ref([
  {
    label: "Home",
    icon: "pi pi-fw pi-home",
    // to: { name: "Home" },
    command: () => {
      router.push({ name: "Home" });
    },
  },
  {
    label: "Tablica",
    icon: "pi pi-chart-bar",
    disabled: !authorizationStore.hasAccessTasks,
    command: () => {
      if(window.location.href.includes(router.resolve({name: "TasksHome"}).href)) {
        const redirect = JSON.stringify({ name: 'TasksHome' });
        router.push({ path: '/refresh', query: { redirect: redirect } });
      }else {
      router.push({ name: "TasksHome" });
      }
    },
  },
  {
    label: "Przyłącza",
    // icon: "pi pi-fw pi-euro",
    disabled: !authorizationStore.hasAccessTasksGasConnection,
    items: [
      {
        label: "Nowe przyłącze",
        icon: "pi pi-fw pi-file",
        disabled: true,
        // to: { name: "Invoice", params: { isEdit: "false", invoiceId: 0 } },
        command: () => {
          router.push({
            name: "Book",
            params: { isEdit: "false", bookId: 0 },
          });
        },
      },
      {
        label: "Lista przyłączy - projekt",
        icon: "pi pi-fw pi-list",
        disabled: !authorizationStore.isDesignerOrHasAccessTaskGasConnectionDesign,
        // to: { name: "Invoices" },
        command: () => {
          if(window.location.href.includes(router.resolve({name: "GasConnectionsDesign"}).href)) {
            const redirect = JSON.stringify({ name: 'GasConnectionsDesign' });
            router.push({ path: '/refresh', query: { redirect: redirect } });
          }else {
            router.push({ name: "GasConnectionsDesign" });
          }
        },
      },
      {
        label: "Lista przyłączy - budowa",
        icon: "pi pi-fw pi-list",
        disabled: !authorizationStore.hasAccessTasksGasConnectionBuild,
        // to: { name: "Invoices" },
        command: () => {
          if(window.location.href.includes(router.resolve({name: "GasConnectionsBuild"}).href)) {
            const redirect = JSON.stringify({ name: 'GasConnectionsBuild' });
            router.push({ path: '/refresh', query: { redirect: redirect } });
          }else {
            router.push({ name: "GasConnectionsBuild" });
          }
        },
      },
    ],
  },
]);
</script>

<template>
  <Menubar :model="items" class="main-menu">
    <template #start>
      <img alt="logo" src="../assets/logo_mini.png" height="30" class="mr-2" />
    </template>
    <template #end>
      <div v-if="!authorizationStore.isAuthenticatedOrToken">
        <router-link :to="{ name: 'login' }" style="text-decoration: none">
          <OfficeButton
            size="sm"
            class="my-2 ml-2 my-sm-0"
            btn-type="office-regular"
            text="zaloguj się"
          />
        </router-link>
      </div>
      <div v-else>
        <OfficeButton
          size="sm"
          class="my-2 ml-2 my-sm-0"
          btn-type="office-regular"
          text="wyloguj"
          :onclick="authorizationStore.logout"
        />
      </div>
    </template>
  </Menubar>

</template>
<style scoped></style>
