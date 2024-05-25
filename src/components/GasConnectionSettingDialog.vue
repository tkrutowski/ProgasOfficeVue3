<script setup lang="ts">
import {useSettingStore} from "@/stores/setting.ts";
import OfficeButton from "@/components/OfficeButton.vue";
import {computed, onMounted, ref, watch} from "vue";
import {ColumnView, GasConnectionSettings} from "@/types/Settings.ts";
import {TaskStatus} from "@/types/TaskStatus.ts";
import {DisplayByDesignersEnum} from "@/types/Enums.ts";
import {UtilsService} from "@/service/UtilsService.ts";

const settingStore = useSettingStore();
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
  daysBefore.value = settingStore.settings.gasConnectionSettings.daysBefore;
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
  selectedDesignerEnum.value = getDesignerEnum(settingStore.settings.gasConnectionSettings.displayByDesigner);
  selectedStatus.value = UtilsService.getStatus(settingStore.settings.gasConnectionSettings.displayStatus)
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

//designer
const selectedDesignerEnum = ref<DisplayByDesignersEnum>({name: "MINE", viewName: "Tylko moje"})
const designerOptions = ref<DisplayByDesignersEnum[]>([
  {name: "MINE", viewName: "Tylko moje"},
  {name: "COMPANY", viewName: "Progas"},
  {name: "ALL", viewName: "Wszystkie"},
])
function getDesignerEnum(name: string): DisplayByDesignersEnum {
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
    daysBefore: daysBefore.value,
    displayByDesigner: selectedDesignerEnum.value.name,
    daysBeforeFinishDeadlineDashboard: daysBeforeFinishDeadlineDashboard.value,
    daysBeforeProjectDeadlineDashboard: daysBeforeProjectDeadlineDashboard.value
  }
  updateLockedColumns(settings.gasConnectionColumns)
  emit("save", settings);
};

//color
interface colorRgba {
  r: number,
  g: number,
  b: number,
  a: number
}

const daysBefore = ref<number>(45)
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

//Dashboard
const daysBeforeProjectDeadlineDashboard = ref<number>(45)
const daysBeforeFinishDeadlineDashboard = ref<number>(45)
</script>

