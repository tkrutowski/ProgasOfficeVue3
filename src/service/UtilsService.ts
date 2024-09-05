import moment from "moment/moment";
import {TaskStatus} from "@/types/TaskStatus.ts";
import {useSettingStore} from "@/stores/setting.ts";
import {useAuthorizationStore} from "@/stores/authorization.ts";
import {Plot, PlotOwnerPrivate} from "@/types/Plot.ts";
import CustomColor, {StageType} from "@/types/Enums.ts";

const  PRIVATE_OWNER_ID = 5;

export const UtilsService = {
    formatCurrency(value: number | undefined) {
        const authStore = useAuthorizationStore();
        if (value && !Number.isNaN(value))
            return authStore.hasAccessFinance ? value.toLocaleString("pl-PL", {
                style: "currency",
                currency: "PLN",
            }) : "XXX,XX zł";
    },


    formatDate(value: Date | string | undefined) {
        if (!value) return "";
        const result = moment(value).format("YYYY-MM-DD");
        return (result === "0001-01-01" || result === "Invalid date") ? "" : result;
    },

    calculatePercentagePaid(amountPaid: number, totalInvoiceAmount: number) {
    return (amountPaid / totalInvoiceAmount) * 100;
},

   isAllFilled(values: (Date | string | undefined)[]): boolean {
    return values.every(value => {
        if (value instanceof Date) {
            return true; // Jeśli wartość jest datą, to uznajemy ją za wypełnioną
        } else if (typeof value === 'string') {
            return this.formatDate( value).trim().length > 0; // Jeśli wartość jest stringiem, to uznajemy ją za wypełnioną, jeśli nie jest pustym stringiem
        } else {
            return false; // undefined lub inny typ uznajemy za niewypełniony
        }
    });
},

    getStatus(name: string): TaskStatus {
        switch (name) {
            case 'ALL':
                return {name: 'ALL', viewName: "Wszystkie"}
            case 'FINISHED':
                return {name: 'FINISHED', viewName: "Zrealizowane"}
            case 'NOT_FINISHED':
                return {name: 'NOT_FINISHED', viewName: "Niezrealizowane"}
            case 'OVER_DUE':
                return {name: 'OVER_DUE', viewName: "Przeterminowane"}
            case 'NOT_FINISHED_TECH':
                return {name: 'NOT_FINISHED_TECH', viewName: "Odbiór techniczny"}
            case 'NOT_FINISHED_END':
                return {name: 'NOT_FINISHED_END', viewName: "Odbiór końcowy"}
            default:
                return {name: 'NOT_FINISHED', viewName: "Niezrealizowane"}
        }
    },

    getMapDelivery(code: number) {
        console.log('getMapDelivery', code);
        switch (code) {
            case 1:
                return {name: 'Geodeta', code: 1}
            case 2:
                return {name: 'Klient', code: 2}
            case 3:
                return {name: 'Ośrodek', code: 3}
            default:
                return {name: null, code: null}
        }
    },

    getStageAsString(value: number): string | null {
        let result = null;
        switch (value) {
            case 0:
            case 1:
                result = "ETAP 1";
                break;
            case 2:
            case 3:
                result = "ETAP 2";
                break;
            case 4:
            case 5:
                result = "ETAP 3";
                break;
            case 6:
            case 7:
                result = "ETAP 4";
                break;
        }
        // console.log("STAGE: ", value, result)
        return result;
    },
    getStyleByStage(value: number) {
        const settingStore = useSettingStore();
        switch (value) {
            case 0:
            case 2:
            case 4:
            case 6:
                return {
                    backgroundColor: settingStore.settings.gasConnectionSettings.colorSubmission,
                    color: UtilsService.getContrastTextColor(settingStore.settings.gasConnectionSettings.colorSubmission)
                }

            case 1:
            case 3:
            case 5:
            case 7:
                return {
                    backgroundColor: settingStore.settings.gasConnectionSettings.colorReceipt,
                    color: UtilsService.getContrastTextColor(settingStore.settings.gasConnectionSettings.colorReceipt)
                }

            default:
                return null;
        }
    },
    getCustomColor(style: string, color: CustomColor): string | null {
        const settingStore = useSettingStore();
        switch (color) {
            case "SUBMISSION":
                return `${style}: ${settingStore.settings.gasConnectionSettings.colorSubmission}`
            case "RECEIPT":
                return `${style}: ${settingStore.settings.gasConnectionSettings.colorReceipt}`
            case "EMPTY":
                return `${style}: ${settingStore.settings.gasConnectionSettings.colorOverdue}`
            default:
                return null;
        }
    },

    getColorByStage(style: string, stage: StageType): string | null {
        const settingStore = useSettingStore();
        switch (stage.name) {
            case "YELLOW":
                return `${style}: ${settingStore.settings.gasConnectionSettings.colorSubmission}`
            case "GREEN":
                return `${style}: ${settingStore.settings.gasConnectionSettings.colorReceipt}`
            case "LACK":
                return `${style}: ${settingStore.settings.gasConnectionSettings.colorOverdue}`
            default:
                return null;
        }
    },

    getStageStyleByDates(style: string, date1: Date | undefined, date2: Date | undefined): string | null {
        const settingStore = useSettingStore();
        const firstDate = this.formatDate(date1);
        const secondDate = this.formatDate(date2);
        if (firstDate !== "" && secondDate !== "")
            return `${style}: ${settingStore.settings.gasConnectionSettings.colorReceipt}`
        else if (firstDate !== "")
            return `${style}: ${settingStore.settings.gasConnectionSettings.colorSubmission}`
        else
            // return null;
            return `${style}: ${settingStore.settings.gasConnectionSettings.colorOverdue}`;
    },

    getRandomBrightColor() {
        // Losuj wartości dla składowych RGB z zakresu 128-255
        const r = Math.floor(Math.random() * 128) + 128;
        const g = Math.floor(Math.random() * 128) + 128;
        const b = Math.floor(Math.random() * 128) + 128;

        // Zamień wartości RGB na format szesnastkowy
        const hexR = r.toString(16).padStart(2, '0');
        const hexG = g.toString(16).padStart(2, '0');
        const hexB = b.toString(16).padStart(2, '0');

        // Połącz wartości w format koloru hex
        return `#${hexR}${hexG}${hexB}`;
    },

    getHoverColor(color: string, changeValue: number) {
        // Usuwa znak # z początku, jeśli jest obecny
        let hex = color.replace('#', '');

        // Jeśli jest w formacie krótkim (3 cyfry), zmienia na format pełny (6 cyfr)
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }

        // Konwertuje kolor z formatu hex na wartości składowe RGB
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // Zmienia wartość każdej składowej o podaną wartość (amount)
        r = Math.max(0, Math.min(255, r + changeValue));
        g = Math.max(0, Math.min(255, g + changeValue));
        b = Math.max(0, Math.min(255, b + changeValue));

        // Zamienia wartości składowe RGB z powrotem na format hex
        const hexR = r.toString(16).padStart(2, '0');
        const hexG = g.toString(16).padStart(2, '0');
        const hexB = b.toString(16).padStart(2, '0');

        // Łączy wartości w format koloru hex
        return `#${hexR}${hexG}${hexB}`;
    },

    getContrastTextColor(backgroundColor: string) {
        const rgba = backgroundColor.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
        let r = parseInt(rgba[0]);
        let g = parseInt(rgba[1]);
        let b = parseInt(rgba[2]);
        let yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? 'black' : 'white';
    },

    //
    //stage
    //
    checkPlotsStageColor(plots: Plot[], shareLimit: number): StageType {


        let stageTypes: StageType[] = [];

        if (!plots) {
            return {name: "LACK", value: -1};
        }
        plots.forEach(plot => {
            if (plot.plotOwner.id === PRIVATE_OWNER_ID && !plot.connectionEntity) {
                stageTypes.push(this.checkPrivatePlots(plot.plotOwnerPrivate, shareLimit));
            } else {
                stageTypes.push(this.checkStage(plot.submissionDate, plot.receiptDate));
            }
        });
        return this.calculateStage(stageTypes);
    },

    checkStage(submissionDate: Date | undefined, receiptDate: Date | undefined): StageType {
        let stageType: StageType = {name: "LACK", value: -1};
        if (this.formatDate(submissionDate) !== "") {
            stageType = {name: "YELLOW", value: 0}

            if (this.formatDate(receiptDate) !== "") {
                stageType = {name: "GREEN", value: 1}
            }
        }
        return stageType;
    },
    checkPrivatePlots(plotOwnerPrivate: PlotOwnerPrivate[], shareLimit: number): StageType {
        if (!plotOwnerPrivate) {
            return {name: "GREEN", value: 1};
        }
        let stageYellow = 0;
        let stageGreen = 0;
        let share = 0;
        plotOwnerPrivate.forEach(ownerPrivate => {
            if ((this.formatDate(ownerPrivate.submissionDate) !== "") || (this.formatDate(ownerPrivate.submissionDate1) !== "") || (this.formatDate(ownerPrivate.submissionDate2) !== "")) {
                stageYellow++;
                if ((this.formatDate(ownerPrivate.receiptDate) !== "") || (this.formatDate(ownerPrivate.receiptDate1) !== "") || (this.formatDate(ownerPrivate.receiptDate2) !== "")) {
                    stageGreen++;
                    share += ownerPrivate.share;
                }
            }
        })

        if (stageYellow > 0 && share < shareLimit) {
            return {name: "YELLOW", value: 0};
        }

        return (stageYellow > 0 && stageYellow == stageGreen) ? {
            name: "GREEN",
            value: 1
        } : stageYellow > 0 ? {name: "YELLOW", value: 0} : {name: "LACK", value: -1};
    },
    checkPlotsLaneOccupationStage(plots: Plot[]): StageType {

        let stageTypes: StageType[] = [];

        if (plots.length === 0) {
            return  {name: "LACK", value: -1};
        }
        plots.forEach(plot => {
            if (plot.plotOwner.id !== PRIVATE_OWNER_ID) {
                stageTypes.push(this.checkStage(plot. laneOccupationSubmissionDate, plot.laneOccupationReceiptDate));
            }
        })
        //returns GREEN if there are only private plots
        return stageTypes.length === 0 ?{name: "GREEN", value: 1} : this.calculateStage(stageTypes);
    },

    calculateStage(stages: StageType[]): StageType {
        let hasGreen = false;
        let hasYellow = false;
        let hasLack = false;

        stages.forEach(stage => {
            if (stage.name === "GREEN") {
                hasGreen = true;
            } else if (stage.name === "YELLOW") {
                hasYellow = true;
            } else {
                hasLack = true;
            }
        });

        if (hasGreen && !hasYellow && !hasLack) {
            return {name: "GREEN", value: 1}
        } else if (hasGreen || hasYellow) {
            return {name: "YELLOW", value: 0}
        } else {
            return {name: "LACK", value: -1};
        }
    },

    sendMail(email:string):void{
    // sendMail(email:string, subject: string, body:string):void{
        console.log(`Sending mail to ${email}`);
        window.location.href = `mailto:${email}`;
        // window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }

};
