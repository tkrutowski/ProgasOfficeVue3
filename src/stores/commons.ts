import {defineStore} from "pinia";
import httpCommon from "../http-common";
import {ErrorService} from "../service/ErrorService";
import {UtilityCompanyType} from "@/types/Commons.ts";
import {GasPressureType} from "@/types/WorkRange.ts";

export const useCommonStore = defineStore("common", {
    state: () => ({
        loadingUtilityCompanyType: false,

        utilityCompanyTypes: [] as UtilityCompanyType[],
    }),

    //getters = computed
    getters: {
        // getSortedInvoices: (state) =>
        //   state.invoices.sort((a, b) => a.idInvoice - b.idInvoice),
    },

    //actions = metody w komponentach
    actions: {
        refreshUtilityCompanyType(){
            this.getUtilityCompanyTypeFromDb()
                .then(value => this.utilityCompanyTypes=value)
        },
        getPressureTypes():GasPressureType[]{
            return [{
                "name": "LOW",
                "viewValue": "niskie",
                "displayValue": "niskie"
            },
                {
                    "name": "MEDIUM",
                    "viewValue": "srednie",
                    "displayValue": "średnie"
                },
                {
                    "name": "HIGH",
                    "viewValue": "wysokie",
                    "displayValue": "wysokie"
                }];
        },
        getDiameters():number[]{
            return [25,32,40,50,63,75,80,90,100,110,125,140,150,160,180,200,225,250,280,315,350,400,450,500];
        },
        getMaterials():string[]{return ['PE','stal']},
        //----------------------------------DATABASE-----------------------
        //
        //
        async getUtilityCompanyTypeFromDb(): Promise<UtilityCompanyType[]> {
            console.log("START - getUtilityCompanyTypeFromDb()");
            this.loadingUtilityCompanyType = true;

            try {
                const response = await httpCommon.get(`/v1/common/utilityCompanyType`);
                console.log("getUtilityCompanyTypeFromDb() - Ilosc[]: " + response.data.length);
                return response.data;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR getUtilityCompanyTypeFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
                return []
            } finally {
                this.loadingUtilityCompanyType = false;
                console.log("END - getUtilityCompanyTypeFromDb()");
            }
        },
    },
});
