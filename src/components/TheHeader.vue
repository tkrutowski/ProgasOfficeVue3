<script lang="ts" setup>
import {useAuthorizationStore} from "@/stores/authorization.ts";

const authStore = useAuthorizationStore();
</script>

<template>
  <div id="logo-back-mobile" class="color-progas d-md-none p-2">
    <img
        id="logo-mobile"
        alt="ProgasOffice logo"
        src="../assets/logo.png"
    />
    <div class="flex flex-col align-items-end">
      <h1 class="pr-3 pt-2  font-bold">ProgasOffice</h1>
      <theme-switcher/>
      <h5 class="flex justify-end  font-bold pr-1" v-if="authStore.isAuthenticatedOrToken">Użytkownik:
        {{ authStore.username }}</h5>
    </div>
  </div>
  <br/>
</template>
<style scoped>

#logo-mobile {
  width: 75px;
  height: 75px;
  margin-left: 5px;
  margin-top: 5px;
}

#logo-back-mobile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 120px;
  width: auto;
  background-color: #515455 !important;
}
</style>
