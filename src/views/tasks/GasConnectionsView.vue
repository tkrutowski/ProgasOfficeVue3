<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {FilterMatchMode, FilterOperator} from 'primevue/api';
import {useGasConnectionQueryStore} from "@/stores/gasconnectionQuery.ts";
import {useSettingStore} from "@/stores/setting.ts";
import {useAuthorizationStore} from "@/stores/authorization.ts";
import {useDesignerStore} from "@/stores/designers.ts";
import TheMenuTasks from "@/components/TheMenuTasks.vue";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import {UtilsService} from "@/service/UtilsService.ts";
import {GasconnectionQuery} from "@/types/GasconnectionQuery.ts";
import {useToast} from "primevue/usetoast";
import {ColumnView, GasConnectionSettings} from "@/types/Settings.ts";
import GasConnectionSettingDialog from "@/components/GasConnectionSettingDialog.vue";
import {TaskStatus} from "@/types/TaskStatus.ts";
import moment from "moment/moment";

const toast = useToast();
const gasConnectionQueryStore = useGasConnectionQueryStore();
const settingStore = useSettingStore();
const authenticationStore = useAuthorizationStore();
const designerStore = useDesignerStore();
const filters = ref();
const stages = ref([
  {value: 0, label: 'ETAP 1'},
  {value: 1, label: 'ETAP 1'},
  {value: 2, label: 'ETAP 2'},
  {value: 3, label: 'ETAP 2'},
  {value: 4, label: 'ETAP 3'},
  {value: 5, label: 'ETAP 3'},
  {value: 6, label: 'ETAP 4'},
  {value: 7, label: 'ETAP 4'},
  {value: -1, label: null}
]);


//filter
const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},

    commune: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
    city: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
    taskNo: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
    contractNo: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
    customerPhone: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
    substationName: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]
    },

    stringContains: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
    conditionNo: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
    gasInternalNo: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
    connectionAgreementNumber: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]
    },
    sapUpNo: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
    scopeConnection: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
    scopeStation: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]},
    scopeGasConnection: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.CONTAINS}]
    },

    finishDeadline: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},
    contractDate: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},
    projectDeadline: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},
    mapSubmissionDate: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},
    mapReceiptDate: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},
    extractSubmissionDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    extractReceiptDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    zupdSubmissionDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    zudpReceiptDate: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},
    utilityCompanySubmissionDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    utilityCompanyReceiptDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    agreementSubmissionDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    agreementReceiptDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    substationNotificationSubmissionDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    realizationStartDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    realizationEndDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    surveyingSketchesDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    surveyingInventoryDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    wsgTechnicalAcceptanceDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    projectOrderSubmissionDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    projectOrderConfirmationDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    proxySubmissionDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    proxyReceiptDate: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},
    zudpSentToSurveyorDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    trafficOrganizationProjectSubmissionDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    trafficOrganizationProjectReceiptDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    wsgFinalAcceptanceDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    cabinetProvidedByDate: {
      operator: FilterOperator.AND,
      constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]
    },
    taskCalendarDate: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},

    designerFullName: {value: null, matchMode: FilterMatchMode.IN},
    coordinatorFullName: {value: null, matchMode: FilterMatchMode.IN},
    customerFullName: {value: null, matchMode: FilterMatchMode.IN},
    stage: {value: null, matchMode: FilterMatchMode.IN},

    projectValue: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
    constructionValue: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
    taskValue: {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
  };
};
initFilters();
const clearFilter = () => {
  initFilters();
};


//fill table
const gasConnections = ref<GasconnectionQuery[]>([]);
const designers = ref<String[]>([]);
const coordinators = ref<String[]>([]);
const customers = ref<String[]>([]);
onMounted(() => {
  console.log("MOUNTED GasConnectionView")
  getVisibleColumns()
  updateDisplayByDesigners()
  updateDisplayByStatus()
  let displayStatus = settingStore.settings.gasConnectionSettings.displayStatus;
  loadData(UtilsService.getStatus(displayStatus))
});
const dataLoading = ref<boolean>(false);
const dataTableRef = ref();

