import {Customer} from "@/types/Customer.ts";
import {PaymentMethod, Vat} from "@/types/Invoice.ts";

export interface InvoiceCorrection {
    idInvoiceCorrectionNumber: number;
    idInvoiceCorrectionYear: number;
    idInvoiceNumber: number;
    idInvoiceYear: number;
    customer:Customer;
    paymentMethod:PaymentMethod;
    sellDate: undefined | Date;
    paymentDate: undefined | Date;
    amountNet: number;
    amountVat: number;
    amountGross: number;
    paid: boolean;
    invoiceDate: undefined | Date;
    invoiceItems: InvoiceCorrectionItem[];
}


export interface InvoiceCorrectionItem {
    idInvoiceItem: number;
    idInvoiceNumber: number;
    idInvoiceYear: number;
    name: string;
    pkwiu: string;
    unit: string;
    quantity: number;
    priceNet: number;
    amountNet: number;
    amountVat: number;
    amountGross: number;
    vat: Vat;
}