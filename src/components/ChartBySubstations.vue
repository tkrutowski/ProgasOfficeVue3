<script setup lang="ts">
import {ref, onMounted, computed, PropType, watch} from "vue";
import {GasconnectionQuery} from "@/types/GasconnectionQuery.ts";
import {UtilsService} from "@/service/UtilsService.ts";

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

const getSubstations = computed<string[]>(() => {
  let substations = gasConnections.value.map(value => value.substationName);

  return [...new Set(substations)];
});

const getData = computed<number[]>(() => {
  let list: number[] = [];
  getSubstations.value.forEach(item => {
    list.push(gasConnections.value
        .filter(value => value.substationName === item)
        .length)
  })
  return list;
})

const getColors = computed<string[]>(() => {
    let colors:string[] = [];
    getSubstations.value.forEach(() => {colors.push(UtilsService.getRandomBrightColor())})
  return colors;
});

const getHoverColors = computed<string[]>(() => {
  let colors:string[] = [];
   getColors.value.forEach(value => {colors.push(UtilsService.getHoverColor(value,20))})
  return colors;
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  return {
    labels: Array.from(getSubstations.value),
    datasets: [
      {
        backgroundColor: getColors,
        hoverBackgroundColor: getHoverColors,
        data: getData.value
      },
    ]
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');

  return {
    // responsive: true,
    // maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          cutout: '60%',
          color: textColor
        }
      }
    }
  };
}
</script>

<template>
  <Card class="card-border flex justify-content-center">
    <template #title>
      <p class="card-header">Ilość przyłączy wg. rozdzielnii.</p>
    </template>
    <template #content>
      <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-[40rem]"></Chart>
    </template>
  </Card>
</template>

<style scoped>
.card-header{
  font-size: 1.3rem;
}
.card-border {
  border-radius: 8px;
}
.chart-container {
  position: relative;
  width: 100px; /* Adjust this value to change the overall size of the chart */
  height: 100px; /* Adjust this value to change the overall size of the chart */
}
</style>