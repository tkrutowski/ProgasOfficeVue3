<script setup lang="ts">
import {useSettingStore} from "@/stores/setting.ts";
import {useGasConnections} from "@/stores/gasConnections.ts";
import OfficeButton from "@/components/OfficeButton.vue";
import {onMounted, ref, watch} from "vue";
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import {GasConnection} from "@/types/GasConnection.ts";


const settingStore = useSettingStore();
const gasConnectionStore = useGasConnections();
const gasConnection = ref<GasConnection | null>(null);

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

onMounted(() => {
  console.log('MOUNTED: GasConnectionDetailsDesignDialog')
  if (settingStore.settings.userId === 0) settingStore.getSettingsFromDb();

});
watch(
    () => props.gasConnectionId,
    async () => {
      console.log('WATCH: GasConnectionDetailsDesignDialog')
      // if(props.gasConnectionId > 0)
      //gasConnection.value = await gasConnectionStore.getGasConnectionFromDb(props.gasConnectionId);
    },
    {deep: true}
)

//emit
const cancel = () => {
  emit("cancel");
};
const save = () => {
  if (gasConnection.value != null)
    emit("save", gasConnection.value);
}

const buttondisplay = ref();
</script>

<template>
  <Dialog modal class="p-fluid w-11" close-on-escape @abort="cancel">
    <template #header>
      <h2 class="color-yellow ml-5">
        Sczegóły zadania
      </h2>
    </template>
    <div class="card w-full">
      <Splitter>
        <SplitterPanel class="flex  flex-column items-center justify-center p-3" :size="30" :minSize="25">

          <Fieldset legend="Szczegóły przyłącza" class="w-full">
            <div class="card">
              <!--            <div class="field col">-->
              <!--            TODO dodać tooltip z danymi klienta albo btn z modalem-->
              <p class="m-0"><small>Klient:</small> {{ gasConnection?.customer.name }}</p>
              <p class="m-0"><small>Gmina:</small> Jaks gmina</p>
              <p class="m-0"><small>Miasto:</small> {{ gasConnection?.customer.name }}</p>
              <p class="m-0"><small>Ulica, działka:</small> {{ gasConnection?.customer.name }}</p>
              <p class="m-0"><small>Nr zlecenia:</small> {{ gasConnection?.customer.name }}</p>
              <p class="m-0"><small>Nr umowy:</small> {{ gasConnection?.customer.name }}</p>
              <p class="m-0"><small>Data umowy:</small> {{ gasConnection?.customer.name }}</p>
              <p class="m-0"><small>Termin projektu:</small> {{ gasConnection?.customer.name }}</p>
              <p class="m-0"><small>Termin odb. tech.:</small> {{ gasConnection?.customer.name }}</p>
              <!--            TODO dodać tooltip z danymi projektanta albo btn z modalem-->
              <p class="m-0"><small>Projektant:</small>Filip Lewicki</p>
              <!--            TODO dodać tooltip z danymi koordynatora albo btn z modalem-->
              <p class="m-0"><small>Koordynator:</small> 2022-12-21</p>
              <!--            TODO po dodaniu  tooltipa lub  btn z modalem można usunąć-->
              <p class="m-0"><small>Tel do klienta:</small>2022-12-21</p>
              <p class="m-0"><small>Mail do klienta:</small>tkrutowski@gmail.com</p>
              <p class="m-0"><small>Wartość projektu:</small>2022-12-21</p>
              <p class="m-0"><small>Wartość wykonawstwa:</small>145 356,33 PLN</p>
              <p class="m-0"><small>Wartość zadania:</small>2022-12-21</p>
              <p class="m-0"><small>Nr waunków:</small>W300/12345/22/2022</p>
              <p class="m-0"><small>Nr umowy przyłączeniowej:</small>2022/12345</p>
              <p class="m-0"><small>Nr SAP/UP:</small>2022-12-21</p>
            </div>
          </Fieldset>
          <Fieldset legend="Uwagi" class="w-full h-full">
<!--            <div class="card h-full">-->
              <Textarea :rows="10" fluid></Textarea>
