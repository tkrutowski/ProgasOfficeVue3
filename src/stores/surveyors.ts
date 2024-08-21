import {defineStore} from "pinia";
import httpCommon from "../http-common";
import {ErrorService} from "../service/ErrorService";
import {ActiveStatus} from "@/types/Enums.ts";
import {Surveyor} from "@/types/Surveyor.ts";

export const useSurveyorStore = defineStore("surveyor", {
    state: () => ({
        loadingSurveyor: false,

        surveyors: [] as Surveyor[],
        surveyorsCached: [] as Surveyor[],
    }),

    //getters = computed
    getters: {
        // getSortedInvoices: (state) =>
        //   state.invoices.sort((a, b) => a.idInvoice - b.idInvoice),
    },

    //actions = metody w komponentach
    actions: {
        //
        // GET FULL NAME
        getSurveyorFullName(id:number):string{
            let result = this.surveyorsCached.find(value => value.id===id);
            return result?.name + " " + result?.lastName
        },
        refreshSurveyorCache(){
            this.getSurveyorsByStatusFromDb({name:"ALL",viewName:""})
                .then(value => this.surveyorsCached=value)
        },

        //----------------------------------DATABASE-----------------------
        //
        //
        async getSurveyorsByStatusFromDb(status: ActiveStatus): Promise<Surveyor[]> {
            console.log("START - getSurveyorsByStatusFromDb()");
            this.loadingSurveyor = true;

            try {
                const response = await httpCommon.get(`/v1/surveyor?status=` + status.name);
                console.log("getSurveyorsByStatusFromDb() - Ilosc[]: " + response.data.length);
                return response.data;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR getSurveyorsByStatusFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
                return []
            } finally {
                this.loadingSurveyor = false;
                console.log("END - getSurveyorsByStatusFromDb()");
            }
        },
    },
});
