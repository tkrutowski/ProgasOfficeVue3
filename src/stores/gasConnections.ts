import {defineStore} from "pinia";
import httpCommon from "../http-common";
import {ErrorService} from "../service/ErrorService";
import {GasConnection} from "@/types/GasConnection.ts";

export const useGasConnections = defineStore("gasConnections", {
    state: () => ({
        loadingGasConnection: false,
        plotsShareLimit: 51,
        pgnRecipients: ["Dąbrowski Wojciech",
            "Konrady Paweł",
            "Kowalski Włodzimierz",
            "Kubaczyk Robert",
            "Maciejewski Paweł",
            "Mager Sebastian",
            "Matuszak Tomasz",
            "Mazur Tomasz",
            "Olczak Andrzej",
            "Prętki Paweł",
            "Tomczak Krzysztof"],
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
        async getGasConnectionFromDb(id: number): Promise<GasConnection | undefined> {
            console.log("START - getGasConnectionFromDb(" + id + ")");
            this.loadingGasConnection = true;

            try {
                const response = await httpCommon.get(`/v1/gasconnection/` + id);
                console.log("getGasConnectionFromDb: ", response.data);
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
