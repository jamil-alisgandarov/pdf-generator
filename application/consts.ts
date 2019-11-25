import { PDFOptions } from "puppeteer";

export const PORT = 9092;

export const PDF_CONFIG: PDFOptions = {
    printBackground: true,
    margin: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    format: 'A4',
}