async function loadData(status: TaskStatus) {
  console.log("GasConnectionView - loadData")
  dataLoading.value = true;
  const data = await gasConnectionQueryStore.getGasConnectionList(status);

  if (data) {
    let filteredData:GasconnectionQuery[] = await filterByDesigners(data)
    gasConnections.value = mapdates(filteredData)
    designers.value = [...new Set(filteredData.map(item => item.designerFullName))].sort();
    coordinators.value = [...new Set(filteredData.map(item => item.coordinatorFullName))].sort();
    customers.value = [...new Set(filteredData.map(item => item.customerFullName))].sort();
  }
  dataLoading.value = false;
}

async function filterByDesigners(data: GasconnectionQuery[]) {
  console.log('filterByDesigners: ',selectedDisplayByDesigners.value.value)
  if(selectedDisplayByDesigners.value.value === "MINE") {
    const designerId:number = authenticationStore.getUserDesignerId
    return data.filter(value => value.idDesigner === designerId)
  }

  if(selectedDisplayByDesigners.value.value === "COMPANY") {
    let designerInCompany = await designerStore.getDesignerInCompany({name: "ALL", viewName: ""});
    let designerIds = designerInCompany.map(value => value.id);
    console.log("designerIds",designerIds)
    return data.filter(value => designerIds.includes(value.idDesigner))
  }
  return data;
}

const mapdates = (data: GasconnectionQuery[]) => {
  console.log("MapDates")
  return [...(data || [])].map((item) => {
    item.finishDeadline = changeDate(item.finishDeadline)
    item.contractDate = changeDate(item.contractDate)
    item.projectDeadline = changeDate(item.projectDeadline)
    item.mapSubmissionDate = changeDate(item.mapSubmissionDate)
    item.mapReceiptDate = changeDate(item.mapReceiptDate)
    item.extractSubmissionDate = changeDate(item.extractSubmissionDate)
    item.extractReceiptDate = changeDate(item.extractReceiptDate)
    item.zupdSubmissionDate = changeDate(item.zupdSubmissionDate)
    item.zudpReceiptDate = changeDate(item.zudpReceiptDate)
    item.utilityCompanySubmissionDate = changeDate(item.utilityCompanySubmissionDate)
    item.utilityCompanyReceiptDate = changeDate(item.utilityCompanyReceiptDate)
    item.agreementSubmissionDate = changeDate(item.agreementSubmissionDate)
    item.agreementReceiptDate = changeDate(item.agreementReceiptDate)
    item.substationNotificationSubmissionDate = changeDate(item.substationNotificationSubmissionDate)
    item.realizationStartDate = changeDate(item.realizationStartDate)
    item.realizationEndDate = changeDate(item.realizationEndDate)
    item.surveyingSketchesDate = changeDate(item.surveyingSketchesDate)
    item.surveyingInventoryDate = changeDate(item.surveyingInventoryDate)
    item.wsgTechnicalAcceptanceDate = changeDate(item.wsgTechnicalAcceptanceDate)
    item.projectOrderSubmissionDate = changeDate(item.projectOrderSubmissionDate)
    item.projectOrderConfirmationDate = changeDate(item.projectOrderConfirmationDate)
    item.proxySubmissionDate = changeDate(item.proxySubmissionDate)
    item.proxyReceiptDate = changeDate(item.proxyReceiptDate)
    item.zudpSentToSurveyorDate = changeDate(item.zudpSentToSurveyorDate)
    item.trafficOrganizationProjectSubmissionDate = changeDate(item.trafficOrganizationProjectSubmissionDate)
    item.trafficOrganizationProjectReceiptDate = changeDate(item.trafficOrganizationProjectReceiptDate)
    item.wsgFinalAcceptanceDate = changeDate(item.wsgFinalAcceptanceDate)
    item.cabinetProvidedByDate = changeDate(item.cabinetProvidedByDate)
    item.taskCalendarDate = changeDate(item.taskCalendarDate)

    return item;
  });
};
const changeDate = (value: string | Date) => {
  if (value && value !== "" && value !== "0001-01-01") {
    return new Date(value)
  }
  return "";
};

const columns = ref<ColumnView[]>([]);

function getVisibleColumns() {
  columns.value = settingStore.getGasConnectionVisibleColumns;
}

watch(
    () => settingStore.settings.gasConnectionSettings,
    () => {
      console.log('WATCH columns');
      getVisibleColumns();
      updateDisplayByStatus()
      updateDisplayByDesigners()
    },
    {deep: true}
);

function getSortOrder() {
  const order = settingStore.settings.gasConnectionSettings.sortDirection;
  return order ? 1 : -1;
}

