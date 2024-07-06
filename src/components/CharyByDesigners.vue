<script setup lang="ts">
import {ref, onMounted, computed, PropType, watch} from "vue";
import {useSettingStore} from "@/stores/setting.ts";
import moment from "moment";
import {GasconnectionQuery} from "@/types/GasconnectionQuery.ts";

const settingStore = useSettingStore();
onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const props = defineProps({
  gasConnectionList: {
    type: Array as PropType<GasconnectionQuery[]>,
    required: true,
    default: []
  },
})

const gasConnections = ref<GasconnectionQuery[]>(props.gasConnectionList)
watch(
    () => props,
    () => {
      gasConnections.value = props.gasConnectionList
      chartData.value = setChartData();
      chartOptions.value = setChartOptions();
    },
    {deep: true}
)

const getDesigners = computed<Map<number, string>>(() => {
  const designerMap = new Map();
  gasConnections.value.forEach(item => {
    designerMap.set(item.idDesigner, item.designerFullName);
  });
  return designerMap;
});

const getOverdue = computed<number[]>(() => {
  let list: number[] = [];
  let ids = Array.from(getDesigners.value.keys());
  ids.forEach(id => {
    list.push(gasConnections.value
        .filter(value => value.idDesigner === id)
        .filter(value => value.stage < 5)
        .filter(value => moment(value.agreementReceiptDate).diff(value.projectDeadline, 'days') > 0)
        .length)
  })
  return list;
})

const getDeadline = computed<number[]>(() => {
  let list: number[] = [];
  const daysBefore = settingStore.settings.gasConnectionSettings.daysBefore;
  let ids = Array.from(getDesigners.value.keys());
  ids.forEach(id => {
    list.push(gasConnections.value
        .filter(value => value.idDesigner === id)
        .filter(value => value.stage < 5)
        .filter(value => moment(value.projectDeadline).diff(moment(), 'days') <= daysBefore)
        .filter(value => moment(value.projectDeadline).diff(moment(), 'days') > 0)
        .length)
  })
  return list;
})

const getRegular = computed<number[]>(() => {
  let list: number[] = [];
  const daysBefore = settingStore.settings.gasConnectionSettings.daysBefore;

  let ids = Array.from(getDesigners.value.keys());
  ids.forEach(id => {
    let overdue = gasConnections.value
        .filter(value => value.idDesigner === id)
        .filter(value => value.stage < 5)
        .filter(value => moment(value.agreementReceiptDate).diff(value.projectDeadline, 'days') > 0)
        .length
    let deadline = gasConnections.value
        .filter(value => value.idDesigner === id)
        .filter(value => value.stage < 5)
        .filter(value => moment(value.projectDeadline).diff(moment(), 'days') <= daysBefore)
        .filter(value => moment(value.projectDeadline).diff(moment(), 'days') > 0)
        .length
    let all: number = gasConnections.value
        .filter(value => value.idDesigner === id)
        .filter(value => value.stage < 5)
        .length
    list.push(all - (deadline + overdue))
  })
  return list;
})


const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  return {
    labels: Array.from(getDesigners.value.values()),
    datasets: [
      {
        type: 'bar',
        label: 'Przeterminowane',
        backgroundColor: settingStore.settings.gasConnectionSettings.colorOverdue,
        data: getOverdue.value
      },
      {
        type: 'bar',
        label: 'Zbliża się termin',
        backgroundColor: settingStore.settings.gasConnectionSettings.colorBeforeDeadline,
        data: getDeadline.value
      },
      {
        type: 'bar',
        label: 'W trakcie',
        backgroundColor: settingStore.settings.gasConnectionSettings.colorReceipt,
        data: getRegular.value
      }
    ]
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = "rgba(255, 255, 255, 0.87)";
  const textColorSecondary = "rgba(255, 255, 255, 0.87)";
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      tooltips: {
        mode: 'index',
        intersect: false
      },
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        stacked: true,
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      }
    }
  };
}
</script>

<template>
  <Card class="card-border">
    <template #title>
      <span class="card-header">Lista przyłączy wg. projektantów.</span>
    </template>
    <template #content>
      <Chart type="bar" :data="chartData" :options="chartOptions" class="h-25rem"></Chart>
    </template>
  </Card>
</template>

<style scoped>
.card-header{
  font-size: 1.3rem;
  font-weight: bold;
}
.card-border {
  border-radius: 8px;
  border: 1px solid rgba(255, 245, 0, 1)
}
</style>