<template>
  <Dialog modal class="p-fluid w-11" close-on-escape @abort="cancel">
    <template #header>
      <h2 class="color-yellow ml-5">
        Ustawienia przyłącza
      </h2>
    </template>
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

    <div class="flex">

      <!--SORT-->
      <Panel header="Wybierz sposób sortowania" class="mt-5 col-7">
        <div class="flex flex-row  gap-3 p-fluid">
          <div>
            <label class="" for="sort-column">Wybierz kolumnę:</label>
            <AutoComplete id="sort-column" v-model="selectedSortColumn" :suggestions="filteredColumns"
                          @complete="searchColumn" dropdown optionLabel="header" class="w-full md:w-14rem"/>
          </div>
          <div>
            <label class="" for="sort-order">Wybierz kierunek:</label>
            <Dropdown id="sort-order" v-model="selectedSortDirection" :options="sortDirections" optionLabel="name"
                      class="w-full md:w-14rem"/>
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
      <Panel header="Wybierz sposób wyświetlania" class="mt-5 col-5">
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
            <label class="" for="display-designers">Projektant:</label>
            <Dropdown id="display-designers" v-model="selectedDesignerEnum" :options="designerOptions"
                      option-label="viewName"
                      class="w-full md:w-9rem"/>
          </div>
        </div>
      </Panel>
    </div>

    <div class="flex">

      <!--COLOR-->
      <Panel header="Wybierz kolory" class="mt-5">
        <div class="flex flex-row gap-3 p-fluid">
          <!-- DEADLINE -->
          <div class="w-full">
            <label class="" for="colorBefore">Dni do terminu (wiersz):</label>
            <ColorPicker id="colorBefore" v-model="colorBefore" format="rgb" class="w-full"/>
            <Slider v-model="transparencyBefore" class="w-full mt-3"/>
            <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                 :style="{backgroundColor:getColorBefore}">
              <span>Przykładowy tekst</span>
            </div>
            <InputNumber class="w-full mt-2" v-model="daysBefore" inputId="daysBefore" mode="decimal" showButtons
                         :min="0" :max="100"/>

          </div>

          <!-- OVERDUE -->
          <div class="w-full">
            <label class="" for="colorOverdue">Przeterminowane (wiersz):</label>
            <ColorPicker id="colorOverdue" v-model="colorOverdue" format="rgb" class="w-full"/>
            <!--            </div>-->
            <Slider v-model="transparencyOverdue" class="w-full mt-3"/>
            <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                 :style="{backgroundColor:getColorOverdue}">
              <span>Przykładowy tekst</span>
            </div>

          </div>

          <!-- COMPLETED -->
          <div class="w-full">
            <label class="" for="colorCompleted">Zakończone (wiersz):</label>
            <ColorPicker id="colorCompleted" v-model="colorCompleted" format="rgb" class="w-full"/>
            <Slider v-model="transparencyCompleted" class="w-full mt-3"/>
            <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                 :style="{backgroundColor:getColorCompleted}">
              <span>Przykładowy tekst</span>
            </div>

          </div>

          <!-- SUBMISSION -->
          <div class="w-full">
            <label class="" for="colorSubmission">Złożenie:</label>
            <ColorPicker id="colorSubmission" v-model="colorSubmission" format="rgb" class="w-full"/>
            <Slider v-model="transparencySubmission" class="w-full mt-3"/>
            <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                 :style="{backgroundColor:getColorSubmission}">
              <span>Przykładowy tekst</span>
            </div>
          </div>

          <!-- RECEIPT  -->
          <div class="w-full">
            <label class="" for="colorReceipt">Otrzymanie i inne:</label>
            <ColorPicker id="colorReceipt" v-model="colorReceipt" format="rgb" class="w-full"/>
            <Slider v-model="transparencyReceipt" class="w-full mt-3"/>
            <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                 :style="{backgroundColor:getColorReceipt}">
              <span>Przykładowy tekst</span>
            </div>
          </div>

          <!-- FV_READY  -->
          <div class="w-full">
            <label class="" for="colorFvReady">Gotowe do faktury:</label>
            <ColorPicker id="colorFvReady" v-model="colorFvReady" format="rgb" class="w-full"/>
            <Slider v-model="transparencyFvReady" class="w-full mt-3"/>
            <div class="border-round mt-3 pt-3 pb-3 flex align-items-center justify-content-center w-fill"
                 :style="{backgroundColor:getColorFvReady}">
              <span>Przykładowy tekst</span>
            </div>
          </div>
        </div>
      </Panel>
    </div>

    <!--          DASHBOARDY            -->
    <Panel header="Dashboard" class="mt-5 col-5">
      <div class="flex flex-row  gap-3 p-fluid">
        <div>
          <label class="" for="display-status">Dni do terminu projektu:</label>
          <InputNumber class="w-full mt-2" v-model="daysBeforeProjectDeadlineDashboard" inputId="daysBefore" mode="decimal" showButtons
                       :min="0" :max="100"/>
        </div>
        <div>
          <label class="" for="display-rows">Dni do terminu wykonania:</label>
          <InputNumber class="w-full mt-2" v-model="daysBeforeFinishDeadlineDashboard" inputId="daysBefore" mode="decimal" showButtons
                       :min="0" :max="100"/>
        </div>
      </div>
    </Panel>

    <template #footer>
      <div class="flex flex-row justify-content-end gap-2">
        <OfficeButton text="Anuluj" btn-type="office" @click="cancel"/>
        <OfficeButton text="Zapisz" btn-type="office-save" @click="save" :loading="settingStore.savingSettings" :btn-disabled="settingStore.savingSettings"/>
      </div>
    </template>
  </Dialog>
</template>
