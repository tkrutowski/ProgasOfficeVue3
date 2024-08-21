<script setup lang="ts">
import DesignersDashboard from "@/components/DesignersMeterGroup.vue";
import {useAuthorizationStore} from "@/stores/authorization.ts";
import {useGasConnectionQueryStore} from "@/stores/gasconnectionQuery.ts";
import {useSettingStore} from "@/stores/setting.ts";
import {useDesignerStore} from "@/stores/designers.ts";
import {computed, onMounted, ref, watch} from "vue";
import {GasconnectionQuery} from "@/types/GasconnectionQuery.ts";
import moment from "moment";
import DesignersChart from "@/components/CharByDesigners.vue";
import TableForDesigners from "@/components/TableForDesigners.vue";

const designerStore = useDesignerStore();
const settingStore = useSettingStore();
const authStore = useAuthorizationStore();
const gasConnectionQueryStore = useGasConnectionQueryStore();
const gasConnectionCached = ref<GasconnectionQuery[]>([])

onMounted(async () => {
  console.log('MOUNTED DesignerDashboard')
  gasConnectionCached.value = gasConnectionQueryStore.gasConnectionCached;
})

watch(() => gasConnectionQueryStore.gasConnectionCached, () => {
  gasConnectionCached.value = gasConnectionQueryStore.gasConnectionCached;
})
const idDesigner = ref<number>(authStore.getUserDesignerId);
const getDesignerName = computed<string>(() => {
  return designerStore.getDesignerFullName(authStore.getUserDesignerId);
})
const getOverdueDesigner = computed<number>(() => {
  return gasConnectionCached.value
      .filter(value => value.idDesigner === idDesigner.value)
      .filter(value => value.stage < 5)
      .filter(value => moment(value.wsgAgreementReceiptDate).diff(value.projectDeadline, 'days') > 0)
      .length
})
const getDeadlineDesigner = computed(() => {
  const daysBefore = settingStore.settings.gasConnectionSettings.daysBeforeProjectDeadline;
  return gasConnectionCached.value
      .filter(value => value.idDesigner === idDesigner.value)
      .filter(value => value.stage < 5)
      .filter(value => moment(value.projectDeadline).diff(moment(), 'days') <= daysBefore)
      .filter(value => moment(value.projectDeadline).diff(moment(), 'days') > 0)
      .length;
});
const getRegularDesigner = computed<number>(() => {
  let all: number = gasConnectionCached.value
      .filter(value => value.idDesigner === idDesigner.value)
      .filter(value => value.stage < 5)
      .length
  return all - (getDeadlineDesigner.value + getOverdueDesigner.value)
})

//company
const getCompanyDesignerIds = computed<number[]>(() => {
  return designerStore.designersCached
      .filter(designer => designer.employee)
      .map(designer => designer.id)
})
const getOverdueCompany = computed<number>(() => {
  return gasConnectionCached.value
      .filter(value => getCompanyDesignerIds.value.includes(value.idDesigner))
      .filter(value => value.stage < 5)
      .filter(value => moment(value.wsgAgreementReceiptDate).diff(value.projectDeadline, 'days') > 0)
      .length
})
const getDeadlineCompany = computed<number>(() => {
  const daysBefore = settingStore.settings.gasConnectionSettings.daysBeforeProjectDeadline;
  return gasConnectionCached.value
      .filter(value => getCompanyDesignerIds.value.includes(value.idDesigner))
      .filter(value => value.stage < 5)
      .filter(value => moment(value.projectDeadline).diff(moment(), 'days') <= daysBefore)
      .filter(value => moment(value.projectDeadline).diff(moment(), 'days') > 0)
      .length
})
const getRegularCompany = computed<number>(() => {
  let all: number = gasConnectionCached.value
      .filter(value => getCompanyDesignerIds.value.includes(value.idDesigner))
      .filter(value => value.stage < 5)
      .length
  return all - (getDeadlineCompany.value + getOverdueCompany.value)
})

const getForDesignerTable = computed(() => {
  const daysBefore = settingStore.settings.gasConnectionSettings.daysBeforeProjectDeadline;
  return gasConnectionCached.value
      .filter(value => value.idDesigner === idDesigner.value)
      .filter(value => value.stage < 5)
      .filter(value => moment(value.projectDeadline).diff(moment(), 'days') <= daysBefore)
      .sort((a, b) => moment(a.projectDeadline).diff(moment(b.projectDeadline)))
})
const getForDesignerChart = computed(() => {
  return gasConnectionCached.value
})


</script>

<template>
  <Panel toggleable>
    <template #header>
      <h4 class="font-bold">PROJEKTOWANIE</h4>
    </template>
    <div class="flex flex-row gap-4 flex-wrap w-full">
      <DesignersDashboard class=" w-full"
                          v-if="authStore.isDesigner"
                          :overdue="getOverdueDesigner"
                          :deadline="getDeadlineDesigner"
                          :normal="getRegularDesigner"
                          :designer-name="getDesignerName"
      />
      <DesignersDashboard class="w-full"
                          v-if="authStore.hasAccessTasksGasConnectionDesignReadAll"
                          :overdue="getOverdueCompany"
                          :deadline="getDeadlineCompany"
                          :normal="getRegularCompany"
                          designer-name="PROGAS SC"
      />

      <DesignersChart class=" w-full"
                      v-if="authStore.hasAccessTasksGasConnectionDesignReadAll"
                      :gas-connection-list="getForDesignerChart"
                      style="min-width: 600px; min-height: 400px;"
      />
      <TableForDesigners class="w-full"
                         v-if="authStore.isDesigner"
                         id="tableForDesigners"
                         :gas-connection-list="getForDesignerTable"
                         :days-before=" settingStore.settings.gasConnectionSettings.daysBeforeProjectDeadline"
      />

    </div>
  </Panel>
</template>

<style scoped></style>
