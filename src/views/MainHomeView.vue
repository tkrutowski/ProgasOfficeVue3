<script setup lang="ts">
import TheMenu from "../components/TheMenu.vue";
import AppCard from "../components/AppCard.vue";
import router from "../router";
import {useAuthorizationStore} from "../stores/authorization.ts";
import {useSettingStore} from "@/stores/setting.ts";

const settingStore = useSettingStore();
const authorizationStore = useAuthorizationStore();
if (settingStore.settings.userId === 0) settingStore.getSettingsFromDb();
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
  <div class="pl-3 pr-3">
    <TheMenu/>
    <h1
        v-if="!authorizationStore.isAuthenticatedOrToken"
        class="flex justify-center mt-8"
    >
      Musisz się najpierw zalogować... ;)
    </h1>
    <div v-else class="card flex flex-row flex-wrap justify-center gap-5 mt-10">
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
  </div>
</template>

<style scoped></style>
