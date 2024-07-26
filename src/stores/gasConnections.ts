import {defineStore} from "pinia";
import httpCommon from "../http-common";
import {ErrorService} from "../service/ErrorService";
import {GasConnection} from "@types/GasConnection.ts";

export const useGasConnections = defineStore("gasConnections", {
    state: () => ({
        loadingGasConnection: false,
    }),

    //getters = computed
    getters: {
        // getSortedInvoices: (state) =>
        //   state.invoices.sort((a, b) => a.idInvoice - b.idInvoice),
    },

    //actions = metody w komponentach
    actions: {
        //----------------------------------DATABASE-----------------------
        //
        //GET   GASCONNECTION BY ID
        //
        async getGasConnectionFromDb(id: number): Promise<GasConnection> {
            console.log("START - getGasConnectionQueryFromDb(" + id + ")");
            this.loadingGasConnectio = true;

            try {
                const response = await httpCommon.get(`/v1/gasconnection/` + id);
                return response.data;
            } catch (e) {
                if (ErrorService.isAxiosError(e)) {
                    console.log("ERROR getGasConnectionFromDb(): ", e);
                    ErrorService.validateError(e);
                } else {
                    console.log("An unexpected error occurred: ", e);
                }
            } finally {
                this.loadingGasConnection = false;
                console.log("END - getGasConnectionFromDb()");
            }
        },
    },
});
