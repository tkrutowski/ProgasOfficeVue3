<script setup lang="ts">
import TheMenu from "../components/TheMenu.vue";
import AppCard from "../components/AppCard.vue";
import router from "../router";
import {useAuthorizationStore} from "../stores/authorization.ts";

const authorizationStore = useAuthorizationStore();

function runTasks() {
  console.log("START - tasks()");
  if (authorizationStore.hasAccessTasks) {
    router.push({
      name: "TasksHome",
      // params: { idUser: 0, isEdit: "false" },
    });
  }
}
</script>

<template>
  <TheMenu />
  <h1
    v-if="!authorizationStore.isAuthenticatedOrToken"
    class="color-yellow flex justify-content-center mt-8"
  >
    Musisz się najpierw zalogować... ;)
  </h1>
  <div v-else class="flex flex-row flex-wrap justify-content-center gap-5 mt-5">
    <AppCard
      text-content="Gazociągi, przyłącza, wewnętrzne"
      text-title="Zadania"
      @clicked="runTasks"
      :disabled="!authorizationStore.hasAccessTasks"
    />
    <AppCard
      text-title="Finanse"
      text-content="Faktury, oferty"
    />
    <AppCard
        text-title="Pracownicy"
        text-content="Godziny, wypłaty, pożyczki"
    />
    <AppCard
        text-title="Klienci"
        text-content="Lista klientów"
    />
    <AppCard
        text-title="Pojazdy"
        text-content="Faktury, Oferty"
    />
    <AppCard
        text-title="Ustawienia"
        text-content="Konata, użytkownicy, dostępy"
    />
  </div>
</template>

<style scoped></style>
