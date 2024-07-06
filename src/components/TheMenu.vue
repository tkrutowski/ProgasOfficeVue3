<script setup lang="ts">
import { ref } from "vue";
import { useAuthorizationStore } from "../stores/authorization";
import OfficeButton from "../components/OfficeButton.vue";
import router from "../router";

const authorizationStore = useAuthorizationStore();
const items = ref([
  {
    label: "Home",
    icon: "pi pi-fw pi-home",
    command: () => {
      router.push({ name: "Home" });
    },
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
