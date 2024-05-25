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
  const textColor = "rgba(255, 255, 255, 0.87)";

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
      <span class="card-header">Ilość przyłączy wg. rozdzielnii.</span>
    </template>
    <template #content>
      <Chart type="doughnut" :data="chartData" :options="chartOptions" :height="250" :width="500"></Chart>
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
.chart-container {
  position: relative;
  width: 300px; /* Adjust this value to change the overall size of the chart */
  height: 300px; /* Adjust this value to change the overall size of the chart */
}
</style>