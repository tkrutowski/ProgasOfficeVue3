<script setup lang="ts">
import {useAuthorizationStore} from "../stores/authorization";
import {useDesignerStore} from "@/stores/designers.ts";
import {onMounted, ref} from "vue";
import OfficeButton from "../components/OfficeButton.vue";

const authorizationStore = useAuthorizationStore();
const designerStore = useDesignerStore();
import {useSettingStore} from "@/stores/setting.ts";
import router from "@/router";

const settingStore = useSettingStore();
const username = ref<string>("");
const password = ref<string>("");

onMounted(() => {
  console.log("MOUNTED");
  authorizationStore.loginError = false;
});

async function login() {
  let result = await authorizationStore.login(username.value, password.value);

  if (result) {
    await settingStore.getSettingsFromDb()
    designerStore.refreshDesignerCache()
    // router.back();
    goBack()
  }
}

function goBack(): void {
  let history: string[] | [] = JSON.parse(localStorage.getItem('navigationHistory') || '[]');
  let lastAddress = history[history.length - 1];
  if (lastAddress && (lastAddress === "/error" || lastAddress === "/login")) {
    history = history.slice(-25);
    history = history.filter(item => item !== lastAddress); // Usuń ostatnią odwiedzoną stronę
    localStorage.setItem('navigationHistory', JSON.stringify(history));
  }

  if (history.length > 0)
    router.replace(history[history.length - 1]);
  else
    router.replace("/");
}

</script>
<template>
  <form
      class="login-form mb-5 mt-1 mt-md-5"
      @submit.prevent="login()"
  >
    <h2 class="mb-5 mt-5 color-yellow text-center">Logowanie</h2>

    <!-- ERROR -->
    <div v-if="authorizationStore.loginError">
      <p id="error">Niestety podałeś niewłaściwy login lub hasło.</p>
    </div>

    <FloatLabel>
      <InputText
          id="username"
          v-model="username"
          class="w-full"
          autocomplete="username"
          required
      />
      <label for="username">Login</label>
    </FloatLabel>

    <!-- PASSWORD -->
    <FloatLabel class="mt-5">
      <Password v-model="password"
                toggleMask
                required
                id="password"
                class="w-full"
                autocomplete="current-password"
                :inputStyle="{'width':'100%'}"
                :feedback="false"

      />
      <label for="password" class="w-full">Hasło</label>
    </FloatLabel>


    <!-- BUTTON -->
    <office-button
        text="zaloguj się"
        class="btn mt-5 mb-1"
        style="width: 100%"
        btn-type="office-regular"
        type="submit"
        :disabled="authorizationStore.btnDisabled || settingStore.loadingSettings"
        :loading="authorizationStore.loading || settingStore.loadingSettings"
    >Zaloguj się
    </office-button>
    <p class="text-right mb-4">
      <router-link class="color-gray link" to="/forgot-password"
      >Nie pamiętam hasła
      </router-link
      >
    </p>
  </form>
</template>

<style scoped>
#error {
  color: red;
}

/* unvisited link */
.link:link {
  color: #a29a8e;
}

/* visited link */
.link:visited {
  color: #a29a8e;
}

/* mouse over link */
.link:hover {
  color: rgba(255, 245, 0, .7);
  text-decoration: none;
}

.login-form {
  max-width: 400px;
  margin: auto;
  margin-top: 200px;
}
</style>
