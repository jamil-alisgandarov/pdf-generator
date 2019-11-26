import * as puppeteer from 'puppeteer';

import { HTMLFile } from './HTMLFile';
import { generateHtml } from '../templates';
import { PDF_CONFIG } from '../application/consts';

class PDFGenerator {
    private browser: puppeteer.Browser;
    private pdfConfiguration: puppeteer.PDFOptions;

    constructor (pdfOptions?: puppeteer.PDFOptions) {
        this.pdfConfiguration = pdfOptions || PDF_CONFIG;
    }

    private getBrowserIntance = async () => {
        if (!this.browser) {
            this.browser = await puppeteer.launch();
        }
        const page = await this.browser.newPage();

        return {
            browser: this.browser,
            page,
        };
    }

    private generateHtmlWithData = async (
        templatePath: string,
        resourcesPath: string,
        data: any
    ) => {
        return await generateHtml(templatePath, { ...data, resourcesPath });
    }


    public createPdf = async (
        templatePath: string,
        resourcesPath: string,
        data: any,
        pdfConfiguration: puppeteer.PDFOptions = this.pdfConfiguration
    ) => {
        const { page } = await this.getBrowserIntance();
        const html = await this.generateHtmlWithData(templatePath, resourcesPath, data);

        const fileInstance = new HTMLFile();

        await fileInstance.generateHtmlAndSave(html);
        await page.goto(fileInstance.getFilePath());

        const pdf = await page.pdf(pdfConfiguration);

        await fileInstance.deleteFile();

        page.close();

        return pdf;
    }
}

export const PDFGeneratorInstance = new PDFGenerator();
