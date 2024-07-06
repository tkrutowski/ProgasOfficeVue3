<script setup lang="ts">
import {useSettingStore} from "@/stores/setting.ts";
import {useAuthorizationStore} from "@/stores/authorization.ts";
import OfficeButton from "@/components/OfficeButton.vue";
import {computed, onMounted, ref, watch} from "vue";
import {ColumnView, GasConnectionSettings} from "@/types/Settings.ts";
import {TaskStatus} from "@/types/TaskStatus.ts";
import {DisplayByOwnershipEnum} from "@/types/Enums.ts";
import {UtilsService} from "@/service/UtilsService.ts";
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const settingStore = useSettingStore();
const authorizationStore = useAuthorizationStore();
type SortDirection = {
  name: string;
  code: boolean;
}

const emit = defineEmits<{
  (e: "save", settings: GasConnectionSettings): void;
  (e: "cancel"): void;
}>();
onMounted(() => {
  console.log('MOUNTED: GasConnectionSettingsDialog')
  if (settingStore.settings.userId === 0) settingStore.getSettingsFromDb();
  getSettings()
});
watch(
    () => settingStore.settings,
    () => {
      console.log('WATCH: GasConnectionSettingsDialog')
      getSettings()
    },
    {deep: true}
)
const getSettings = () => {
  columns.value = [[...settingStore.getGasConnectionInvisibleColumns], [...settingStore.getGasConnectionVisibleColumns]];
  sortColumns.value = [...settingStore.getGasConnectionVisibleColumns];
  selectedSortColumn.value = settingStore.getGasConnectionVisibleColumns.find(column => column.field === settingStore.settings.gasConnectionSettings.sortColumn);
  setSortDirection(settingStore.settings.gasConnectionSettings.sortDirection);
  selectedPaginator.value=settingStore.settings.gasConnectionSettings.rowsNumber;
  selectedLockedColumns.value = [...settingStore.getGasConnectionLockedColumns];
  colorBefore.value = parseColor(settingStore.settings.gasConnectionSettings.colorBeforeDeadline);
  transparencyBefore.value = colorBefore.value ? colorBefore.value.a * 100 : 1;
  colorOverdue.value = parseColor(settingStore.settings.gasConnectionSettings.colorOverdue);
  transparencyOverdue.value = colorOverdue.value ? colorOverdue.value.a * 100 : 1;
  colorCompleted.value = parseColor(settingStore.settings.gasConnectionSettings.colorCompleted);
  transparencyCompleted.value = colorCompleted.value ? colorCompleted.value.a * 100 : 1;
  colorSubmission.value = parseColor(settingStore.settings.gasConnectionSettings.colorSubmission);
  transparencySubmission.value = colorSubmission.value ? colorSubmission.value.a * 100 : 1;
  colorReceipt.value = parseColor(settingStore.settings.gasConnectionSettings.colorReceipt);
  transparencyReceipt.value = colorReceipt.value ? colorReceipt.value.a * 100 : 1;
  colorFvReady.value = parseColor(settingStore.settings.gasConnectionSettings.colorFvReady);
  transparencyFvReady.value = colorFvReady.value ? colorFvReady.value.a * 100 : 1;
  selectedOwnershipEnum.value = getOwnershipEnum(settingStore.settings.gasConnectionSettings.displayByOwnership);
  selectedStatus.value = UtilsService.getStatus(settingStore.settings.gasConnectionSettings.displayStatus)
  daysBeforeFinishDeadline.value = settingStore.settings.gasConnectionSettings.daysBeforeFinishDeadline;

  //design
  columnsDesign.value = [[...settingStore.getGasConnectionInvisibleColumnsDesign], [...settingStore.getGasConnectionVisibleColumnsDesign]];
  sortColumnsDesign.value = [...settingStore.getGasConnectionVisibleColumnsDesign];
  selectedSortColumnDesign.value = settingStore.getGasConnectionVisibleColumns.find(column => column.field === settingStore.settings.gasConnectionSettings.sortColumn);
  setSortDirectionDesign(settingStore.settings.gasConnectionSettings.sortDirectionDesign);
  selectedPaginatorDesign.value=settingStore.settings.gasConnectionSettings.rowsNumberDesign;
  selectedLockedColumnsDesign.value = [...settingStore.getGasConnectionLockedColumnsDesign];
  selectedOwnershipEnumDesign.value = getOwnershipEnum(settingStore.settings.gasConnectionSettings.displayByOwnershipDesign);
  selectedStatusDesign.value = UtilsService.getStatus(settingStore.settings.gasConnectionSettings.displayStatusDesign);
  daysBeforeProjectDeadline.value = settingStore.settings.gasConnectionSettings.daysBeforeProjectDeadline;
}