//display status
const selectedNode = ref({})
const nodes = ref([
  {
    key: 'ALL',
    label: 'Wszystkie',
  },
  {
    key: 'FINISHED',
    label: 'Zrealizowane',
  },
  {
    key: 'NOT_FINISHED',
    label: 'Niezrealizowane',
    children: [
      {
        key: 'NOT_FINISHED_TECH',
        label: 'Odbiór techniczny',
      },
      {
        key: 'NOT_FINISHED_END',
        label: 'Odbiór końcowy',
      }
    ]
  },
  {
    key: 'OVER_DUE',
    label: 'Przeterminowane',

  },
]);
function onStatusChange(event: any) {
  console.log('CHANGED', Object.keys(event)[0])
  loadData(UtilsService.getStatus(Object.keys(event)[0]))
}
function updateDisplayByStatus() {
  let displayStatus = settingStore.settings.gasConnectionSettings.displayStatus;
  selectedNode.value = {[displayStatus]: true}
}
// designer
const displayByDesigners = ref([
  { name: 'Tylko moje', value: "MINE", constant: !authenticationStore.isDesignerOrAdmin },
  { name: 'Progas', value: "COMPANY", constant: !authenticationStore.isEmployeeOrAdmin },
  { name: 'Wszystkie', value: "ALL", constant: !authenticationStore.isEmployeeOrAdmin }
]);
const selectedDisplayByDesigners = ref(displayByDesigners.value[0]);
function updateDisplayByDesigners() {
  let status = settingStore.settings.gasConnectionSettings.displayByDesigner;
   let find = displayByDesigners.value.find(item => item.value === status);
   if (find)
     selectedDisplayByDesigners.value = find;
}
watch(selectedDisplayByDesigners,(newValue, oldValue)=>{
  console.log('newValue',newValue)
  console.log('oldValue',oldValue)
  console.log('nul?',newValue === null)
  if (newValue === null) {
    selectedDisplayByDesigners.value=oldValue
  }
})
function displayByDesignersChange(newValue: any){
  if (newValue.value !== null) {
    loadData(UtilsService.getStatus(selectedNode.value.key))
  }
}

//settings
const showSettings = ref(false);

async function saveSettings(gasConnectionSettings: GasConnectionSettings) {
  if (gasConnectionSettings) {
    showSettings.value = false;
    const result = await settingStore.updateGasConnectionSettings(gasConnectionSettings);
    if (result) {
      toast.add({
        severity: "success",
        summary: "Potwierdzenie",
        detail: "Zaaktualizowano ustawienia.",
        life: 5000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Potwierdzenie",
        detail: "Błąd podczas aktualicaji ustawień.",
        life: 5000,
      });
    }
  }
}

//context menu
const contextMenuRef = ref();
const selectedGasConnection = ref<GasconnectionQuery>();
const selectedGasConnectionIndex = ref<number>();
const menuModel = computed(() => {
  const items = [];
  if (selectedGasConnection.value && lockedGasConnection.value.includes(selectedGasConnection.value)) {
    items.push({
      label: 'Odblokuj wiersz',
      icon: 'pi pi-fw pi-lock-open',
      command: () => toggleLock(selectedGasConnection.value, true, selectedGasConnectionIndex.value)
    });
  } else {
    items.push({
      label: 'Zablokuj wiersz',
      icon: 'pi pi-fw pi-lock',
      command: () => toggleLock(selectedGasConnection.value, false, selectedGasConnectionIndex.value)
    });
  }

  items.push(
      {separator: true},
      {label: 'View', icon: 'pi pi-fw pi-search', command: () => console.log('VIEW', selectedGasConnection.value)},
      {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => console.log('DELETE', selectedGasConnection.value)}
  )
  return items;
});
const onRowContextMenu = (event: any) => {
  console.log('ROW', event)
  selectedGasConnectionIndex.value = event.index;
  contextMenuRef.value.show(event.originalEvent);
};

//row freeze
const lockedGasConnection = ref<GasconnectionQuery[]>([]);
const toggleLock = (data: GasconnectionQuery | undefined, frozen: boolean, index: number | undefined) => {
  if (data) {
    if (frozen) {
      lockedGasConnection.value = lockedGasConnection.value.filter((c, i) => i !== index);
      gasConnections.value.push(data);
    } else {
      customers.value = customers.value.filter((c, i) => i !== index);
      lockedGasConnection.value.push(data);
    }
  }
};

