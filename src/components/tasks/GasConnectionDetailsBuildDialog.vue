<script setup lang="ts">
import {useSettingStore} from "@/stores/setting.ts";
import {useGasConnections} from "@/stores/gasConnections.ts";
import {useDesignerStore} from "@/stores/designers.ts";
import {useAuthorizationStore} from "@/stores/authorization.ts";
import {useInvoiceStore} from "@/stores/invoices.ts";
import OfficeButton from "@/components/OfficeButton.vue";
import {computed, onMounted, ref, watch} from "vue";
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import {Cost, GasConnection} from "@/types/GasConnection.ts";
import {UtilsService} from "@/service/UtilsService.ts";
import CustomDatePicker from "@/components/CustomDatePicker.vue";
import {useSurveyorStore} from "@/stores/surveyors.ts";
import {useCommonStore} from "@/stores/commons.ts";
import {useDialog} from 'primevue/usedialog';
import {Surveyor} from "@/types/Surveyor.ts";
import {Plot, PlotOwnerPrivate} from "@/types/Plot.ts";
import {DesignerTraffic} from "@/types/Designer.ts";
import {Invoice} from "@/types/Invoice.ts";
import {InvoiceCorrection} from "@/types/InvoiceCorrection.ts";
import BasicInfoDialog from "@/components/BasicInfoDialog.vue";

const dialog = useDialog();
const designerStore = useDesignerStore();
const commonStore = useCommonStore();
const surveyorStore = useSurveyorStore();
const settingStore = useSettingStore();
const gasConnectionStore = useGasConnections();
const invoiceStore = useInvoiceStore();
const authStore = useAuthorizationStore();
const gasConnection = ref<GasConnection>({
  plots: [],
  stage: {name: "LACK", value: -1, viewValue: ""},
  accelerationDate: undefined,
  address: undefined,
  conditionDate: undefined,
  conditionNo: "",
  connectionAgreementNumber: "",
  constructionValue: 0,
  contractDate: undefined,
  contractNo: "",
  coordinator: undefined,
  customer: undefined,
  designer: undefined,
  finishDeadline: undefined,
  workRangeGasConnections: [],
  workRangeGasStations: [],
  workRangeConnection: {
    diameter: undefined,
    idTask: 0,
    info: "",
    id: 0,
    material: undefined,
    pressure: undefined,
    taskType: undefined
  },
  gasConnectionDesign: {
    projectOrderSubmissionDate: undefined,
    projectOrderConfirmationDate: undefined,
    proxySubmissionDate: undefined,
    proxyReceiptDate: undefined,
    mapSubmissionDate: undefined,
    mapReceiptDate: undefined,
    mapDeliveredBy: 0,
    mapSurveyor: null,
    extractSubmissionDate: undefined,
    extractReceiptDate: undefined,

    //stage 2
    withoutZud: false,
    zudpSubmissionDate: undefined,
    zudpReceiptDate: undefined,
    utilityCompanyType: null,
    utilityCompanySubmissionDate: undefined,
    utilityCompanyReceiptDate: undefined,

    //stage 3
    wsgAgreementSubmissionDate: undefined,
    wsgAgreementReceiptDate: undefined,
    wsgAgreementAgreementDate: undefined,
    wsgAgreementNo: "",
    wsgAgreementPointSchemeSubmissionDate: undefined,
    wsgAgreementPointSchemeReceiptDate: undefined,

    //stage 4
    withoutTrafficOrganizationProject: false,
    trafficOrganizationProjectSubmissionDate: undefined,
    trafficOrganizationProjectReceiptDate: undefined,
    designerTraffic: null,
    gasPointOrderDate: undefined,
    gasPointPickupDate: undefined,
    gasPointDocPickupDate: undefined,
    gasPointOrderNo: "",
    zudpSentToSurveyorDate: undefined,
    surveyorTrafficProject: null,
  },
  gasConnectionBuild: {
    substationNotificationSubmissionDate: undefined,
    surveyingSketchesDate: undefined,
    surveyingInventoryDate: undefined,
    realizationStartDate: undefined,
    realizationEndDate: undefined,
    wsgTechnicalAcceptanceDate: undefined,
    wsgFinalAcceptanceSubmissionDate: undefined,
    wsgFinalAcceptanceDate: undefined,
    gasConnectionRealLength: 0,
    technicalAcceptanceProtocolNo: "",
    gasPipelineInventoryNumber: "",
    wsgInfo: ""
  },
  pgn: {
    id: 0,
    applicationNumber: "",
    idTask: 0,
    pgnNumber: "",
    taskType: {name: "GAS_CONNECTION", viewName: "przylacze"},
    info: "",
    recipient: "",
    workDate: undefined,
  },
  gasConnectionFinance: {
    financeInventoryAmount: 0,
    financeInventoryDate: undefined,
    financeProjectAmount: 0,
    financeProjectDate: undefined,
    financeRoadPastureAmount: 0,
    financeRoadPastureDate: undefined,
    costList: []
  },
  idGasConnectionSync: false,
  idTask: 0,
  info: "",
  isFinished: false,
  isPGN: false,
  projectDeadline: undefined,
  projectValue: 0,
  sapUpNo: "",
  substationName: "",
  taskNo: "",
  taskValue: 0,
  wsgFinalPickupDate: undefined
});
const isEdit = ref<boolean>(false)
const emit = defineEmits<{
  (e: "save", gasConnection: GasConnection): void;
  (e: "cancel"): void;
}>();

const props = defineProps({
  gasConnectionId: {
    type: Number,
    required: true,
    default: 0
  },
})
const gasConnectionId = computed(() => props.gasConnectionId);
watch(gasConnectionId, async (newId) => {
  await loadGasConnection(newId);
});


const loadGasConnection = async (id: number) => {
  console.log('Loading GasConnectionDetailsDesignDialog: ', id);
  if (id > 0) {
    let result = await gasConnectionStore.getGasConnectionFromDb(id);
    if (result) {
      gasConnection.value = result;
      selectedMapDeliver.value = UtilsService.getMapDelivery(gasConnection.value.gasConnectionDesign.mapDeliveredBy);
      selectedSurveyor.value = gasConnection.value.gasConnectionDesign.mapSurveyor;
      selectedTrafficSurveyor.value = gasConnection.value.gasConnectionDesign.surveyorTrafficProject;
      selectedDesignerTraffic.value = gasConnection.value.gasConnectionDesign.designerTraffic;
      selectedPgnRecipient.value = gasConnection.value?.pgn?.recipient;
      gasConnection.value.plots = calculatePlots(gasConnection.value.plots);
      selectedPlot.value = {
        connectionEntity: false,
        id: 0,
        idTask: 0,
        info: "",
        laneOccupationEndDate: undefined,
        laneOccupationPreparationDate: undefined,
        laneOccupationReceiptDate: undefined,
        laneOccupationStartDate: undefined,
        laneOccupationSubmissionDate: undefined,
        laneReceiptDate: undefined,
        plotNumber: "",
        plotOwner: {id: 0, name: ""},
        plotOwnerPrivate: [],
        receiptDate: undefined,
        submissionDate: undefined,
        taskType: {name: "GAS_CONNECTION", viewName: "Wszystkie"}
      };
      if (authStore.hasAccessFinance) {
        invoices.value = await invoiceStore.getInvoiceByTaskFromDb(id, {name: "GAS_CONNECTION", viewName: "przylacze"})
        let correctionsList = await Promise.all(
            invoices.value.map(fv =>
                invoiceStore.getInvoiceCorrectionByInvoiceFromDb(fv.idInvoiceNumber, fv.idInvoiceYear)
            )
        );
        correctionsList.forEach(correction => {
          if (correction.length > 0) {  // Sprawdzenie, czy tablica nie jest pusta
            invoices.value.push(...correction);  // Rozpakowuje elementy tablicy correction i dodaje je do invoices.value
          }
        });
      }
    }
  }
};

const calculatePlots = (plots: Plot[]): Plot[] => {
  if (plots.length == 0) {
    return plots;
  }
  let newPlots: Plot[] = [];

  for (let i = 0; i < plots.length; i++) {
    if (plots[i].plotOwner.id === 5 && !plots[i].connectionEntity) {
      let privates: PlotOwnerPrivate[] = plots[i].plotOwnerPrivate;
      if (privates && privates.length > 0) {
        let earliestDate: Date | undefined = undefined;
        let latestDate: Date | undefined = undefined;
        let submissionCount: number = 0;
        let receiptCount: number = 0;

        //calculate earliest submission date
        privates.forEach(owner => {
          const submissionDates = [
            owner.submissionDate,
            owner.submissionDate1,
            owner.submissionDate2
          ].filter(date => UtilsService.formatDate(date) !== "") as Date[];

          submissionCount = submissionDates.length;
          submissionDates.forEach(date => {
            if (!earliestDate || date < earliestDate) {
              earliestDate = date;
            }
          })
        })
        if (earliestDate) {
          plots[i].submissionDate = earliestDate;
        }
        //calculate latest receipt date
        privates.forEach(owner => {
          const receiptDates = [
            owner.receiptDate,
            owner.receiptDate1,
            owner.receiptDate2
          ].filter(date => UtilsService.formatDate(date) !== "") as Date[];

          receiptCount = receiptDates.length;
          receiptDates.forEach(date => {
            if (!latestDate || date > latestDate) {
              latestDate = date;
            }
          })
        })
        if (submissionCount === receiptCount && privates.reduce((total, owner) => total + owner.share, 0) > gasConnectionStore.plotsShareLimit) {
          plots[i].receiptDate = latestDate;
        }
        newPlots.push(plots[i]);
      } else {
        newPlots.push(plots[i]);
      }
    } else {
      newPlots.push(plots[i]);
    }
  }
  return newPlots
};