//columns
const columns = ref<ColumnView[][]>([[]]);

function moveToVisible(event: any) {
  console.log('COLUMNS', columns)
  event.items.forEach((item: ColumnView) => {
    item.visible = true
    sortColumns.value.push({...item})
  })

}

function moveToInvisible(event: any) {
  event.items.forEach((item: ColumnView) => {
    item.visible = false
    const index = sortColumns.value.findIndex(col => col.field === item.field);
    if (index !== -1) {
      sortColumns.value.splice(index, 1);
    }
    //remove from LockedColumns
    if (selectedLockedColumns.value) {
      const indexLock = selectedLockedColumns.value.findIndex(col => col.field === item.field);
      if (indexLock !== -1) {
        selectedLockedColumns.value.splice(indexLock, 1);
      }
    }
  })
}

function sortVisibleColumnsByIndex() {
  columns.value[1].forEach((col, index) => {
    col.sortIndex = index;
  });
}

//sort
const selectedSortColumn = ref<ColumnView>();
const selectedSortDirection = ref<SortDirection>({name: 'rosnąco', code: false});
const sortColumns = ref<ColumnView[]>(settingStore.getGasConnectionVisibleColumns);
const filteredColumns = ref<ColumnView[]>();
const searchColumn = (event: { query: string }) => {
  filteredColumns.value = sortColumns.value.filter((col) => {
    return col.header.toLowerCase().includes(event.query.toLowerCase());
  });
};
const sortDirections = ref<SortDirection[]>([
  {name: 'rosnąco', code: true},
  {name: 'malejąco', code: false},
]);

function setSortDirection(value: boolean) {
  if (value)
    selectedSortDirection.value = {name: 'rosnąco', code: true}
  else
    selectedSortDirection.value = {name: 'malejąco', code: false}
}

//locked columns
const selectedLockedColumns = ref<ColumnView[]>();

function updateLockedColumns(columns: ColumnView[]) {
  columns.forEach((column: ColumnView) => {
    column.frozen = !!selectedLockedColumns.value?.includes(column);
  })
}

//paginator
const selectedPaginator = ref<number>(10)
const paginatorList = ref<number[]>([10, 20, 30, 50, 75, 100])

//status
const selectedStatus = ref<TaskStatus>({name: "NOT_FINISHED", viewName: "Niezrealizowane"})
const statuses = ref<TaskStatus[]>([
  {name: 'ALL', viewName: "Wszystkie"},
  {name: 'FINISHED', viewName: "Zrealizowane"},
  {name: 'NOT_FINISHED', viewName: "Niezrealizowane"},
  {name: 'OVER_DUE', viewName: "Przeterminowane"},
  {name: 'NOT_FINISHED_TECH', viewName: "Odbiór techniczny"},
  {name: 'NOT_FINISHED_END', viewName: "Odbiór końcowy"},
]);