//row counter
const rowCounter = ref<number>(0);
const onFilter = (event: any) => {
  rowCounter.value = event.filteredValue.length
};

//row style
const rowStyle = (data: GasconnectionQuery) => {
  // console.log('ROW', data);
  if (data.isFinished) {
    return {backgroundColor: settingStore.settings.gasConnectionSettings.colorCompleted};
    // return { backgroundColor: 'bold', fontStyle: 'italic' };
  } else {
    //ready to FV
    if(data.wsgFinalAcceptanceDate !== "" )
      return {backgroundColor: settingStore.settings.gasConnectionSettings.colorFvReady};


    //overdue
    if (moment().diff(data.finishDeadline, 'days') > 0)
      return {backgroundColor: settingStore.settings.gasConnectionSettings.colorOverdue};

    //before deadline
    const daysBefore = settingStore.settings.gasConnectionSettings.daysBefore;
    const calculatedDays = moment(data.finishDeadline).diff(moment(), 'days')
    if (calculatedDays <= daysBefore && calculatedDays > 0) {
      return {backgroundColor: settingStore.settings.gasConnectionSettings.colorBeforeDeadline};
    }
  }
};
//cell style
const cellStyle = (data: GasconnectionQuery, column: string) => {

  // is invoice
  if(column === "contractNo" && data.isInvoice)
  return {
    backgroundColor: settingStore.settings.gasConnectionSettings.colorReceipt,
    borderRadius: '3px'
  };

  //is build
  if(column === "finishDeadline" && data.realizationEndDate)
    return {
      backgroundColor: settingStore.settings.gasConnectionSettings.colorReceipt,
      borderRadius: '3px'
    };
}
//cell style
const cellClass = (data: GasconnectionQuery, column: string) => {
  if (data.withoutTrafficOrganizationProject && (column === 'trafficOrganizationProjectSubmissionDate' || column ==='trafficOrganizationProjectReceiptDate'))
    return "disable-column w-full h-full"
}

</script>

<template>
  <TheMenuTasks/>
  <GasConnectionSettingDialog v-model:visible="showSettings" @save="saveSettings" @cancel="showSettings=false"/>
  <div class="card mt-5">
    <ContextMenu ref="contextMenuRef" :model="menuModel" @hide="selectedGasConnection = undefined"/>
    <DataTable ref="dataTableRef" v-model:filters="filters"
               :value="gasConnections"
               contextMenu
               v-model:contextMenuSelection="selectedGasConnection"
               @rowContextmenu="onRowContextMenu"
               paginator
               :rows-per-page-options="[10,20,30,50,75,100]"
               :rows="settingStore.settings.gasConnectionSettings.rowsNumber"
               scrollable scrollHeight="73vh"
               removableSort
               :sort-field="settingStore.settings.gasConnectionSettings.sortColumn"
               :sort-order="getSortOrder()"
               filterDisplay="menu"
               :globalFilterFields="['designerFullName', 'coordinatorFullName', 'customerFullName', 'commune', 'city', 'street', 'taskNo', 'conditionNo', 'contractNo', 'customerPhone','connectionAgreementNumber','sapUpNo']"
               @filter="onFilter"
               showGridlines
               :frozenValue="lockedGasConnection"
               :loading="gasConnectionQueryStore.loadingGasConnectionQuery"
               resizable-columns
               column-resize-mode="expand"
               :rowStyle="rowStyle"
    >
      <template #header>
        <div class="flex justify-content-between ">
          <Button type="button" icon="pi pi-filter-slash" label="Wyczyść" outlined @click="clearFilter()"/>
          <div class="flex flex-row gap-2">
            <TreeSelect v-model="selectedNode"
                        @change="onStatusChange"
                        :options="nodes"
                        placeholder="Wybierz status"
                        class="md:w-20rem w-full"/>
          </div>
          <SelectButton v-model="selectedDisplayByDesigners" :options="displayByDesigners" optionDisabled="constant" optionLabel="name" @change="displayByDesignersChange"/>
          <div class="flex flex-row gap-2">
            <IconField iconPosition="left">
              <InputIcon>
                <i class="pi pi-search"/>
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Zacznij pisać..."/>
            </IconField>
            <Button icon="pi pi-cog" outlined @click="showSettings=!showSettings"/>
          </div>
        </div>
      </template>
      <template #empty> Nie znaleziono przyłączy.</template>
      <template #loading> Ładowanie danych. Proszę czekać...</template>
      <Column v-for="col of columns" :key="col.field" sortable
              :field="col.field"
              :header="col.header"
              :filter-field="col.field"
              :data-type="col.dataType"
              :show-filter-match-modes="col.showFilterMatchModes"
              :style="{
                maxWidth: col.type === 'date' ? '180px !important' : '400px !important',
                minWidth: col.type === 'multiselect' || col.field ==='street' ? '300px !important' : '150px !important',
            }"
              :frozen="col.frozen"
              :align-frozen="'left'"
     >
        <!--              :style="{ width: col.type === 'date' ? '200px' : '300px' }"-->

        <!--              :style="{ minWidth: col.type === 'multiselect' ? '300px' : '100px' }"-->

        <!-- DATA  -->
        <template v-if="col.type === 'date'" #body="{ data }">
