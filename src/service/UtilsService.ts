import moment from "moment/moment";
import {TaskStatus} from "@/types/TaskStatus.ts";
import {useSettingStore} from "@/stores/setting.ts";

export const UtilsService = {
    formatCurrency(value: number | undefined) {
        if (value && !Number.isNaN(value))
            return value.toLocaleString("pl-PL", {
                style: "currency",
                currency: "PLN",
            });
    },


    formatDate(value: Date) {
        const result = moment(value).format("YYYY-MM-DD");
        return (result === "0001-01-01" || result === "Invalid date") ? "" : result;
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
    getStageTagStyle  (value: number)  {
        const settingStore= useSettingStore();
        switch (value) {
            case 0:
            case 2:
            case 4:
            case 6:
                return {
                    backgroundColor: settingStore.settings.gasConnectionSettings.colorSubmission
                };

            case 1:
            case 3:
            case 5:
            case 7:
                return {
                    backgroundColor: settingStore.settings.gasConnectionSettings.colorReceipt
                };

            default:
                return null;
        }
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

};