//ownership
const selectedOwnershipEnum = ref<DisplayByOwnershipEnum>({name: "MINE", viewName: "Tylko moje"})
const ownershipOptions = ref<DisplayByOwnershipEnum[]>([
  {name: "MINE", viewName: "Tylko moje"},
  {name: "COMPANY", viewName: "Progas"},
  {name: "ALL", viewName: "Wszystkie"},
])
function getOwnershipEnum(name: string): DisplayByOwnershipEnum {
  switch (name) {
    case 'ALL':
      return {name: 'ALL', viewName: "Wszystkie"}
    case 'MINE':
      return {name: 'MINE', viewName: "Tylko moje"}
    case 'COMPANY':
      return {name: 'COMPANY', viewName: "Progas"}
    default:
      return {name: 'MINE', viewName: "Tylko moje"}
  }
}
//emit
const cancel = () => {
  emit("cancel");
};
const save = () => {
  sortVisibleColumnsByIndex()
  sortVisibleColumnsByIndexDesign()
  let settings: GasConnectionSettings = {
    sortColumn: selectedSortColumn.value?.field,
    sortDirection: selectedSortDirection.value.code,
    rowsNumber: selectedPaginator.value,
    displayStatus: selectedStatus.value.name,
    gasConnectionColumns: columns.value?.flat(),
    colorBeforeDeadline: getColorBefore.value,
    colorOverdue: getColorOverdue.value,
    colorCompleted: getColorCompleted.value,
    colorSubmission: getColorSubmission.value,
    colorReceipt: getColorReceipt.value,
    colorFvReady: getColorFvReady.value,
    displayByOwnership: selectedOwnershipEnum.value.name,
    daysBeforeFinishDeadline: daysBeforeFinishDeadline.value,
    daysBeforeProjectDeadline: daysBeforeProjectDeadline.value,
    gasConnectionColumnsDesign: columnsDesign.value?.flat(),
    displayByOwnershipDesign: selectedOwnershipEnumDesign.value.viewName,
    displayStatusDesign: selectedStatusDesign.value.name,
    rowsNumberDesign: selectedPaginatorDesign.value,
    sortColumnDesign: selectedSortColumnDesign.value?.field,
    sortDirectionDesign: selectedSortDirectionDesign.value.code,
  }
  updateLockedColumns(settings.gasConnectionColumns)
  updateLockedColumnsDesign(settings.gasConnectionColumnsDesign)
  emit("save", settings);
};

//color
interface colorRgba {
  r: number,
  g: number,
  b: number,
  a: number
}
const daysBeforeFinishDeadline = ref<number>(45)
const transparencyBefore = ref<number>(1)
const colorBefore = ref<colorRgba | null>(null);
const getColorBefore = computed(() => {
  return `rgba(${colorBefore.value?.r}, ${colorBefore.value?.g}, ${colorBefore.value?.b}, ${transparencyBefore.value / 100})`;
})
const transparencyOverdue = ref<number>(1)
const colorOverdue = ref<colorRgba | null>();
const getColorOverdue = computed(() => {
  return `rgba(${colorOverdue.value?.r}, ${colorOverdue.value?.g}, ${colorOverdue.value?.b}, ${transparencyOverdue.value / 100})`;
})
const transparencyCompleted = ref<number>(1)
const colorCompleted = ref<colorRgba | null>();
const getColorCompleted = computed(() => {
  return `rgba(${colorCompleted.value?.r}, ${colorCompleted.value?.g}, ${colorCompleted.value?.b}, ${transparencyCompleted.value / 100})`;
})
const transparencySubmission = ref<number>(1)
const colorSubmission = ref<colorRgba | null>();
const getColorSubmission = computed(() => {
  return `rgba(${colorSubmission.value?.r}, ${colorSubmission.value?.g}, ${colorSubmission.value?.b}, ${transparencySubmission.value / 100})`;
})
const transparencyReceipt = ref<number>(1)
const colorReceipt = ref<colorRgba | null>();
const getColorReceipt = computed(() => {
  return `rgba(${colorReceipt.value?.r}, ${colorReceipt.value?.g}, ${colorReceipt.value?.b}, ${transparencyReceipt.value / 100})`;
})
const transparencyFvReady = ref<number>(1)
const colorFvReady = ref<colorRgba | null>();
const getColorFvReady = computed(() => {
  return `rgba(${colorFvReady.value?.r}, ${colorFvReady.value?.g}, ${colorFvReady.value?.b}, ${transparencyFvReady.value / 100})`;
})

function parseColor(rgbaString: string): colorRgba | null {
  const regex = /rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+\.?\d*)\)/;
  let matches;
  if (rgbaString)
    matches = rgbaString.match(regex);

  if (matches) {
    const r = parseInt(matches[1], 10);
    const g = parseInt(matches[2], 10);
    const b = parseInt(matches[3], 10);
    const a = parseFloat(parseFloat(matches[4]).toFixed(2));

    return {r, g, b, a};
  } else {
    return null;
  }
}


//
//------------------------------------------BUILD------------------------------------------------------
//

