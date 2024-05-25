<script setup lang="ts">
import DesignersDashboard from "@/components/DesignersMeterGroup.vue";
import {useAuthorizationStore} from "@/stores/authorization.ts";
import {useGasConnectionQueryStore} from "@/stores/gasconnectionQuery.ts";
import {useSettingStore} from "@/stores/setting.ts";
import {useDesignerStore} from "@/stores/designers.ts";
import {computed, onMounted, ref, watch} from "vue";
import {GasconnectionQuery} from "@/types/GasconnectionQuery.ts";
import moment from "moment";
import ChartBySubstations from "@/components/ChartBySubstations.vue";
import TableForConstructionManager from "@/components/TableForConstructionManager.vue";

const designerStore = useDesignerStore();
const settingStore = useSettingStore();
const authStore = useAuthorizationStore();
const gasConnectionQueryStore = useGasConnectionQueryStore();
const gasConnectionCached = ref<GasconnectionQuery[]>([])

onMounted(async () => {
  console.log('MOUNTED ConstructorDashboard')
  gasConnectionCached.value = gasConnectionQueryStore.gasConnectionCached;
})
watch(() => gasConnectionQueryStore.gasConnectionCached, () => {
  gasConnectionCached.value = gasConnectionQueryStore.gasConnectionCached;
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
      .filter(value => moment(value.agreementReceiptDate).diff(value.finishDeadline, 'days') > 0)
      .length
})
const getDeadlineCompany = computed<number>(() => {
  const daysBefore = settingStore.settings.gasConnectionSettings.daysBeforeProjectDeadlineDashboard;
  return gasConnectionCached.value
      .filter(value => getCompanyDesignerIds.value.includes(value.idDesigner))
      .filter(value => moment(value.finishDeadline).diff(moment(), 'days') <= daysBefore)
      .filter(value => moment(value.finishDeadline).diff(moment(), 'days') > 0)
      .length
})
const getRegularCompany = computed<number>(() => {
  let all: number = gasConnectionCached.value
      .filter(value => getCompanyDesignerIds.value.includes(value.idDesigner))
      .length
  return all - (getDeadlineCompany.value + getOverdueCompany.value)
})

//all
const getOverdueAll = computed<number>(() => {
  return gasConnectionCached.value
      .filter(value => !getCompanyDesignerIds.value.includes(value.idDesigner))
      .filter(value => moment(value.agreementReceiptDate).diff(value.finishDeadline, 'days') > 0)
      .length
})
const getDeadlineAll = computed<number>(() => {
  const daysBefore = settingStore.settings.gasConnectionSettings.daysBeforeProjectDeadlineDashboard;
  return gasConnectionCached.value
      .filter(value => !getCompanyDesignerIds.value.includes(value.idDesigner))
      .filter(value => moment(value.finishDeadline).diff(moment(), 'days') <= daysBefore)
      .filter(value => moment(value.finishDeadline).diff(moment(), 'days') > 0)
      .length
})
const getRegularAll = computed<number>(() => {
  let all: number = gasConnectionCached.value
      .filter(value => !getCompanyDesignerIds.value.includes(value.idDesigner))
      .length
  return all - (getDeadlineCompany.value + getOverdueCompany.value)
})

const getForDesignerChart = computed(() => {
  return gasConnectionCached.value
})

const getReadyToBuild = computed(() => {
  const daysBefore = settingStore.settings.gasConnectionSettings.daysBeforeFinishDeadlineDashboard;
  return gasConnectionCached.value
      .filter(value => value.agreementReceiptDate !== '0001-01-01')
      .filter(value => moment(value.finishDeadline).diff(moment(), 'days') <= daysBefore)
      .filter(value => moment(value.finishDeadline).diff(moment(), 'days') > 0)
      .sort((a, b) => moment(a.finishDeadline).diff(moment(b.finishDeadline)))
})
</script>

<template>
  <Panel v-if="authStore.isEmployee" toggleable>
    <template #header>
      <div>
        <span class="color-yellow">WYKONAWSTWO</span>
      </div>
    </template>
    <div class="grid card">
      <div class="col-12 lg:col-5">
        <DesignersDashboard class="mt-2"
                            :overdue="getOverdueCompany"
                            :deadline="getDeadlineCompany"
                            :normal="getRegularCompany"
                            designer-name="PROGAS SC"
        />
        <DesignersDashboard class="mt-2"
            :overdue="getOverdueAll"
            :deadline="getDeadlineAll"
            :normal="getRegularAll"
            designer-name="Pozostali"
        />
      </div>
      <div class="col">
        <ChartBySubstations v-if="authStore.isEmployee" :gas-connection-list="getForDesignerChart"
                            class="w-full p-3 m-2"/>
      </div>
    </div>
    <TableForConstructionManager :gas-connection-list="getReadyToBuild"/>
  </Panel>
</template>

<style scoped></style>