//emit
const cancel = () => {
  emit("cancel");
};
const save = () => {
//todo dodać submit
  emit("save", gasConnection.value);
}

const mapDeliver = ref([
  {name: 'Geodeta', code: 1},
  {name: 'Klient', code: 2},
  {name: 'Ośrodek', code: 3},
]);

const selectedMapDeliver = ref<{ name: string; code: number; } | { name: null; code: null; }>({name: null, code: null})
const selectedSurveyor = ref<Surveyor | null>(null)
const selectedTrafficSurveyor = ref<Surveyor | null>(null)
const selectedDesignerTraffic = ref<DesignerTraffic | null>(null)
const selectedPgnRecipient = ref<String | undefined>("")

const selectedPlot = ref<Plot>()
const selectedPlotBuild = ref<Plot>()

//row style
const rowStyle = (data: Plot) => {
  if (data.connectionEntity) {
    return {
      backgroundColor: settingStore.settings.gasConnectionSettings.colorSubmission,
      color: UtilsService.getContrastTextColor(settingStore.settings.gasConnectionSettings.colorSubmission)
    };
  }
};
const rectangleStyle = computed(() => ({
  width: '120px', /* Szerokość prostokąta */
  height: '30px', /* Wysokość prostokąta */
  backgroundColor: settingStore.settings.gasConnectionSettings.colorSubmission, /* Kolor tła */
  border: '1px solid #f5d3b3' /* Obwódka */
}));

const getSurveyorTrafficProjectStyle = (style: string, date: Date | undefined, surveyor: Surveyor | null): string | null => {
  const firstDate = UtilsService.formatDate(date);
  if (firstDate === "" && surveyor === null && selectedTrafficSurveyor.value === null)
    return `${style}: ${settingStore.settings.gasConnectionSettings.colorOverdue}`;
  if (firstDate !== "" && ((surveyor !== null) || selectedTrafficSurveyor.value !== null))
    return `${style}: ${settingStore.settings.gasConnectionSettings.colorReceipt}`
  else if (firstDate !== "" || ((surveyor !== null) || selectedTrafficSurveyor.value !== null))
    return `${style}: ${settingStore.settings.gasConnectionSettings.colorSubmission}`;
  else
    return null;
}

//------------------------------------------------- FINANCE
const invoices = ref<(Invoice | InvoiceCorrection)[]>([]);
const selectedCosts = ref<Cost[]>([]);

const amountTotal = computed(() => {
  let total = 0;
  for (let inv of invoices.value) {
    total += inv.amountNet;
  }

  return UtilsService.formatCurrency(total);
});
const percentTotal = computed(() => {
  let total = 0;
  for (let inv of invoices.value) {
    total += UtilsService.calculatePercentagePaid(inv.amountNet, gasConnection.value.taskValue);
  }

  return total;
});

//--------------------------INFO
const showCustomerInfo = () => {
  dialog.open(BasicInfoDialog, {
    props: {
      header: 'Szczegóły klienta',
      style: {
        width: '30rem',
      },
      modal: true
    },
    data: {
      firstName: gasConnection.value.customer?.firstName,
      lastName: gasConnection.value.customer?.name,
      address: `${gasConnection.value.customer?.street}, ${gasConnection.value.customer?.zip} ${gasConnection.value.customer?.city}`,
      nip: gasConnection.value.customer?.nip,
      phone: gasConnection.value.customer?.phone,
      // phone2: gasConnection.value.customer?.phone,
      mail: gasConnection.value.customer?.mail
    }
  });
}
const showDesignerInfo = () => {
  dialog.open(BasicInfoDialog, {
    props: {
      header: 'Szczegóły projektanta',
      style: {
        width: '30rem',
      },
      modal: true
    },
    data: {
      firstName: gasConnection.value.designer?.name,
      lastName: gasConnection.value.designer?.lastName,
      address: `${gasConnection.value.designer?.street}, ${gasConnection.value.designer?.zip} ${gasConnection.value.designer?.city}`,
      phone: gasConnection.value.designer?.phone,
      phone2: gasConnection.value.designer?.phone2,
      mail: gasConnection.value.designer?.mail
    }
  });
}
const showCoordinatorInfo = () => {
  dialog.open(BasicInfoDialog, {
    props: {
      header: 'Szczegóły koordynatora',
      style: {
        width: '30rem',
      },
      modal: true
    },
    data: {
      firstName: gasConnection.value.coordinator?.name,
      lastName: gasConnection.value.coordinator?.lastName,
      phone: gasConnection.value.coordinator?.phone,
      mail: gasConnection.value.coordinator?.mail
    }
  });
}
onMounted(async () => {
  console.log('MOUNTED: GasConnectionDetailsDesignDialog');
  if (settingStore.settings.userId === 0) settingStore.getSettingsFromDb();
  if (surveyorStore.surveyorsCached.length === 0) surveyorStore.refreshSurveyorCache();
  if (commonStore.utilityCompanyTypes.length === 0) commonStore.refreshUtilityCompanyType();
  if (designerStore.designersTrafficCached.length === 0) designerStore.refreshDesignerTrafficCache()
});
</script>