//columns
const columnsDesign = ref<ColumnView[][]>([[]]);

function moveToVisibleDesign(event: any) {
  event.items.forEach((item: ColumnView) => {
    item.visible = true
    sortColumnsDesign.value.push({...item})
  })

}

function moveToInvisibleDesign(event: any) {
  event.items.forEach((item: ColumnView) => {
    item.visible = false
    const index = sortColumnsDesign.value.findIndex(col => col.field === item.field);
    if (index !== -1) {
      sortColumnsDesign.value.splice(index, 1);
    }
    //remove from LockedColumns
    if (selectedLockedColumnsDesign.value) {
      const indexLock = selectedLockedColumnsDesign.value.findIndex(col => col.field === item.field);
      if (indexLock !== -1) {
        selectedLockedColumnsDesign.value.splice(indexLock, 1);
      }
    }
  })
}

function sortVisibleColumnsByIndexDesign() {
  columnsDesign.value[1].forEach((col, index) => {
    col.sortIndex = index;
  });
}

//sort
const selectedSortColumnDesign = ref<ColumnView>();
const selectedSortDirectionDesign = ref<SortDirection>({name: 'rosnąco', code: false});
const sortColumnsDesign = ref<ColumnView[]>(settingStore.getGasConnectionVisibleColumnsDesign);
const filteredColumnsDesign = ref<ColumnView[]>();
const searchColumnDesign = (event: { query: string }) => {
  filteredColumnsDesign.value = sortColumnsDesign.value.filter((col) => {
    return col.header.toLowerCase().includes(event.query.toLowerCase());
  });
};

function setSortDirectionDesign(value: boolean) {
  if (value)
    selectedSortDirectionDesign.value = {name: 'rosnąco', code: true}
  else
    selectedSortDirectionDesign.value = {name: 'malejąco', code: false}
}

//locked columns
const selectedLockedColumnsDesign = ref<ColumnView[]>();

function updateLockedColumnsDesign(columns: ColumnView[]) {
  columns.forEach((column: ColumnView) => {
    column.frozen = !!selectedLockedColumnsDesign.value?.includes(column);
  })
}

//paginator
const selectedPaginatorDesign = ref<number>(10)
// const paginatorListDesign = ref<number[]>([10, 20, 30, 50, 75, 100])

//status
const selectedStatusDesign = ref<TaskStatus>({name: "NOT_FINISHED", viewName: "Niezrealizowane"})
const statusesDesign = ref<TaskStatus[]>([
  {name: 'ALL', viewName: "Wszystkie"},
  {name: 'NOT_FINISHED', viewName: "Niezrealizowane"},
]);

//ownership
const selectedOwnershipEnumDesign = ref<DisplayByOwnershipEnum>({name: "MINE", viewName: "Tylko moje"})
const daysBeforeProjectDeadline = ref<number>(40)

</script>

