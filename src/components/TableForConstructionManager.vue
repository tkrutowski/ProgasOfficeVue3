<script setup lang="ts">
import {PropType, ref, watch} from "vue";
import {GasconnectionQuery} from "@/types/GasconnectionQuery.ts";
import {UtilsService} from "@/service/UtilsService.ts";

const props = defineProps({
  gasConnectionList: {
    type: Array as PropType<GasconnectionQuery[]>,
    required: true,
    default: []
  },
})

const list = ref<GasconnectionQuery[]>(props.gasConnectionList)
watch(
    () => props,
    () => {
      list.value = props.gasConnectionList
    },
    {deep: true}
)

</script>

<template>
  <Card class="card-border">
    <template #title>
      <span class="card-header">Lista przyłączy gotowych do wybudowania.</span>
    </template>
    <template #content>
      <DataTable :value="list" tableStyle="min-width: 50rem" removableSort showGridlines>
        <template #empty> Nie znaleziono przyłączy.</template>
        <template #loading> Ładowanie danych. Proszę czekać...</template>

        <Column field="commune" header="Gmina">
          <template #body="{ data, field }">
            <span class="flex justify-content-center"> {{ data[field] }} </span>
          </template>
        </Column>
        <Column field="city" header="Miasto" sortable>
          <template #body="{ data, field }">
            <span class="flex justify-content-center"> {{ data[field] }} </span>
          </template>
        </Column>
        <Column field="street" header="Ulica, działka" sortable>
          <template #body="{ data, field }">
            <span class="flex justify-content-center"> {{ data[field] }} </span>
          </template>
        </Column>
        <Column field="sapUpNo" header="SAP/UP" sortable>
          <template #body="{ data, field }">
            <span class="flex justify-content-center"> {{ data[field] }} </span>
          </template>
        </Column>
        <Column field="substationName" header="Rozdzielnia" sortable>
          <template #body="{ data, field }">
            <span class="flex justify-content-center"> {{ data[field] }} </span>
          </template>
        </Column>
        <Column field="agreementReceiptDate" header="Uzg. WSG " sortable>
          <template #body="{ data, field }">
            <div>
              <span class="flex justify-content-center">&nbsp{{ UtilsService.formatDate(data[field]) }}</span>
            </div>
          </template>
        </Column>
        <Column field="finishDeadline" header="Termin wykonania" sortable>
          <template #body="{ data, field }">
            <div>
              <span class="flex justify-content-center">&nbsp{{ UtilsService.formatDate(data[field]) }}</span>
            </div>
          </template>
        </Column>
        <Column field="taskCalendarDate" header="Kalendarz" sortable>
          <template #body="{ data, field }">
            <div>
              <span class="flex justify-content-center">&nbsp{{ UtilsService.formatDate(data[field]) }}</span>
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<style scoped>
.card-header {
  font-size: 1.3rem;
  font-weight: bold;
}

.card-border {
  border-radius: 8px;
  border: 1px solid rgba(255, 245, 0, 1)
}
</style>