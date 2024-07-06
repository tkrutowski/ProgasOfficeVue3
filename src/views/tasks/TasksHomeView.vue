<script setup lang="ts">
import TheMenuTasks from "../../components/TheMenuTasks.vue";
import {useGasConnectionQueryStore} from "@/stores/gasconnectionQuery.ts";
import {useDesignerStore} from "@/stores/designers.ts";
import {onMounted, ref} from "vue";
import {GasconnectionQuery} from "@/types/GasconnectionQuery.ts";
import DesignerDashboard from "@/components/DesignerDashboard.vue";
import ConstructorDashboard from "@/components/ConstructorDashboard.vue";

const designerStore = useDesignerStore();
const gasConnectionQueryStore = useGasConnectionQueryStore();
const gasConnectionCached = ref<GasconnectionQuery[]>([])

onMounted(async () => {
  console.log('MOUNTED TaskHomeView')
  gasConnectionCached.value = await gasConnectionQueryStore.getGasConnectionCached();
  if (designerStore.designersCached.length === 0) designerStore.refreshDesignerCache()
})


</script>

<template>
  <TheMenuTasks/>
  <h2 class="color-yellow flex justify-content-center mt-3">TABLICA</h2>
  <DesignerDashboard/>
  <ConstructorDashboard class="mt-5"/>
</template>

<style scoped></style>
