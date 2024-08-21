<script setup lang="ts">
import TheMenuTasks from "../../components/TheMenuTasks.vue";
import {useGasConnectionQueryStore} from "@/stores/gasconnectionQuery.ts";
import {useDesignerStore} from "@/stores/designers.ts";
import {onMounted, ref} from "vue";
import {GasconnectionQuery} from "@/types/GasconnectionQuery.ts";
import DesignerDashboard from "@/components/DesignerDashboard.vue";
import ConstructorDashboard from "@/components/ConstructorDashboard.vue";
import {useSettingStore} from "@/stores/setting.ts";
import {useAuthorizationStore} from "@/stores/authorization.ts";

const authStore = useAuthorizationStore();
const settingStore = useSettingStore();
const designerStore = useDesignerStore();
const gasConnectionQueryStore = useGasConnectionQueryStore();
const gasConnectionCached = ref<GasconnectionQuery[]>([])

onMounted(async () => {
  console.log('MOUNTED TaskHomeView')
  gasConnectionCached.value = await gasConnectionQueryStore.getGasConnectionCached();
  if (designerStore.designersCached.length === 0) designerStore.refreshDesignerCache()
  if (designerStore.designersTrafficCached.length === 0) designerStore.refreshDesignerCache()
  if (settingStore.settings.userId === 0) settingStore.getSettingsFromDb();
})


</script>

<template>
  <div class="pl-3 pr-3">
    <TheMenuTasks/>
    <h2 class="flex justify-center mt-3 mb-2 font-bold">TABLICA</h2>
    <div class="flex flex-row flex-wrap justify-center gap-5 mt-5">

      <DesignerDashboard v-if="authStore.isDesignerOrHasAccessTaskGasConnectionDesign" style="max-width: 1000px"/>
      <ConstructorDashboard v-if="authStore.hasAccessTasksGasConnectionBuild" style="max-width: 1000px"/>
    </div>
  </div>
</template>

<style scoped></style>