<!--          <div :style="columnStyle(data, col.field)">-->
          <div :style="cellStyle(data, col.field)" :class="cellClass(data, col.field)">
                      <span class="flex justify-content-center">&nbsp{{  UtilsService.formatDate(data[col.field]) }}</span>
          </div>
        </template>
        <template v-if="col.type==='date'" #filter="{ filterModel }">
          <Calendar v-model="filterModel.value" dateFormat="yy-mm-dd" placeholder="yyyy-mm-dd"/>
        </template>

        <!-- NUMERIC  -->
        <template v-if="col.type==='numeric'" #body="{ data }">
          <span class="flex justify-content-center"> {{ UtilsService.formatCurrency(data[col.field]) }} </span>

        </template>
        <template v-if="col.type==='numeric'" #filter="{ filterModel }">
          <InputNumber v-model="filterModel.value" mode="currency" currency="PLN" locale="pl-PL"/>
        </template>

        <!-- TEXT  -->
        <template v-if="col.type==='text'" #body="{ data }">
          <span class="flex justify-content-center"> {{ data[col.field] }} </span>
        </template>
        <template v-if="col.type==='text'" #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" class="p-column-filter flex justify-content-center"
                     placeholder="Wpisz tutaj..."/>
        </template>

        <!-- MULTISELECT DESIGNERS -->
        <template v-if="col.type==='multiselect' && col.options==='designers'" #body="{ data }">
          <span class="flex justify-content-center"> {{ data[col.field] }}</span>
        </template>
        <template v-if="col.type==='multiselect' && col.options==='designers'" #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value"
                       :options="designers"
                       placeholder="Wybierz..."
                       class="p-column-filter"
                       :max-selected-labels="2"
          />
        </template>

        <!-- MULTISELECT COORDINATORS -->
        <template v-if="col.type==='multiselect' && col.options==='coordinators'" #body="{ data }">
          <span class="flex justify-content-center">{{ data[col.field] }}</span>
        </template>
        <template v-if="col.type==='multiselect' && col.options==='coordinators'" #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value"
                       :options="coordinators"
                       placeholder="Wybierz..."
                       class="p-column-filter"
                       :max-selected-labels="2"
          />
        </template>

        <!-- MULTISELECT CUSTOMERS -->
        <template v-if="col.type==='multiselect' && col.options==='customers'" #body="{ data }">
          <span class="flex justify-content-center"> {{ data[col.field] }} </span>
        </template>
        <template v-if="col.type==='multiselect' && col.options==='customers'" #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value"
                       :options="customers"
                       placeholder="Wybierz..."
                       :max-selected-labels="2"
                       class="p-column-filter"/>
        </template>


        <!-- TAG  STAGES-->
        <template #body="{ data }">
          <Tag class="flex justify-content-center" :value="UtilsService.getStageAsString(data.stage)" :style="UtilsService.getStageTagStyle(data[col.field])"/>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value"
                       :options="stages"
                       option-value="value" option-label="label"
                       placeholder="Wybierz..."
                       class="p-column-filter"
                       :max-selected-labels="4"
          >
            <template #option="slotProps">
              <Tag :value="UtilsService.getStageAsString(slotProps.option.value)" :style="UtilsService.getStageTagStyle(slotProps.option.value)"/>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <template #footer>
        <span class="flex justify-content-end">Ilość pozycji: {{ rowCounter }}</span>
      </template>
    </DataTable>
  </div>
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
.disable-column {
  background-color: gray !important;
  width: max-content;
  height: max-content;
}
</style>