<!--            </div>-->
          </Fieldset>

        </SplitterPanel>

        <SplitterPanel class="flex items-center justify-center" :size="70">
          <div class="card w-full">
            <Tabs value="0">
              <TabList>
                <Tab value="0">Projekt</Tab>
                <Tab value="1">Działki</Tab>
              </TabList>
              <TabPanels>
                <TabPanel value="0">
                  <Panel header="ETAP 1" toggleable class="w-full">
                    <Fieldset legend="Zlecenie projektu" :toggleable="true" class="mb-1">
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="buttondisplay" class="mb-1"><small> Data złożenia </small></label>
                          <InputGroup>
                            <DatePicker v-model="buttondisplay" showIcon fluid :showOnFocus="false"
                                        inputId="buttondisplay" :manualInput="false" showButtonBar
                                        dateFormat="yy-mm-dd"/>
                            <InputGroupAddon v-if="true" class="p-0">
                              <Button icon="pi pi-file-word"/>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                        <div class="flex-auto">
                          <label for="buttondisplay" class="mb-1"><small> Data otrzymania </small></label>
                          <InputGroup>
                            <DatePicker v-model="buttondisplay" showIcon fluid :showOnFocus="false"
                                        inputId="buttondisplay" dateFormat="yy-mm-dd" showButtonBar
                                        :manualInput="false"/>
                            <InputGroupAddon v-if="true" class="p-0">
                              <Button icon="pi pi-file-word"/>
                            </InputGroupAddon>
                          </InputGroup>
                        </div>
                      </div>
                    </Fieldset>

                    <Fieldset legend="Pełnomocnictwo" :toggleable="true" class="mb-1">
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="buttondisplay" class="mb-1"><small> Data złożenia </small></label>
                          <InputGroup>
                            <DatePicker v-model="buttondisplay" showIcon fluid :showOnFocus="false"
                                        inputId="buttondisplay" :manualInput="false" showButtonBar
                                        dateFormat="yy-mm-dd"/>
                          </InputGroup>
                        </div>
                        <div class="flex-auto">
                          <label for="buttondisplay" class="mb-1"><small> Data otrzymania </small></label>
                          <InputGroup>
                            <DatePicker v-model="buttondisplay" showIcon fluid :showOnFocus="false"
                                        inputId="buttondisplay" dateFormat="yy-mm-dd" showButtonBar
                                        :manualInput="false"/>
                          </InputGroup>
                        </div>
                      </div>
                    </Fieldset>


                    <Fieldset legend="Mapa" :toggleable="true" class="mb-1">
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="buttondisplay" class="mb-1"><small> Data złożenia </small></label>
                          <DatePicker v-model="buttondisplay" showIcon fluid :showOnFocus="false"
                                      inputId="buttondisplay" :manualInput="false" showButtonBar dateFormat="yy-mm-dd"/>
                        </div>
                        <div class="flex-auto">
                          <label for="buttondisplay" class="mb-1"><small> Data otrzymania </small></label>
                          <DatePicker v-model="buttondisplay" showIcon fluid :showOnFocus="false"
                                      inputId="buttondisplay" dateFormat="yy-mm-dd" showButtonBar :manualInput="false"/>
                        </div>
                        <div class="flex-auto">
                          <label for="buttondisplay" class="block mb-0"><small> Mapę dostarczył </small></label>
                          <Select v-model="selectedCity" :options="cities" optionLabel="name"
                                  placeholder="Select a City" class="w-full"/>
                        </div>
                        <div class="flex-auto">
                          <label for="buttondisplay" class="block mb-0"><small> Geodeta </small></label>
                          <Select v-model="selectedCity" :options="cities" optionLabel="name"
                                  placeholder="Select a City" class="w-full" disabled/>
                        </div>
                      </div>
                    </Fieldset>


                    <Fieldset legend="Wypis" :toggleable="true" class="mb-1">
                      <div class="card flex flex-wrap gap-4">
                        <div class="flex-auto">
                          <label for="buttondisplay" class="mb-1"><small> Data złożenia </small></label>
                          <DatePicker v-model="buttondisplay" showIcon fluid :showOnFocus="false"
                                      inputId="buttondisplay" :manualInput="false" showButtonBar dateFormat="yy-mm-dd"/>
                        </div>
                        <div class="flex-auto">
                          <label for="buttondisplay" class="mb-1"><small> Data otrzymania </small></label>
                          <InputGroup>
                            <DatePicker v-model="buttondisplay" showIcon fluid :showOnFocus="false"
                                        inputId="buttondisplay" :manualInput="false" showButtonBar dateFormat="yy-mm-dd"/>
                          </InputGroup>
                        </div>
                      </div>
                    </Fieldset>


                    <Fieldset legend="Współrzędne" :toggleable="true" class="mb-1">
                      <label for="buttondisplay" class="mb-1"><small> Stopnie w zapisie dziesiętnym
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

                      <label for="buttondisplay" class="mb-1 mt-5"><small> Stopnie, minuty i sekundy
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
                </TabPanel>
                <TabPanel value="1">
                  <Panel header="Wybierz kolumny widoczne w tabeli">

                    <div class="card">
                      PANEL1
                    </div>
                  </Panel>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>

        </SplitterPanel>
      </Splitter>
    </div>


    <template #footer>
      <div class="flex flex-row justify-content-end gap-2">
        <OfficeButton text="Anuluj" btn-type="office-regular" @click="cancel"/>
        <OfficeButton text="Zapisz" btn-type="office-save" @click="save" :btn-disabled="settingStore.savingSettings"/>
      </div>
    </template>
  </Dialog>
</template>
<style scoped>

</style>
