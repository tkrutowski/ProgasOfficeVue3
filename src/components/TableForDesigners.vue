<script setup lang="ts">
import {PropType, ref, watch} from "vue";
import {GasconnectionQuery} from "@/types/GasconnectionQuery.ts";
import {UtilsService} from "@/service/UtilsService.ts";

const props = defineProps({
  gasConnectionList: {
    type: Array as  PropType<GasconnectionQuery[]>,
    required: true,
    default: []
  },
  daysBefore:{
    type: Number,
    required: true,
    default: ""
  }
})

const list =ref<GasconnectionQuery[]>(props.gasConnectionList)
watch(
    () => props,
    () => {
      list.value = props.gasConnectionList
    },
    {deep: true}
)

</script>

<template>
  <Card class="card-border  ">
    <template #title>
      <span class="card-header">Lista Twoich przyłączy przeterminowanych lub ze zbliżającym się terminem projektu (mniej niż {{props.daysBefore}} dni).</span>
    </template>
    <template #content>
    <DataTable :value="list" tableStyle="min-width: 50rem" removableSort showGridlines scrollable scrollHeight="400px">
      <template #empty> Nie znaleziono przyłączy.</template>
      <template #loading> Ładowanie danych. Proszę czekać...</template>

      <Column field="commune" header="Gmina">
        <template #body="{ data, field }">
          <span class="flex justify-center"> {{ data[field] }} </span>
        </template>
      </Column>
      <Column field="city" header="Miasto" sortable >
        <template #body="{ data, field }">
          <span class="flex justify-center"> {{ data[field] }} </span>
        </template>
      </Column>
      <Column field="street" header="Ulica, działka" sortable >
        <template #body="{ data, field }">
          <span class="flex justify-center"> {{ data[field] }} </span>
        </template>
      </Column>
      <Column field="sapUpNo" header="SAP/UP" sortable >
        <template #body="{ data, field }">
          <span class="flex justify-center"> {{ data[field] }} </span>
        </template>
      </Column>
      <Column field="projectDeadline" header="Termin projektu" sortable >
        <template #body="{ data, field }">
          <div>
            <span class="flex justify-center">&nbsp{{  UtilsService.formatDate(data[field]) }}</span>
          </div>
        </template>
      </Column>
      <Column field="stage" header="Etap" sortable >
        <template #body="{ data, field }">
          <Tag class="flex justify-center w-full" :value="UtilsService.getStageAsString(data[field])" :style="UtilsService.getStyleByStage(data[field])"/>
        </template>
      </Column>
    </DataTable>
    </template>
  </Card>
</template>

<style scoped>
.p-tag {
  background: transparent;
  color: rgba(255, 255, 255, 0.87);
  font-size: 1rem;
  font-weight: normal;
  padding: .2rem 0.2rem;
  border-radius: 3px;
}
.card-header{
  font-size: 1.3rem;
  font-weight: bold;
}
.card-border {
  border-radius: 8px;
  border: 1px solid rgba(255, 245, 0, 1)
}
</style>