<template>
  <Dialog modal class="p-fluid w-11" close-on-escape @abort="cancel">
    <template #header>
      <h2 class="color-yellow ml-5">
        Ustawienia przyłącza
      </h2>
    </template>
    <div class="card">
      <Tabs value="0">
        <TabList>
          <Tab value="0" v-if="authorizationStore.isEmployee">Budowanie</Tab>
          <Tab value="1" v-if="authorizationStore.isDesigner">Projektowanie</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0" >
            <Panel header="Wybierz kolumny widoczne w tabeli">
              <div class="card">
                <PickList v-model="columns" listStyle="height:342px" dataKey="field" breakpoint="1400px"
                          @moveToTarget="moveToVisible"
                          @move-to-source="moveToInvisible"
                          @move-all-to-source="moveToInvisible"
                          @move-all-to-target="moveToVisible"
                          :show-source-controls=false
                >
                  <template #sourceheader> Dostępne</template>
                  <template #targetheader> Wybrane</template>
                  <template #item="slotProps">
                    <span class="">{{ slotProps.item.header }}</span>
                  </template>
                </PickList>
              </div>
            </Panel>

              <!--SORT  DISPLAY-->
            <div class="flex flex-row  gap-3">
              <!--SORT-->
              <Panel header="Wybierz sposób sortowania" class="mt-5">
                <div class="flex flex-row  gap-3 p-fluid">
                  <div>
                    <label class="" for="sort-column">Wybierz kolumnę:</label>
                    <AutoComplete id="sort-column" v-model="selectedSortColumn" :suggestions="filteredColumns"
                                  @complete="searchColumn" dropdown optionLabel="header" class="w-full md:w-13rem"/>
                  </div>
                  <div>
                    <label class="" for="sort-order">Wybierz kierunek:</label>
                    <Dropdown id="sort-order" v-model="selectedSortDirection" :options="sortDirections" optionLabel="name"
                              class="w-full md:w-13rem"/>
                  </div>
                  <div>
                    <label class="" for="locked">Wybierz zablokowane kolumny:</label>
                    <MultiSelect id="locked" v-model="selectedLockedColumns" :options="sortColumns" optionLabel="header"
                                 placeholder="Wybierz..."
                                 :maxSelectedLabels="3"
                                 class="w-full md:w-16rem"/>
                  </div>
                </div>
              </Panel>

              <!--          DISPLAY            -->
              <Panel header="Wybierz sposób wyświetlania" class="mt-5 ">
                <div class="flex flex-row  gap-3 p-fluid">
                  <div>
                    <label class="" for="display-status">Status:</label>
                    <Dropdown id="display-status" v-model="selectedStatus" :options="statuses" optionLabel="viewName"
                              class="w-full md:w-12rem"/>
                  </div>
                  <div>
                    <label class="" for="display-rows">Ilość wierszy:</label>
                    <Dropdown id="display-rows" v-model="selectedPaginator" :options="paginatorList"
                              class="w-full md:w-9rem"/>
                  </div>
                  <div>
                    <label class="" for="display-designers">Własność:</label>
                    <Dropdown id="display-ownership" v-model="selectedOwnershipEnum" :options="ownershipOptions"
                              option-label="viewName"
                              class="w-full md:w-9rem"/>
                  </div>
                </div>
              </Panel>
            </div>

              <!--COLOR-->
            <div class="flex">

              <Panel header="Wybierz kolory" class="mt-5 w-full">
                <div class="flex flex-row gap-3 p-fluid">
                  <!-- DEADLINE -->
                  <div class="w-full">
                    <label class="" for="colorBefore">Dni do terminu (wiersz):</label>
                    <div class="flex flex-row align-items-center">
                      <ColorPicker id="colorBefore" v-model="colorBefore" format="rgb"/>
                      <Slider v-model="transparencyBefore" class="w-full mt-1  ml-3"/>
                    </div>
                    <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                         :style="{backgroundColor:getColorBefore}">
                      <span>Przykładowy tekst</span>
                    </div>
                    <InputNumber class="w-full mt-2" v-model="daysBeforeFinishDeadline" inputId="daysBefore" mode="decimal" showButtons
                                 :min="0" :max="100"/>

                  </div>

                  <!-- OVERDUE -->
                  <div class="w-full">
                    <label class="" for="colorOverdue">Przeterminowane (wiersz):</label>
                    <div class="flex flex-row align-items-center">
                      <ColorPicker id="colorOverdue" v-model="colorOverdue" format="rgb"/>
                      <Slider v-model="transparencyOverdue" class="w-full  mt-1  ml-3"/>
                    </div>
                    <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                         :style="{backgroundColor:getColorOverdue}">
                      <span>Przykładowy tekst</span>
                    </div>

                  </div>

                  <!-- COMPLETED -->
                  <div class="w-full">
                    <label class="" for="colorCompleted">Zakończone (wiersz):</label>
                    <div class="flex flex-row align-items-center">
                      <ColorPicker id="colorCompleted" v-model="colorCompleted" format="rgb" />
                      <Slider v-model="transparencyCompleted" class="w-full mt-1  ml-3"/>
                    </div>
                    <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                         :style="{backgroundColor:getColorCompleted}">
                      <span>Przykładowy tekst</span>
                    </div>

                  </div>

                  <!-- SUBMISSION -->
                  <div class="w-full">
                    <label class="" for="colorSubmission">Złożenie:</label>
                    <div class="flex flex-row align-items-center">
                      <ColorPicker id="colorSubmission" v-model="colorSubmission" format="rgb"/>
                      <Slider v-model="transparencySubmission" class="w-full mt-1  ml-3"/>
                    </div>
                    <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                         :style="{backgroundColor:getColorSubmission}">
                      <span>Przykładowy tekst</span>
                    </div>
                  </div>

                  <!-- RECEIPT  -->
                  <div class="w-full">
                    <label class="" for="colorReceipt">Otrzymanie i inne:</label>
                    <div class="flex flex-row align-items-center">
                      <ColorPicker id="colorReceipt" v-model="colorReceipt" format="rgb"/>
                      <Slider v-model="transparencyReceipt" class="w-full  mt-1  ml-3"/>
                    </div>
                    <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                         :style="{backgroundColor:getColorReceipt}">
                      <span>Przykładowy tekst</span>
                    </div>
                  </div>

                  <!-- FV_READY  -->
                  <div class="w-full">
                    <label class="" for="colorFvReady">Gotowe do faktury:</label>
                    <div class="flex flex-row align-items-center">
                      <ColorPicker id="colorFvReady" v-model="colorFvReady" format="rgb"/>
                      <Slider v-model="transparencyFvReady" class="w-full  mt-1  ml-3"/>
                    </div>
                    <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                         :style="{backgroundColor:getColorFvReady}">
                      <span>Przykładowy tekst</span>
                    </div>
                  </div>
                </div>
              </Panel>
            </div>

          </TabPanel>
          <TabPanel value="1">
            <Panel header="Wybierz kolumny widoczne w tabeli">
              <div class="card">
                <PickList v-model="columnsDesign" listStyle="height:342px" dataKey="field" breakpoint="1400px"
                          @moveToTarget="moveToVisibleDesign"
                          @move-to-source="moveToInvisibleDesign"
                          @move-all-to-source="moveToInvisibleDesign"
                          @move-all-to-target="moveToVisibleDesign"
                          :show-source-controls=false
                >
                  <template #sourceheader> Dostępne</template>
                  <template #targetheader> Wybrane</template>
                  <template #item="slotProps">
                    <span class="">{{ slotProps.item.header }}</span>
                  </template>
                </PickList>
              </div>
            </Panel>

            <!--SORT  DISPLAY-->
            <div class="flex flex-row  gap-3">
              <!--SORT-->
              <Panel header="Wybierz sposób sortowania" class="mt-5">
                <div class="flex flex-row  gap-3 p-fluid">
                  <div>
                    <label class="" for="sort-column">Wybierz kolumnę:</label>
                    <AutoComplete id="sort-column" v-model="selectedSortColumnDesign" :suggestions="filteredColumnsDesign"
                                  @complete="searchColumnDesign" dropdown optionLabel="header" class="w-full md:w-13rem"/>
                  </div>
                  <div>
                    <label class="" for="sort-order">Wybierz kierunek:</label>
                    <Dropdown id="sort-order" v-model="selectedSortDirectionDesign" :options="sortDirections" optionLabel="name"
                              class="w-full md:w-13rem"/>
                  </div>
                  <div>
                    <label class="" for="locked">Wybierz zablokowane kolumny:</label>
                    <MultiSelect id="locked" v-model="selectedLockedColumnsDesign" :options="sortColumnsDesign" optionLabel="header"
                                 placeholder="Wybierz..."
                                 :maxSelectedLabels="3"
                                 class="w-full md:w-16rem"/>
                  </div>
                </div>
              </Panel>

              <!--          DISPLAY            -->
              <Panel header="Wybierz sposób wyświetlania" class="mt-5 ">
                <div class="flex flex-row  gap-3 p-fluid">
                  <div>
                    <label class="" for="display-status">Status:</label>
                    <Dropdown id="display-status" v-model="selectedStatusDesign" :options="statusesDesign" optionLabel="viewName"
                              class="w-full md:w-12rem"/>
                  </div>
                  <div>
                    <label class="" for="display-rows">Ilość wierszy:</label>
                    <Dropdown id="display-rows" v-model="selectedPaginatorDesign" :options="paginatorList"
                              class="w-full md:w-9rem"/>
                  </div>
                  <div>
                    <label class="" for="display-designers">Własność:</label>
                    <Dropdown id="display-ownership" v-model="selectedOwnershipEnumDesign" :options="ownershipOptions"
                              option-label="viewName"
                              class="w-full md:w-9rem"/>
                  </div>
                </div>
              </Panel>
            </div>

            <!--COLOR-->
            <div class="flex">

              <Panel :header=' authorizationStore.isEmployee ? "Wybierz kolory - W ZAKŁADCE BUDOWANIE!" : "Wybierz kolory"' class="mt-5 w-full" >
                <div class="flex flex-row gap-3 p-fluid">
                  <!-- DEADLINE -->
                  <div class="w-full">
                    <label class="" for="colorBefore">Dni do terminu (wiersz):</label>
                    <div class="flex flex-row align-items-center">
                      <ColorPicker id="colorBefore" v-model="colorBefore" format="rgb" :disabled="authorizationStore.isEmployee"/>
                      <Slider v-model="transparencyBefore" class="w-full mt-1  ml-3" :disabled="authorizationStore.isEmployee"/>
                    </div>
                    <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                         :style="{backgroundColor:getColorBefore}">
                      <span>Przykładowy tekst</span>
                    </div>
                    <InputNumber class="w-full mt-2" v-model="daysBeforeProjectDeadline" inputId="daysBefore" mode="decimal" showButtons
                                 :min="0" :max="100"/>

                  </div>

                  <!-- OVERDUE -->
                  <div class="w-full">
                    <label class="" for="colorOverdue">Przeterminowane (wiersz):</label>
                    <div class="flex flex-row align-items-center">
                      <ColorPicker id="colorOverdue" v-model="colorOverdue" format="rgb" :disabled="authorizationStore.isEmployee"/>
                      <Slider v-model="transparencyOverdue" class="w-full  mt-1  ml-3" :disabled="authorizationStore.isEmployee"/>
                    </div>
                    <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                         :style="{backgroundColor:getColorOverdue}">
                      <span>Przykładowy tekst</span>
                    </div>

                  </div>

                  <!-- COMPLETED -->
                  <div class="w-full">
                    <label class="" for="colorCompleted">Zakończone (wiersz):</label>
                    <div class="flex flex-row align-items-center">
                      <ColorPicker id="colorCompleted" v-model="colorCompleted" format="rgb" :disabled="authorizationStore.isEmployee"/>
                      <Slider v-model="transparencyCompleted" class="w-full mt-1  ml-3" :disabled="authorizationStore.isEmployee"/>
                    </div>
                    <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                         :style="{backgroundColor:getColorCompleted}">
                      <span>Przykładowy tekst</span>
                    </div>

                  </div>

                  <!-- SUBMISSION -->
                  <div class="w-full">
                    <label class="" for="colorSubmission">Złożenie:</label>
                    <div class="flex flex-row align-items-center">
                      <ColorPicker id="colorSubmission" v-model="colorSubmission" format="rgb" :disabled="authorizationStore.isEmployee"/>
                      <Slider v-model="transparencySubmission" class="w-full mt-1  ml-3" :disabled="authorizationStore.isEmployee"/>
                    </div>
                    <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                         :style="{backgroundColor:getColorSubmission}">
                      <span>Przykładowy tekst</span>
                    </div>
                  </div>

                  <!-- RECEIPT  -->
                  <div class="w-full">
                    <label class="" for="colorReceipt">Otrzymanie i inne:</label>
                    <div class="flex flex-row align-items-center">
                      <ColorPicker id="colorReceipt" v-model="colorReceipt" format="rgb" :disabled="authorizationStore.isEmployee"/>
                      <Slider v-model="transparencyReceipt" class="w-full  mt-1  ml-3" :disabled="authorizationStore.isEmployee"/>
                    </div>
                    <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                         :style="{backgroundColor:getColorReceipt}">
                      <span>Przykładowy tekst</span>
                    </div>
                  </div>
                </div>
              </Panel>
            </div>

          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>


    <template #footer>
      <div class="flex flex-row justify-content-end gap-2">
        <OfficeButton text="Anuluj" btn-type="office" @click="cancel"/>
        <OfficeButton text="Zapisz" btn-type="office-save" @click="save" :loading="settingStore.savingSettings" :btn-disabled="settingStore.savingSettings"/>
      </div>
    </template>
  </Dialog>
</template>
<style scoped>
</style>
