<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {useSettingStore} from "@/stores/setting.ts";


const settingStore = useSettingStore();
const props = defineProps({
  designerName: {
    type: String,
    required: true,
    default: "Test testowy"
  },
  overdue: {
    type: Number,
    required: true,
    default: 10
  },
  deadline: {
    type: Number,
    required: true,
    default: 30
  },
  normal: {
    type: Number,
    required: true,
    default: 20
  },
})

const fullName = ref<string>(props.designerName)
const beforeDeadline = ref<number>(props.deadline)
const overdue = ref<number>(props.overdue)
const regular = ref<number>(props.normal)
watch(
    () => props,
    () => {
      fullName.value = props.designerName
      beforeDeadline.value = props.deadline
      overdue.value = props.overdue
      regular.value = props.normal
      fullName.value = props.designerName
    },
    {deep: true}
)

const all = computed<number>(() => {
  return beforeDeadline.value + overdue.value + regular.value;
})

const value = computed(() => [
  {
    label: `Przeterminowane (${overdue.value} szt.)`,
    color: settingStore.settings.gasConnectionSettings.colorOverdue,
    value: overdue.value,
    icon: 'pi pi-table'
  },
  {
    label: `Zostało mało czasu (${beforeDeadline.value} szt.)`,
    color: settingStore.settings.gasConnectionSettings.colorBeforeDeadline,
    value: beforeDeadline.value,
    icon: 'pi pi-table'
  },
  {
    label: `W trakcie... (${regular.value} szt.)`,
    color: settingStore.settings.gasConnectionSettings.colorReceipt,
    value: regular.value,
    icon: 'pi pi-table'
  },
]);
</script>

<template>
  <Card class="card-border">
    <template #title>Projektant: {{ fullName }} ({{ all }} szt.)</template>
    <template #content>
      <MeterGroup :value="value" :max="all"/>
    </template>
  </Card>
</template>

<style scoped>
.card-border {
  border-radius: 8px;
  border: 1px solid rgba(255, 245, 0, 1)
}
</style>