<template>
  <Dialog modal class="m-5 w-5/6" close-on-escape @abort="cancel">
    <template #header>
      <div class="flex flex-row justify-between w-full ">

        <h2 class=" ml-5">
          Szczegóły zadania
        </h2>
        <Button icon="pi pi-sync" outlined @click="loadGasConnection(gasConnectionId)"/>
      </div>
    </template>
    <div class="card w-full">
      <Splitter>
        <SplitterPanel class="flex  flex-column p-3" :size="30" :minSize="25">
          <div class="w-full">

            <Fieldset legend="Szczegóły przyłącza" class="w-full">
              <div class="card">
                <p class="m-0"><small class="left-side">Klient:</small><span
                    class="right-side"> {{ gasConnection.customer?.name }} {{ gasConnection.customer?.firstName }}
                  <Button class="ml-2" icon="pi pi-exclamation-circle"
                          style="max-width: 15px; max-height: 15px"
                          raised rounded outlined
                          v-tooltip.top="'Wyświetl szczegóły'"
                          @click="showCustomerInfo"/>
                  <Button
                      v-if="gasConnection.customer?.mail"
                      class="ml-2" icon="pi pi-envelope"
                      style="max-width: 20px; max-height: 20px"
                      outlined
                      v-tooltip.top="'Wyślij maila'"
                      @click="UtilsService.sendMail(gasConnection.customer.mail)"/>
                </span></p>

                <p class="m-0"><small class="left-side">Gmina:</small><span
                    class="right-side"> {{ gasConnection.address?.commune }}</span></p>
                <p class="m-0"><small class="left-side">Miasto:</small><span
                    class="right-side"> {{ gasConnection.address?.city }}</span></p>
                <p class="m-0"><small class="left-side">Ulica, działka:</small><span
                    class="right-side"> {{ gasConnection.address?.street }}</span></p>
                <p class="m-0"><small class="left-side">Nr zlecenia:</small><span
                    class="right-side"> {{ gasConnection.taskNo }}</span></p>
                <p class="m-0"><small class="left-side">Nr umowy:</small><span
                    class="right-side"> {{ gasConnection.contractNo }}</span></p>
                <p class="m-0"><small class="left-side">Data umowy:</small> <span
                    class="right-side">{{ gasConnection.contractDate }}</span></p>
                <p class="m-0"><small class="left-side">Termin projektu:</small><span
                    class="right-side"> {{ gasConnection.projectDeadline }}</span></p>
                <p class="m-0"><small class="left-side">Termin odb. tech.:</small><span
                    class="right-side"> {{ gasConnection.finishDeadline }}</span></p>
                <p class="m-0"><small class="left-side">Projektant:</small><span
                    class="right-side"> {{ gasConnection.designer?.name }} {{ gasConnection.designer?.lastName }}
                  <Button class="ml-2" icon="pi pi-exclamation-circle"
                          style="max-width: 15px; max-height: 15px"
                          raised rounded outlined
                          v-tooltip.top="'Wyświetl szczegóły'"
                          @click="showDesignerInfo"/>
                  <Button
                      v-if="gasConnection.designer?.mail"
                      class="ml-2" icon="pi pi-envelope"
                      style="max-width: 20px; max-height: 20px"
                      outlined
                      v-tooltip.top="'Wyślij maila'"
                      @click="UtilsService.sendMail(gasConnection.designer.mail)"/>
                </span>
                </p>
                <p class="m-0"><small class="left-side">Koordynator:</small> <span
                    class="right-side"> {{ gasConnection.coordinator?.name }} {{
                    gasConnection.coordinator?.lastName
                  }}
                  <Button class="ml-2" icon="pi pi-exclamation-circle"
                          style="max-width: 15px; max-height: 15px"
                          raised rounded outlined
                          v-tooltip.top="'Wyświetl szczegóły'"
                          @click="showCoordinatorInfo"/>
                  <Button
                      v-if="gasConnection.coordinator?.mail"
                      class="ml-2" icon="pi pi-envelope"
                      style="max-width: 20px; max-height: 20px"
                      outlined
                      v-tooltip.top="'Wyślij maila'"
                      @click="UtilsService.sendMail(gasConnection.coordinator.mail)"/>
                </span>
                </p>
                <p class="m-0"><small class="left-side">Wartość projektu:</small> <span
                    class="right-side">{{ UtilsService.formatCurrency(gasConnection.projectValue) }}</span></p>
                <p class="m-0"><small class="left-side">Wartość wykonawstwa:</small><span
                    class="right-side">{{ UtilsService.formatCurrency(gasConnection.constructionValue) }}</span></p>
                <p class="m-0"><small class="left-side">Wartość zadania:</small><span
                    class="right-side">{{ UtilsService.formatCurrency(gasConnection.taskValue) }}</span></p>
                <p class="m-0"><small class="left-side">Nr waunków:</small><span
                    class="right-side">{{ gasConnection.conditionNo }}</span></p>
                <p class="m-0"><small class="left-side">Nr umowy przyłączeniowej:</small><span
                    class="right-side">{{ gasConnection.connectionAgreementNumber }}</span></p>
                <p class="m-0"><small class="left-side">Nr SAP/UP:</small><span
                    class="right-side">{{ gasConnection.sapUpNo }}</span></p>
              </div>
            </Fieldset>
            <Fieldset legend="Uwagi" class="w-full h-full">
              <Textarea :rows="10" autoResize fluid v-model="gasConnection.info"></Textarea>
            </Fieldset>
          </div>
        </SplitterPanel>

        <SplitterPanel class="flex  " :size="70">
          <div class="card w-full">
            <Tabs value="0">
              <TabList>
                <Tab value="0">Projekt</Tab>
                <Tab value="1">Działki</Tab>
                <Tab value="2">Wykonawstwo</Tab>
                <Tab value="3" v-if="authStore.hasAccessTasksGasConnectionFinance">Finanse - koszty</Tab>
                <Tab value="4" v-if="authStore.hasAccessFinance">Finanse - faktury</Tab>
                <Tab value="5">Zakres</Tab>
              </TabList>
              <TabPanels>
                <TabPanel value="0">
                  <!--  STAGE 1 -->
                  <Panel toggleable class="w-full mb-3 mt-3" :collapsed="+gasConnection.stage.value >=1"
                         :style="gasConnection.stage.value === 0 ? UtilsService.getCustomColor('border-color','SUBMISSION') : +gasConnection.stage.value >=1? UtilsService.getCustomColor('border-color','RECEIPT'):UtilsService.getCustomColor('border-color','EMPTY')">
                    <template #header>
                      <span class="font-bold"
                            :style="gasConnection.stage.value === 0 ? UtilsService.getCustomColor('color','SUBMISSION') : +gasConnection.stage.value >=1? UtilsService.getCustomColor('color','RECEIPT'):UtilsService.getCustomColor('color','EMPTY')">ETAP 1</span>
                    </template>

                    <Fieldset :toggleable="true" class="mb-5">
                      <template #legend>
                        <span>Zlecenie projektu</span>
                      </template>
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="projectOrderSubmissionDate" class="mb-1 ps-1"><small> Data
                            złożenia </small></label>
                          <InputGroup>
                            <CustomDatePicker v-model="gasConnection.gasConnectionDesign.projectOrderSubmissionDate"
                                              showIcon fluid :showOnFocus="false"
                                              inputId="projectOrderSubmissionDate" :manualInput="false" showButtonBar
                                              dateFormat="yy-mm-dd"/>
                            <InputGroupAddon v-if="true" class="p-0">
                              <Button class="btn-icon" outlined icon="pi pi-file-word"/>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                        <div class="flex-auto">
                          <label for="projectOrderConfirmationDate" class="mb-1 ps-1"><small> Data
                            potwierdzenia </small></label>
                          <InputGroup>
                            <CustomDatePicker v-model="gasConnection.gasConnectionDesign.projectOrderConfirmationDate"
                                              showIcon fluid :showOnFocus="false"
                                              inputId="projectOrderConfirmationDate" dateFormat="yy-mm-dd" showButtonBar
                                              :manualInput="false"/>
                            <InputGroupAddon v-if="true" class="p-0">
                              <Button class="btn-icon" outlined icon="pi pi-file-word"/>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                      </div>
                    </Fieldset>

                    <Fieldset :toggleable="true" class="mb-1">
                      <template #legend>
                        <span>Pełnomocnictwo</span>
                      </template>
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="proxySubmissionDate" class="mb-1 ps-1"><small> Data złożenia </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionDesign.proxySubmissionDate" showIcon
                                            fluid :showOnFocus="false"
                                            inputId="proxySubmissionDate" :manualInput="false" showButtonBar
                                            dateFormat="yy-mm-dd">
                          </CustomDatePicker>
                        </div>
                        <div class="flex-auto">
                          <label for="proxyReceiptDate" class="mb-1"><small> Data otrzymania </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionDesign.proxyReceiptDate" showIcon
                                            fluid :showOnFocus="false"
                                            inputId="proxyReceiptDate" dateFormat="yy-mm-dd" showButtonBar
                                            :manualInput="false"/>
                        </div>
                      </div>
                    </Fieldset>


                    <!--  MAPA  -->
                    <Fieldset :toggleable="true" class="mb-1 ps-1"
                              :style="UtilsService.getStageStyleByDates('border-color',gasConnection.gasConnectionDesign.mapSubmissionDate, gasConnection.gasConnectionDesign.mapReceiptDate)">
                      <template #legend>
                        <span class="font-bold"
                              :style="UtilsService.getStageStyleByDates('color',gasConnection.gasConnectionDesign.mapSubmissionDate, gasConnection.gasConnectionDesign.mapReceiptDate)">Mapa</span>
                      </template>
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="mapSubmissionDate" class="mb-1 ps-1"><small> Data złożenia </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionDesign.mapSubmissionDate" showIcon fluid
                                            :showOnFocus="false"
                                            inputId="mapSubmissionDate" :manualInput="false" showButtonBar
                                            dateFormat="yy-mm-dd"/>
                        </div>
                        <div class="flex-auto">
                          <label for="mapReceiptDate" class="mb-1 ps-1"><small> Data otrzymania </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionDesign.mapReceiptDate" showIcon fluid
                                            :showOnFocus="false"
                                            inputId="mapReceiptDate" dateFormat="yy-mm-dd" showButtonBar
                                            :manualInput="false"/>
                        </div>
                        <div class="flex-auto">
                          <label for="mapProvidedBy" class="block mb-0"><small> Mapę dostarczył </small></label>
                          <Select v-model="selectedMapDeliver" :options="mapDeliver" optionLabel="name"
                                  placeholder="wybierz..." class="w-full" id="mapProvidedBy"
                                  @change="() => {if(selectedMapDeliver.code !==1 ) selectedSurveyor = null} "/>
                        </div>
                        <div class="flex-auto">
                          <label for="selectedSurveyor" class="block mb-0"><small> Geodeta </small></label>
                          <InputGroup>
                            <Select v-model="selectedSurveyor" :options="surveyorStore.surveyorsCached"
                                    :loading="surveyorStore.loadingSurveyor"
                                    :optionLabel="(surveyor) => surveyor.lastName + ' ' + surveyor.name"
                                    class="w-full" id="selectedSurveyor" :disabled="selectedMapDeliver.code !==1"/>
                            <InputGroupAddon class="p-0">
                              <Button class="btn-icon" outlined icon="pi pi-eraser"
                                      :disabled="!(selectedSurveyor!==null)" @click="selectedSurveyor = null"/>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                      </div>
                    </Fieldset>

                    <!--    WYPIS   -->
                    <Fieldset :toggleable="true" class="mb-1"
                              :style="UtilsService.getStageStyleByDates('border-color',gasConnection.gasConnectionDesign.extractSubmissionDate, gasConnection.gasConnectionDesign.extractReceiptDate)">
                      <template #legend>
                        <span class="font-bold"
                              :style="UtilsService.getStageStyleByDates('color',gasConnection.gasConnectionDesign.extractSubmissionDate, gasConnection.gasConnectionDesign.extractReceiptDate)">Wypis</span>
                      </template>
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="extractSubmissionDate" class="mb-1 ps-1"><small> Data złożenia </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionDesign.extractSubmissionDate" showIcon
                                            fluid :showOnFocus="false"
                                            inputId="extractSubmissionDate" :manualInput="false" showButtonBar
                                            dateFormat="yy-mm-dd"/>
                        </div>
                        <div class="flex-auto">
                          <label for="extractReceiptDate" class="mb-1 ps-1"><small> Data otrzymania </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionDesign.extractReceiptDate" showIcon
                                            fluid :showOnFocus="false"
                                            inputId="extractReceiptDate" :manualInput="false" showButtonBar
                                            dateFormat="yy-mm-dd"/>
                        </div>
                      </div>
                    </Fieldset>


                    <Fieldset :toggleable="true" class="mb-1">
                      <template #legend>
                        <span>Współrzędne</span>
                      </template>
                      <label for="buttondisplay" class="mb-1 ps-1"><small> Stopnie w zapisie dziesiętnym
                        (DD) </small></label>
                      <div class="card flex flex-column md:flex-row  gap-4">
                        <InputGroup>
                          <InputGroupAddon>N</InputGroupAddon>
                          <InputNumber class="max-w-3rem" :min="-90" :max="90"/>
                          <InputGroupAddon>,</InputGroupAddon>
                          <InputNumber :useGrouping="false"/>
                        </InputGroup>
                        <InputGroup>
                          <InputGroupAddon>E</InputGroupAddon>
                          <InputNumber class="max-w-3rem" :min="-180" :max="180"/>
                          <InputGroupAddon>,</InputGroupAddon>
                          <InputNumber :useGrouping="false"/>
                        </InputGroup>
                      </div>

                      <label for="buttondisplay" class="mb-1 ps-1 mt-5"><small> Stopnie, minuty i sekundy
                        (DMS) </small></label>
                      <div class="card flex flex-col  gap-4">
                        <InputGroup>
                          <InputNumber :min="0" :max="90"/>
                          <InputGroupAddon>&deg;</InputGroupAddon>
                          <InputNumber :min="0" :max="59"/>
                          <InputGroupAddon>&prime;</InputGroupAddon>
                          <InputNumber :useGrouping="false" :minFractionDigits="1" :maxFractionDigits="6"/>
                          <InputGroupAddon>&Prime; N</InputGroupAddon>
                        </InputGroup>
                        <InputGroup>
                          <InputNumber :min="0" :max="90"/>
                          <InputGroupAddon>&deg;</InputGroupAddon>
                          <InputNumber :min="0" :max="59"/>
                          <InputGroupAddon>&prime;</InputGroupAddon>
                          <InputNumber :useGrouping="false" :minFractionDigits="1" :maxFractionDigits="6"/>
                          <InputGroupAddon>&Prime; E</InputGroupAddon>
                        </InputGroup>
                      </div>
                    </Fieldset>


                  </Panel>

                  <!--  STAGE 2 -->
                  <Panel toggleable class="w-full mb-3" :collapsed="+gasConnection.stage.value >=3"
                         :style="gasConnection.stage.value === 2 ? UtilsService.getCustomColor('border-color','SUBMISSION') : +gasConnection.stage.value >=3  ? UtilsService.getCustomColor('border-color','RECEIPT'):UtilsService.getCustomColor('border-color','EMPTY')">
                    <template #header>
                      <span class="font-bold"
                            :style="gasConnection.stage.value === 2 ? UtilsService.getCustomColor('color','SUBMISSION') : +gasConnection.stage.value >=3? UtilsService.getCustomColor('color','RECEIPT'):UtilsService.getCustomColor('color','EMPTY')">ETAP 2</span>
                    </template>


                    <!--  ZUDP  -->
                    <Fieldset :toggleable="true" class="mb-1"
                              :style="!gasConnection.gasConnectionDesign.withoutZud ? UtilsService.getStageStyleByDates('border-color',gasConnection.gasConnectionDesign.zudpSubmissionDate, gasConnection.gasConnectionDesign.zudpReceiptDate) : null">
                      <template #legend v-if="gasConnection.gasConnectionDesign.withoutZud">
                        <span>ZUDP</span>
                      </template>
                      <template #legend v-else>
                        <span class="font-bold"
                              :style="UtilsService.getStageStyleByDates('color',gasConnection.gasConnectionDesign.zudpSubmissionDate, gasConnection.gasConnectionDesign.zudpReceiptDate)">ZUDP</span>
                      </template>
                      <div class="flex items-center">
                        <Checkbox v-model="gasConnection.gasConnectionDesign.withoutZud" inputId="withoutZud" binary/>
                        <label for="withoutZud" class="ml-2"> uzgodnienie bez ZUD </label>
                      </div>
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="zudpSubmissionDate" class="mb-1 ps-1"><small> Data złożenia </small></label>
                          <InputGroup>
                            <CustomDatePicker v-model="gasConnection.gasConnectionDesign.zudpSubmissionDate" showIcon
                                              fluid :showOnFocus="false"
                                              :disabled="gasConnection.gasConnectionDesign.withoutZud"
                                              inputId="zudpSubmissionDate" :manualInput="false" showButtonBar
                                              dateFormat="yy-mm-dd"/>
                            <InputGroupAddon v-if="true" class="p-0">
                              <Button class="btn-icon" outlined icon="pi pi-file-word"/>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                        <div class="flex-auto">
                          <label for="zudpReceiptDate" class="mb-1 ps-1"><small> Data otrzymania </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionDesign.zudpReceiptDate" showIcon fluid
                                            :showOnFocus="false"
                                            :disabled="gasConnection.gasConnectionDesign.withoutZud"
                                            inputId="zudpReceiptDate" dateFormat="yy-mm-dd" showButtonBar
                                            :manualInput="false"/>
                        </div>
                      </div>
                    </Fieldset>

                    <!--    ZAKŁAD   -->
                    <Fieldset :toggleable="true" class="mb-1">
                      <template #legend>
                        <span>Zakład...</span>
                      </template>
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="utilityCompanyType" class="block mb-0"><small> Rodzaj zakładu </small></label>
                          <Select v-model="gasConnection.gasConnectionDesign.utilityCompanyType"
                                  :options="commonStore.utilityCompanyTypes" optionLabel="name"
                                  placeholder="wybierz..." class="w-full" id="utilityCompanyType"
                                  :loading="commonStore.loadingUtilityCompanyType"
                                  @change="() => {if(selectedMapDeliver.code !==1 ) selectedSurveyor = null} "/>
                        </div>
                        <div class="flex-auto">
                          <label for="utilityCompanySubmissionDate" class="mb-1 ps-1"><small> Data
                            złożenia </small></label>
                          <InputGroup>
                            <CustomDatePicker v-model="gasConnection.gasConnectionDesign.utilityCompanySubmissionDate"
                                              showIcon fluid :showOnFocus="false"
                                              :disabled="gasConnection.gasConnectionDesign.utilityCompanyType?.id === 1"
                                              inputId="utilityCompanySubmissionDate" :manualInput="false" showButtonBar
                                              dateFormat="yy-mm-dd"/>
                            <InputGroupAddon v-if="true" class="p-0">
                              <Button class="btn-icon" outlined icon="pi pi-file-word"/>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                        <div class="flex-auto">
                          <label for="utilityCompanyReceiptDate" class="mb-1 ps-1"><small> Data
                            otrzymania </small></label>
                          <InputGroup>
                            <CustomDatePicker v-model="gasConnection.gasConnectionDesign.utilityCompanyReceiptDate"
                                              showIcon fluid :showOnFocus="false"
                                              :disabled="gasConnection.gasConnectionDesign.utilityCompanyType?.id === 1"
                                              inputId="utilityCompanyReceiptDate" :manualInput="false" showButtonBar
                                              dateFormat="yy-mm-dd"/>
                          </InputGroup>
                        </div>
                      </div>
                    </Fieldset>
                    <div class="flex items-center">
                      <span class="ml-2"
                            :style="UtilsService.getColorByStage('color', UtilsService.checkPlotsStageColor(gasConnection.plots, gasConnectionStore.plotsShareLimit))">+ właściciele działek</span>
                    </div>

                  </Panel>

                  <!--  STAGE 3 -->
                  <Panel toggleable class="w-full mb-3" :collapsed="+gasConnection.stage.value >=5"
                         :style="gasConnection.stage.value === 4 ? UtilsService.getCustomColor('border-color','SUBMISSION') : +gasConnection.stage.value >=5? UtilsService.getCustomColor('border-color','RECEIPT'):UtilsService.getCustomColor('border-color','EMPTY')">
                    <template #header>
                      <span class="font-bold"
                            :style="gasConnection.stage.value === 4 ? UtilsService.getCustomColor('color','SUBMISSION') : +gasConnection.stage.value >=5? UtilsService.getCustomColor('color','RECEIPT'):UtilsService.getCustomColor('color','EMPTY')">ETAP 3</span>
                    </template>


                    <!--  UZGODNIENIE WSG  -->
                    <Fieldset :toggleable="true" class="mb-1"
                              :style="UtilsService.getStageStyleByDates('border-color',gasConnection.gasConnectionDesign.wsgAgreementSubmissionDate, gasConnection.gasConnectionDesign.wsgAgreementReceiptDate)">
                      <template #legend>
                        <span class="font-bold"
                              :style="UtilsService.getStageStyleByDates('color',gasConnection.gasConnectionDesign.wsgAgreementSubmissionDate, gasConnection.gasConnectionDesign.wsgAgreementReceiptDate)">UZGODNIENIE WSG</span>
                      </template>
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="wsgAgreementSubmissionDate" class="mb-1 ps-1"><small> Data
                            złożenia </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionDesign.wsgAgreementSubmissionDate"
                                            showIcon fluid :showOnFocus="false"
                                            inputId="wsgAgreementSubmissionDate" dateFormat="yy-mm-dd" showButtonBar
                                            :manualInput="false"/>
                        </div>
                        <div class="flex-auto">
                          <label for="wsgAgreementReceiptDate" class="mb-1 ps-1"><small> Data
                            otrzymania </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionDesign.wsgAgreementReceiptDate" showIcon
                                            fluid :showOnFocus="false"
                                            inputId="wsgAgreementReceiptDate" dateFormat="yy-mm-dd" showButtonBar
                                            :manualInput="false"/>
                        </div>
                        <div class="flex-auto">
                          <label for="wsgAgreementAgreementDate" class="mb-1 ps-1"><small> Data
                            uzgodnienia </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionDesign.wsgAgreementAgreementDate"
                                            showIcon fluid :showOnFocus="false"
                                            inputId="wsgAgreementAgreementDate" dateFormat="yy-mm-dd" showButtonBar
                                            :manualInput="false"/>
                        </div>
                        <div class="flex-auto">
                          <label for="wsgAgreementAgreementDate" class="mb-1 ps-1"><small> Numer
                            uzgodnienia </small></label>
                          <InputText v-model="gasConnection.gasConnectionDesign.wsgAgreementNo" fluid
                                     inputId="wsgAgreementAgreementDate"/>
                        </div>
                      </div>
                    </Fieldset>

                    <!--    UZGODNIENIE SCHEMATU PUNKTU W WSG   -->
                    <Fieldset :toggleable="true" class="mb-1" :disabled="gasConnection.workRangeGasStations.length == 0"
                              :style="gasConnection.workRangeGasStations.length > 0 ? UtilsService.getStageStyleByDates('border-color',gasConnection.gasConnectionDesign.wsgAgreementPointSchemeSubmissionDate, gasConnection.gasConnectionDesign.wsgAgreementPointSchemeReceiptDate) : null">
                      <template #legend v-if="gasConnection.workRangeGasStations.length == 0">
                        <span>UZGODNIENIE SCHEMATU PUNKTU W WSG</span>
                      </template>
                      <template #legend v-else>
                        <span class="font-bold"
                              :style="UtilsService.getStageStyleByDates('color',gasConnection.gasConnectionDesign.wsgAgreementPointSchemeSubmissionDate, gasConnection.gasConnectionDesign.wsgAgreementPointSchemeReceiptDate)">UZGODNIENIE SCHEMATU PUNKTU W WSG</span>
                      </template>
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="wsgAgreementPointSchemeSubmissionDate" class="mb-1 ps-1"><small> Data
                            złożenia </small></label>
                          <CustomDatePicker
                              v-model="gasConnection.gasConnectionDesign.wsgAgreementPointSchemeSubmissionDate" showIcon
                              fluid :showOnFocus="false"
                              inputId="wsgAgreementPointSchemeSubmissionDate" dateFormat="yy-mm-dd" showButtonBar
                              :manualInput="false"/>
                        </div>
                        <div class="flex-auto">
                          <label for="wsgAgreementPointSchemeReceiptDate" class="mb-1 ps-1"><small> Data
                            otrzymania </small></label>
                          <CustomDatePicker
                              v-model="gasConnection.gasConnectionDesign.wsgAgreementPointSchemeReceiptDate" showIcon
                              fluid :showOnFocus="false"
                              inputId="wsgAgreementPointSchemeReceiptDate" dateFormat="yy-mm-dd" showButtonBar
                              :manualInput="false"/>
                        </div>
                      </div>
                    </Fieldset>

                  </Panel>

                  <!--  STAGE 4 -->
                  <Panel toggleable class="w-full mb-3" :collapsed="+gasConnection.stage.value >=7"
                         :style="gasConnection.stage.value === 6 ? UtilsService.getCustomColor('border-color','SUBMISSION') : +gasConnection.stage.value >=7? UtilsService.getCustomColor('border-color','RECEIPT'):UtilsService.getCustomColor('border-color','EMPTY')">
                    <template #header>
                      <span class="font-bold"
                            :style="gasConnection.stage.value === 6 ? UtilsService.getCustomColor('color','SUBMISSION') : +gasConnection.stage.value >=7? UtilsService.getCustomColor('color','RECEIPT'):UtilsService.getCustomColor('color','EMPTY')">ETAP 4</span>
                    </template>


                    <!--  PROJEKT ORGANIZACJI RUCHU  -->
                    <Fieldset :toggleable="true" class="!mb-4"
                              :style="!gasConnection.gasConnectionDesign.withoutTrafficOrganizationProject ? UtilsService.getStageStyleByDates('border-color',gasConnection.gasConnectionDesign.trafficOrganizationProjectSubmissionDate, gasConnection.gasConnectionDesign.trafficOrganizationProjectReceiptDate) : null">
                      <template #legend v-if="gasConnection.gasConnectionDesign.withoutTrafficOrganizationProject">
                        <span>PROJEKT ORGANIZACJI RUCHU (POR)</span>
                      </template>
                      <template #legend v-else>
                        <span class="font-bold"
                              :style="UtilsService.getStageStyleByDates('color',gasConnection.gasConnectionDesign.trafficOrganizationProjectSubmissionDate, gasConnection.gasConnectionDesign.trafficOrganizationProjectReceiptDate)">PROJEKT ORGANIZACJI RUCHU (POR)</span>
                      </template>
                      <div class="card flex flex-row  mt-5 mb-3">
                        <div class="flex items-center">
                          <Checkbox v-model="gasConnection.gasConnectionDesign.withoutTrafficOrganizationProject" binary
                                    inputId="withoutTrafficOrganizationProject"
                                    v-tooltip.top="'Zaznaczenie oznacza, że nie potrzeba POR dla tego zadania. Dodatkowo wyszarza kolumny w tabeli głównej dotyczące dat POR'"

                          />
                          <label for="withoutTrafficOrganizationProject" class="ml-2"
                                 v-tooltip.top="'Wyszarza kolumny w tabeli głównej dotyczące POR'"> bez POR </label>
                        </div>
                      </div>
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="trafficOrganizationProjectSubmissionDate" class="mb-1 ps-1"><small> Data
                            złożenia </small></label>
                          <CustomDatePicker
                              v-model="gasConnection.gasConnectionDesign.trafficOrganizationProjectSubmissionDate"
                              showIcon fluid :showOnFocus="false"
                              inputId="trafficOrganizationProjectSubmissionDate" dateFormat="yy-mm-dd" showButtonBar
                              :disabled="gasConnection.gasConnectionDesign.withoutTrafficOrganizationProject"
                              :manualInput="false"/>
                        </div>
                        <div class="flex-auto">
                          <label for="trafficOrganizationProjectReceiptDate" class="mb-1 ps-1"><small> Data
                            otrzymania </small></label>
                          <CustomDatePicker
                              v-model="gasConnection.gasConnectionDesign.trafficOrganizationProjectReceiptDate" showIcon
                              fluid :showOnFocus="false"
                              inputId="trafficOrganizationProjectReceiptDate" dateFormat="yy-mm-dd" showButtonBar
                              :disabled="gasConnection.gasConnectionDesign.withoutTrafficOrganizationProject"
                              :manualInput="false"/>
                        </div>
                        <div class="flex-auto">
                          <label for="selectedTrafficDesigner" class="block mb-0"><small> Projektant </small></label>
                          <InputGroup>
                            <Select v-model="selectedDesignerTraffic" :options="designerStore.designersTrafficCached"
                                    :loading="designerStore.loadingDesignersTraffic"
                                    :optionLabel="(designer) => designer.lastName + ' ' + designer.name"
                                    :disabled="gasConnection.gasConnectionDesign.withoutTrafficOrganizationProject"
                                    class="w-full" id="selectedTrafficDesigner"/>
                            <InputGroupAddon class="p-0">
                              <Button class="btn-icon" outlined icon="pi pi-eraser"
                                      :disabled="!(selectedDesignerTraffic!==null) || gasConnection.gasConnectionDesign.withoutTrafficOrganizationProject"
                                      @click="selectedDesignerTraffic = null"/>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                      </div>
                    </Fieldset>

                    <!--  PUNKT GAZOWY  -->
                    <Fieldset :toggleable="true" class="!mb-4"
                              :disabled="gasConnection.workRangeGasStations.length == 0"
                              :style="gasConnection.workRangeGasStations.length > 0 ? UtilsService.getStageStyleByDates('border-color',gasConnection.gasConnectionDesign.gasPointOrderDate, gasConnection.gasConnectionDesign.gasPointPickupDate): null">
                      <template #legend v-if="gasConnection.workRangeGasStations.length == 0">
                        <span>PUNKT GAZOWY</span>
                      </template>
                      <template #legend v-else>
                        <span class="font-bold"
                              :style="UtilsService.getStageStyleByDates('color',gasConnection.gasConnectionDesign.gasPointOrderDate, gasConnection.gasConnectionDesign.gasPointPickupDate)">PUNKT GAZOWY</span>
                      </template>
                      <div class="card flex flex-wrap gap-4 mb-3">
                        <div class="flex-auto">
                          <label for="gasPointOrderDate" class="mb-1 ps-1"><small> Data zamówienia </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionDesign.gasPointOrderDate"
                                            showIcon fluid :showOnFocus="false"
                                            inputId="gasPointOrderDate" dateFormat="yy-mm-dd" showButtonBar
                                            :manualInput="false"/>
                        </div>
                        <div class="flex-auto">
                          <label for="gasPointPickupDate" class="mb-1 ps-1"><small> Data odbioru punktu </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionDesign.gasPointPickupDate" showIcon
                                            fluid :showOnFocus="false"
                                            inputId="gasPointPickupDate" dateFormat="yy-mm-dd" showButtonBar
                                            :manualInput="false"/>
                        </div>
                        <div class="flex-auto">
                          <label for="gasPointDocPickupDate" class="mb-1 ps-1"><small> Data odbioru
                            dokumentów </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionDesign.gasPointDocPickupDate"
                                            showIcon fluid :showOnFocus="false"
                                            inputId="gasPointDocPickupDate" dateFormat="yy-mm-dd" showButtonBar
                                            :manualInput="false"/>
                        </div>
                        <div class="flex-auto">
                          <label for="gasPointOrderNo" class="mb-1 ps-1"><small> Numer zamówienia </small></label>
                          <InputText v-model="gasConnection.gasConnectionDesign.gasPointOrderNo" fluid
                                     inputId="gasPointOrderNo"/>
                        </div>
                      </div>
                    </Fieldset>

                    <!--  GEODEZJA  -->
                    <Fieldset :toggleable="true" class="mb-1"
                              :style="getSurveyorTrafficProjectStyle('border-color',gasConnection.gasConnectionDesign.zudpSentToSurveyorDate,  gasConnection.gasConnectionDesign.surveyorTrafficProject)">
                      <template #legend>
                        <span class="font-bold"
                              :style="getSurveyorTrafficProjectStyle('color',gasConnection.gasConnectionDesign.zudpSentToSurveyorDate,  gasConnection.gasConnectionDesign.surveyorTrafficProject)">GEODEZJA</span>
                      </template>
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="zudpSentToSurveyorDate" class="mb-1 ps-1"><small> Data wysłania </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionDesign.zudpSentToSurveyorDate"
                                            showIcon fluid :showOnFocus="false"
                                            inputId="zudpSentToSurveyorDate" dateFormat="yy-mm-dd" showButtonBar
                                            :manualInput="false"/>
                        </div>
                        <div class="flex-auto">
                          <label for="selectedTrafficSurveyor" class="block mb-0 ps-1"><small> Geodeta </small></label>
                          <InputGroup>
                            <Select v-model="selectedTrafficSurveyor" :options="surveyorStore.surveyorsCached"
                                    :loading="surveyorStore.loadingSurveyor"
                                    :optionLabel="(surveyor) => surveyor.lastName + ' ' + surveyor.name"
                                    class="w-full" id="selectedTrafficSurveyor"/>
                            <InputGroupAddon class="p-0">
                              <Button class="btn-icon" outlined icon="pi pi-eraser"
                                      :disabled="!(selectedTrafficSurveyor!==null)"
                                      @click="selectedTrafficSurveyor = null"/>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                      </div>
                    </Fieldset>
                    <div class="flex items-center">
                      <span class="ml-2"
                            :style="UtilsService.getColorByStage('color', UtilsService.checkPlotsLaneOccupationStage(gasConnection.plots))">+ zajęcie pasa</span>
                    </div>
                  </Panel>
                </TabPanel>
                <TabPanel value="1">
                  <Panel header="WŁAŚCICIELE DZIAŁEK" class="w-full mb-3 mt-3">

                    <DataTable :value="gasConnection.plots" tableStyle="min-width: 50rem" showGridlines
                               v-model:selection="selectedPlot" selectionMode="single" :rowStyle="rowStyle">
                      <Column field="plotNumber" header="Nr działki"></Column>
                      <Column field="submissionDate" header="Data złożenia">
                        <template #body="{ data }">
                          <span class="flex justify-center">&nbsp{{
                              UtilsService.formatDate(data.submissionDate)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="receiptDate" header="Data otrzymania">
                        <template #body="{ data }">
                          <span class="flex justify-center">&nbsp{{
                              UtilsService.formatDate(data.receiptDate)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="plotOwner.name" header="Właściciel"></Column>
                      <Column field="info" header="Informacje"></Column>
                    </DataTable>
                    <div class="flex flex-row justify-between mt-3">
                      <div class="flex flex-row items-center">

                        <div :style="rectangleStyle"></div>
                        <span class="ml-2"> - oznacza podmiot przyłączany</span>
                      </div>
                      <OfficeButton text="dodaj" btn-type="office-regular" @click=""/>
                    </div>
                  </Panel>
                  <Panel v-if="selectedPlot && selectedPlot?.plotOwnerPrivate?.length > 0"
                         header="WŁAŚCICIELE DZIAŁKI PRYWATNEJ" class="w-full mb-3 mt-3">

                    <DataTable :value="selectedPlot.plotOwnerPrivate" tableStyle="min-width: 50rem" showGridlines>
                      <Column field="name" header="Imię" headerStyle="padding: 4px 10px 4px 10px"></Column>
                      <Column field="lastName" header="Nazwisko" headerStyle="padding: 4px 10px 4px 10px"></Column>
                      <Column field="share" header="Udział [%]" headerStyle="padding: 4px 10px 4px 10px"></Column>
                      <Column field="submissionDate" header="Data złożenia" headerStyle="padding: 4px 10px 4px 10px">

                      </Column>
                      <Column field="receiptDate" header="Data otrzymania" headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class="flex justify-center">&nbsp{{
                              UtilsService.formatDate(data.receiptDate)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="submissionDate1" header="Data złożenia I" style="min-width: 150px"
                              headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class="flex justify-center">&nbsp{{
                              UtilsService.formatDate(data.submissionDate1)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="receiptDate1" header="Data otrzymania I" style="min-width: 150px"
                              headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class="flex justify-center">&nbsp{{
                              UtilsService.formatDate(data.receiptDate1)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="info1" header="Info I" style="min-width: 150px"
                              headerStyle="padding: 4px 10px 4px 10px"></Column>
                      <Column field="submissionDate2" header="Data złożenia II" style="min-width: 120px"
                              headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class="flex justify-center">&nbsp{{
                              UtilsService.formatDate(data.submissionDate2)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="receiptDate2" header="Data otrzymania II" style="min-width: 150px"
                              headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class="flex justify-center">&nbsp{{
                              UtilsService.formatDate(data.receiptDate2)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="info2" header="Info II" style="min-width: 120px"
                              headerStyle="padding: 4px 10px 4px 10px"></Column>
                    </DataTable>
                  </Panel>
                </TabPanel>
                <TabPanel value="2">
                  <Panel header="ZAJĘCIE I ODBIÓR PASA" class="w-full mb-3 mt-3">

                    <DataTable :value="gasConnection.plots" tableStyle="min-width: 50rem" showGridlines
                               v-model:selection="selectedPlotBuild" selectionMode="single" :rowStyle="rowStyle">
                      <Column field="plotNumber" header="Nr działki"></Column>
                      <Column field="laneOccupationPreparationDate" header="Data przygotowania">
                        <template #body="{ data }">
                          <span class="flex justify-center">&nbsp{{
                              UtilsService.formatDate(data.laneOccupationPreparationDate)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="laneOccupationSubmissionDate" header="Data złożenia" style="min-width: 100px">
                        <template #body="{ data }">
                          <span class="flex justify-center">&nbsp{{
                              UtilsService.formatDate(data.laneOccupationSubmissionDate)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="laneOccupationReceiptDate" header="Data otrzymania" style="min-width: 100px">
                        <template #body="{ data }">
                          <span class="flex justify-center">&nbsp{{
                              UtilsService.formatDate(data.laneOccupationReceiptDate)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="laneOccupationStartDate" header="Data zajęcie pasa od" style="min-width: 100px">
                        <template #body="{ data }">
                          <span class="flex justify-center">&nbsp{{
                              UtilsService.formatDate(data.laneOccupationStartDate)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="laneOccupationEndDate" header="Data zajęcie pasa do" style="min-width: 100px">
                        <template #body="{ data }">
                          <span class="flex justify-center">&nbsp{{
                              UtilsService.formatDate(data.laneOccupationEndDate)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="laneReceiptDate" header="Data odb. pasa" style="min-width: 100px">
                        <template #body="{ data }">
                          <span class="flex justify-center">&nbsp{{
                              UtilsService.formatDate(data.laneReceiptDate)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="plotOwner.name" header="Właściciel"></Column>
                      <Column field="info" header="Informacje" style="min-width: 200px"></Column>
                    </DataTable>
                    <div class="flex flex-row justify-between mt-3">
                      <div class="flex flex-row items-center">

                        <div :style="rectangleStyle"></div>
                        <span class="ml-2"> - oznacza podmiot przyłączany</span>
                      </div>
                    </div>
                  </Panel>

                  <!-- ZAWIADOMIENIE ROZDZIELNII -->
                  <Fieldset legend="Zawiadomienie rozdzielnii" :toggleable="true" class="mb-5"
                            :collapsed="UtilsService.isAllFilled([gasConnection.gasConnectionBuild.substationNotificationSubmissionDate])">
                    <div class="card flex flex-wrap gap-4">
                      <div class="flex-auto">
                        <label for="projectOrderSubmissionDate" class="ps-1"><small> Data złożenia </small></label>
                        <InputGroup>
                          <CustomDatePicker
                              v-model="gasConnection.gasConnectionBuild.substationNotificationSubmissionDate"
                              showIcon fluid :showOnFocus="false"
                              inputId="projectOrderSubmissionDate" :manualInput="false" showButtonBar
                              dateFormat="yy-mm-dd"/>
                          <InputGroupAddon v-if="true" class="p-0">
                            <Button class="btn-icon" outlined icon="pi pi-file-word"/>
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                    </div>
                  </Fieldset>

                  <!-- GEODEZJA -->
                  <Fieldset legend="Geodezja" :toggleable="true" class="mb-1"
                            :collapsed="UtilsService.isAllFilled([gasConnection.gasConnectionBuild.surveyingSketchesDate, gasConnection.gasConnectionBuild.surveyingInventoryDate])">
                    <div class="card flex flex-wrap gap-4">
                      <div class="flex-auto">
                        <label for="surveyingSketchesDate" class="ps-1"><small> Szkice </small></label>
                        <CustomDatePicker v-model="gasConnection.gasConnectionBuild.surveyingSketchesDate" showIcon
                                          fluid :showOnFocus="false"
                                          inputId="surveyingSketchesDate" :manualInput="false" showButtonBar
                                          dateFormat="yy-mm-dd">
                        </CustomDatePicker>
                      </div>
                      <div class="flex-auto">
                        <label for="surveyingInventoryDate" class="ps-1"><small> Inwentaryzacja </small></label>
                        <CustomDatePicker v-model="gasConnection.gasConnectionBuild.surveyingInventoryDate" showIcon
                                          fluid :showOnFocus="false"
                                          inputId="surveyingInventoryDate" dateFormat="yy-mm-dd" showButtonBar
                                          :manualInput="false"/>
                      </div>
                    </div>
                  </Fieldset>

                  <!-- REALIZACJA -->
                  <Fieldset legend="Realizacja" :toggleable="true" class="mb-1"
                            :collapsed="UtilsService.isAllFilled([gasConnection.gasConnectionBuild.realizationEndDate, gasConnection.gasConnectionBuild.realizationStartDate])">
                    <div class="card flex flex-wrap gap-4">
                      <div class="flex-auto">
                        <label for="realizationStartDate" class="ps-1 "><small> Data rozpoczęcia </small></label>
                        <CustomDatePicker v-model="gasConnection.gasConnectionBuild.realizationStartDate" showIcon
                                          fluid :showOnFocus="false"
                                          inputId="realizationStartDate" :manualInput="false" showButtonBar
                                          dateFormat="yy-mm-dd">
                        </CustomDatePicker>
                      </div>
                      <div class="flex-auto">
                        <label for="realizationEndDate" class="ps-1"><small> Data zakończenia </small></label>
                        <CustomDatePicker v-model="gasConnection.gasConnectionBuild.realizationEndDate" showIcon
                                          fluid :showOnFocus="false"
                                          inputId="realizationEndDate" dateFormat="yy-mm-dd" showButtonBar
                                          :manualInput="false"/>
                      </div>
                    </div>
                  </Fieldset>

                  <!--    ODBIOR WSG   -->
                  <Fieldset legend="Odbiór WSG" :toggleable="true" class="mb-1">
                    <div class="card flex flex-row gap-4">
                      <div class="w-full">
                        <label for="wsgTechnicalAcceptanceDate" class="ps-1"><small> Data odbióru
                          technicznego </small></label>
                        <InputGroup>
                          <CustomDatePicker v-model="gasConnection.gasConnectionBuild.wsgTechnicalAcceptanceDate"
                                            showIcon fluid :showOnFocus="false"
                                            inputId="wsgTechnicalAcceptanceDate" :manualInput="false" showButtonBar
                                            dateFormat="yy-mm-dd"/>
                          <InputGroupAddon v-if="true" class="p-0">
                            <Button class="btn-icon" outlined icon="pi pi-file-word"/>
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                      <div class="w-full">
                        <label for="wsgFinalAcceptanceDate" class="ps-1"><small> Data wysłania do
                          gazownii </small></label>
                        <InputGroup>
                          <CustomDatePicker v-model="gasConnection.gasConnectionBuild.wsgFinalAcceptanceDate"
                                            showIcon fluid :showOnFocus="false"
                                            inputId="wsgFinalAcceptanceDate" :manualInput="false" showButtonBar
                                            dateFormat="yy-mm-dd"/>
                        </InputGroup>
                      </div>
                      <div class="w-full">
                        <label for="wsgFinalAcceptanceSubmissionDate" class="ps-1"><small> Data odbioru
                          końcowego </small></label>
                        <InputGroup>
                          <CustomDatePicker v-model="gasConnection.gasConnectionBuild.wsgFinalAcceptanceSubmissionDate"
                                            showIcon fluid :showOnFocus="false"
                                            inputId="wsgFinalAcceptanceSubmissionDate" :manualInput="false"
                                            showButtonBar
                                            dateFormat="yy-mm-dd"/>
                        </InputGroup>
                      </div>
                    </div>
                    <div class="card flex items-center gap-4 mt-3">
                      <div class="flex flex-col  w-full">
                        <label for="technicalAcceptanceProtocolNo" class="ps-1"><small> Nr protokołu odbióru
                          technicznego </small></label>
                        <InputText v-model="gasConnection.gasConnectionBuild.technicalAcceptanceProtocolNo"
                                   type="text"
                                   inputId="technicalAcceptanceProtocolNo"/>
                      </div>
                      <div class="flex flex-col w-full">
                        <label for="gasPipelineInventoryNumber" class="ps-1"><small> Nr inwentaryzacyjny
                          gazociągu </small></label>
                        <InputText v-model="gasConnection.gasConnectionBuild.gasPipelineInventoryNumber"
                                   type="text"
                                   inputId="gasPipelineInventoryNumber"/>
                      </div>
                      <div class="flex flex-col  w-full">

                        <label for="gasConnectionRealLength" class="ps-1"><small> Długość przyłącza
                          (m) </small></label>
                        <InputNumber class="max-w-3rem" :min="0" :max="200" :maxFractionDigits="2"
                                     v-model="gasConnection.gasConnectionBuild.gasConnectionRealLength"
                                     inputId="gasConnectionRealLength"/>
                      </div>
                    </div>
                    <div class="mt-3">

                      <label for="gasConnectionRealLength" class="ps-1"><small> Uwagi </small></label>
                      <Textarea :rows="5" autoResize fluid
                                v-model="gasConnection.gasConnectionBuild.wsgInfo"></Textarea>
                    </div>
                  </Fieldset>

                  <!--    PGN   -->
                  <Fieldset v-if="gasConnection.isPGN" legend="Prace gazoniebezpieczne (PGN)" :toggleable="true"
                            class="mb-1">
                    <div class="card flex flex-row gap-4">
                      <div class="w-full">
                        <label for="workDate" class="ps-1"><small> Data wykonania </small></label>
                        <CustomDatePicker v-model="gasConnection.pgn.workDate"
                                          showIcon fluid :showOnFocus="false"
                                          inputId="workDate" :manualInput="false" showButtonBar
                                          dateFormat="yy-mm-dd"/>
                      </div>
                      <div class="flex flex-col  w-full">
                        <label for="pgnNumber" class="ps-1"><small> Nr protokołu </small></label>
                        <InputText v-model="gasConnection.pgn.pgnNumber"
                                   type="text"
                                   inputId="pgnNumber"/>
                      </div>
                    </div>
                    <div class="card flex items-center gap-4 mt-3">
                      <div class="flex flex-col  w-full">
                        <label for="technicalAcceptanceProtocolNo" class="ps-1"><small> Nr zgłoszenia </small></label>
                        <InputText v-model="gasConnection.pgn.applicationNumber"
                                   type="text"
                                   inputId="technicalAcceptanceProtocolNo"/>
                      </div>
                      <div class="flex flex-col w-full">
                        <label for="pgnRecipients" class="ps-1"><small> Przyjmujący zgłoszenie </small></label>
                        <Select v-model="selectedPgnRecipient" :options="gasConnectionStore.pgnRecipients"
                                class="w-full" id="pgnRecipients"/>
                      </div>
                    </div>
                    <div class="mt-3">

                      <label for="gasConnectionRealLength" class=" ps-1"><small> Uwagi </small></label>
                      <Textarea :rows="5" autoResize fluid
                                v-model="gasConnection.pgn.info"></Textarea>
                    </div>
                  </Fieldset>

                </TabPanel>
                <TabPanel value="3" v-if="authStore.hasAccessTasksGasConnectionFinance">
                  <!--   -->
                  <Panel header="KOSZTY" toggleable class="w-full mb-3 mt-3">
                    <!--          INWENTARYZACJA          -->
                    <Fieldset legend="Inwentaryzacja" :toggleable="true" class="mb-5">
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="financeInventoryAmount" class="mb-1 ps-1"><small> Kwota (netto) </small></label>
                          <InputNumber v-model="gasConnection.gasConnectionFinance.financeInventoryAmount"
                                       inputId="financeInventoryAmount"
                                       locale="pl-PL" mode="currency" currency="PLN"
                                       :maxFractionDigits="2" fluid/>
                        </div>
                        <div class="flex-auto">
                          <label for="financeInventoryDate" class="mb-1 ps-1"><small> Data
                            zapłaty </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionFinance.financeInventoryDate"
                                            showIcon fluid :showOnFocus="false"
                                            inputId="financeInventoryDate" dateFormat="yy-mm-dd" showButtonBar
                                            :manualInput="false"/>
                        </div>
                      </div>
                    </Fieldset>
                    <!--         PROJEKT           -->
                    <Fieldset legend="Projekt" :toggleable="true" class="mb-5">
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="financeProjectAmount" class="mb-1 ps-1"><small> Kwota (netto) </small></label>
                          <InputNumber v-model="gasConnection.gasConnectionFinance.financeProjectAmount"
                                       inputId="financeProjectAmount"
                                       locale="pl-PL" mode="currency" currency="PLN"
                                       :maxFractionDigits="2" fluid/>
                        </div>
                        <div class="flex-auto">
                          <label for="financeProjectDate" class="mb-1 ps-1"><small> Data
                            zapłaty </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionFinance.financeProjectDate"
                                            showIcon fluid :showOnFocus="false"
                                            inputId="financeProjectDate" dateFormat="yy-mm-dd" showButtonBar
                                            :manualInput="false"/>
                        </div>
                      </div>
                    </Fieldset>
                    <!--          PAS DROGOWY          -->
                    <Fieldset legend="Pas drogowy" :toggleable="true" class="mb-5">
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="financeRoadPastureAmount" class="mb-1 ps-1"><small> Kwota (netto) </small></label>
                          <InputNumber v-model="gasConnection.gasConnectionFinance.financeRoadPastureAmount"
                                       inputId="financeRoadPastureAmount"
                                       locale="pl-PL" mode="currency" currency="PLN"
                                       :maxFractionDigits="2" fluid/>
                        </div>
                        <div class="flex-auto">
                          <label for="financeRoadPastureDate" class="mb-1 ps-1"><small> Data
                            zapłaty </small></label>
                          <CustomDatePicker v-model="gasConnection.gasConnectionFinance.financeRoadPastureDate"
                                            showIcon fluid :showOnFocus="false"
                                            inputId="financeRoadPastureDate" dateFormat="yy-mm-dd" showButtonBar
                                            :manualInput="false"/>
                        </div>
                      </div>
                    </Fieldset>
                  </Panel>

                  <!--   TABELA     -->
                  <Panel header="KOSZTY DODATKOWE" toggleable class="w-full mb-3 mt-3">

                    <Toolbar class="mt-6" style="min-width: 50rem">
                      <template #start>
                        <OfficeButton btn-type="office-regular" text="Dodaj" icon="pi pi-plus" class="mr-2" @click=""/>
                        <OfficeButton btn-type="office-save" text="usuń" icon="pi pi-trash" @click=""
                                      :disabled="!selectedCosts || !selectedCosts.length"/>
                      </template>
                    </Toolbar>
                    <DataTable :value="gasConnection.gasConnectionFinance.costList" tableStyle="min-width: 50rem"
                               showGridlines
                    >
                      <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                      <Column field="lp" header="Lp" headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ index }">
                          <span class="pl-2">{{ index + 1 }}</span>
                        </template>
                      </Column>
                      <Column field="costType.name" header="Nazwa" headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class="pl-2">{{
                              data.costType.name
                            }}</span>
                        </template>
                      </Column>
                      <Column field="amount" header="Kwota netto" headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class=" pl-2">{{
                              UtilsService.formatCurrency(data.amount)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="paymentDate" header="Data zapł." headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class="pl-2">{{
                              UtilsService.formatDate(data.paymentDate)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="info" header="Informacje" headerStyle="padding: 4px 10px 4px 10px"
                              style="min-width: 150px"></Column>
                      <Column :exportable="false" style=" max-width: 80px;">
                        <template #body="slotProps">
                          <div class="flex justify-center">
                            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="console.log(slotProps)"/>
                            <Button icon="pi pi-trash" outlined rounded severity="danger" @click=""/>

                          </div>
                        </template>
                      </Column>
                    </DataTable>
                  </Panel>
                </TabPanel>
                <TabPanel value="4" v-if="authStore.hasAccessFinance">
                  <!--   TABELA     -->
                  <Panel header="FAKTURY" toggleable class="w-full mb-3 mt-3">

                    <Toolbar class="mt-6" style="min-width: 50rem">
                      <template #start>
                        <OfficeButton btn-type="office-regular" text="Dodaj" icon="pi pi-plus" class="mr-2" @click=""/>
                      </template>
                    </Toolbar>
                    <DataTable :value="invoices" tableStyle="min-width: 50rem" showGridlines
                    >
                      <Column header="Nazwa" headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class="pl-2">{{ data.idInvoiceYear }}/{{ data.idInvoiceNumber }}</span>
                        </template>
                      </Column>
                      <Column field="invoiceDate" header="Data wystawienia" headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class="pl-2">{{
                              UtilsService.formatDate(data.invoiceDate)
                            }}</span>
                        </template>
                      </Column>
                      <Column field="amountNet" header="Kwota netto" headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class=" pl-2">{{
                              UtilsService.formatCurrency(data.amountNet)
                            }}</span>
                        </template>
                      </Column>
                      <Column header="Procent" headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class=" pl-2">{{
                              UtilsService.calculatePercentagePaid(data.amountNet, gasConnection.taskValue).toFixed(2)
                            }}%</span>
                        </template>
                      </Column>
                      <ColumnGroup type="footer">
                        <Row>
                          <Column footer="Razem:" :colspan="2" footerStyle="text-align:right"/>
                          <Column :footer="amountTotal"/>
                          <Column :footer="percentTotal.toFixed(2)+'%'"/>
                        </Row>
                      </ColumnGroup>
                    </DataTable>
                  </Panel>
                </TabPanel>
                <TabPanel value="5">
                  <!--   TABELA    PRZYŁĄCZE -->
                  <Panel header="ZAKRES - PRZYŁĄCZE" toggleable class="w-full mb-3 mt-3"
                         :collapsed="+gasConnection.workRangeGasConnections.length == 0">

                    <Toolbar class="mt-6" style="min-width: 50rem">
                      <template #start>
                        <OfficeButton btn-type="office-regular" text="Dodaj" icon="pi pi-plus" class="mr-2" @click=""/>
                      </template>
                    </Toolbar>
                    <DataTable :value="gasConnection.workRangeGasConnections" tableStyle="min-width: 50rem"
                               showGridlines
                    >
                      <Column field="diameter" header="Średnica" headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class="flex justify-center">{{ data.diameter }}</span>
                        </template>
                      </Column>
                      <Column field="lengthWar" header="Dł. z warunków (m)" headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class="flex justify-center">{{ data.lengthWar }}</span>
                        </template>
                      </Column>
                      <Column field="lengthProj" header="Dł. z projektu (m)" headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class="flex justify-center">{{ data.lengthProj }}</span>
                        </template>
                      </Column>
                      <Column field="gasCabinetProviderType" header="Szafka" headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span class="flex justify-center">{{ data.gasCabinetProviderType.viewValue }}</span>
                        </template>
                      </Column>
                      <Column field="gasCabinetPickupDate" header="Data odb. szafki"
                              headerStyle="padding: 4px 10px 4px 10px">
                        <template #body="{ data }">
                          <span
                              class="flex justify-center">{{ UtilsService.formatDate(data.gasCabinetPickupDate) }}</span>
                        </template>
                      </Column>
                      <Column header="info" headerStyle="padding: 4px 10px 4px 10px; min-width: 180px">
                        <template #body="{ data }">
                          <span class="pl-2">{{ data.info }}</span>
                        </template>
                      </Column>
                    </DataTable>
                  </Panel>

                  <!--   TABELA  STACJA   -->
                  <Panel header="ZAKRES - STACJA" toggleable class="w-full mb-3 mt-3"
                         :collapsed="+gasConnection.workRangeGasStations.length == 0">

                    <Toolbar class="mt-6" style="min-width: 50rem">
                      <template #start>
                        <OfficeButton btn-type="office-regular" text="Dodaj" icon="pi pi-plus" class="mr-2" @click=""/>
                      </template>
                    </Toolbar>
                    <DataTable :value="gasConnection.workRangeGasStations" tableStyle="min-width: 50rem" showGridlines
                    >
                      <Column field="capacity" header="Przepustowość"
                              headerStyle="padding: 4px 10px 4px 10px; max-width: 60px;">
                        <template #body="{ data }">
                          <span class="flex justify-center">{{ data.capacity }}</span>
                        </template>
                      </Column>
                      <Column field="stationType" header="Rodzaj stacji" headerStyle="padding: 4px 10px 4px 10px;">
                        <template #body="{ data }">
                          <span class="pl-2">{{ data.stationType.viewValue }}</span>
                        </template>
                      </Column>
                      <Column field="amount" header="Ilość" headerStyle="padding: 4px 10px 4px 10px"
                              header-class="flex justify-center">
                        <template #body="{ data }">
                          <span class="flex justify-center">{{ data.amount }}</span>
                        </template>
                      </Column>
                      <Column header="info" headerStyle="padding: 4px 10px 4px 10px; min-width: 180px">
                        <template #body="{ data }">
                          <span class="pl-2">{{ data.info }}</span>
                        </template>
                      </Column>
                    </DataTable>
                  </Panel>

                  <Panel header="ZAKRES - WŁĄCZENIE" toggleable class="w-full mb-3 mt-3">
                    <!--    WŁĄCZENIE  -->
                    <Fieldset legend="Istniejący gazociąg" class="mb-1">
                      <div class="card flex items-center gap-4 mt-3">
                        <div class="flex-auto">
                          <label for="pressure" class="block mb-0 ps-1"><small> Ciśnienie </small></label>
                          <InputGroup>
                            <Select v-model="gasConnection.workRangeConnection.pressure"
                                    :options="commonStore.getPressureTypes()"
                                    :optionLabel="(p) => p.displayValue"
                                    class="w-full" id="pressure"/>
                            <InputGroupAddon class="p-0">
                              <Button class="btn-icon" outlined icon="pi pi-eraser"
                                      :disabled="!(gasConnection.workRangeConnection.pressure !== undefined)"
                                      @click="gasConnection.workRangeConnection.pressure = undefined"/>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                        <div class="flex-auto">
                          <label for="diameter" class="block mb-0 ps-1"><small> Średnica nominalna </small></label>
                          <InputGroup>
                            <Select v-model="gasConnection.workRangeConnection.diameter"
                                    :options="commonStore.getDiameters()"
                                    class="w-full" id="diameter"/>
                            <InputGroupAddon class="p-0">
                              <Button class="btn-icon" outlined icon="pi pi-eraser"
                                      :disabled="!(gasConnection.workRangeConnection.diameter!==undefined)"
                                      @click="gasConnection.workRangeConnection.diameter = undefined"/>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                        <div class="flex-auto">
                          <label for="material" class="block mb-0 ps-1"><small> Materiał </small></label>
                          <InputGroup>
                            <Select v-model="gasConnection.workRangeConnection.material"
                                    :options="commonStore.getMaterials()"
                                    class="w-full" id="material"/>
                            <InputGroupAddon class="p-0">
                              <Button class="btn-icon" outlined icon="pi pi-eraser"
                                      :disabled="!(gasConnection.workRangeConnection.material!==undefined)"
                                      @click="gasConnection.workRangeConnection.material = undefined"/>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                      </div>
                      <div class="mt-3">

                        <label for="workRangeConnection.info" class="ps-1"><small> Uwagi </small></label>
                        <Textarea :rows="5" autoResize fluid id="workRangeConnection.info"
                                  v-model="gasConnection.workRangeConnection.info"></Textarea>
                      </div>
                    </Fieldset>
                  </Panel>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>

        </SplitterPanel>
      </Splitter>
    </div>


    <template #footer>
      <div class="flex flex-row justify-content-end gap-2 mt-3">
        <OfficeButton text="Anuluj" btn-type="office-regular" @click="cancel"/>
        <OfficeButton text="Zapisz" btn-type="office-save" @click="save"
                      :btn-disabled="settingStore.savingSettings || !isEdit"/>
      </div>
    </template>
  </Dialog>
</template>
<style scoped>
.left-side {
  margin-right: 0.7rem !important;
  font-size: .9rem !important;
}

.right-side {
  font-weight: 600 !important;

}

.p-inputgroupaddon {
  padding: 0;
}


.p-fieldset {
  margin-bottom: 1rem !important;
}
</style>
