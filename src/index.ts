import * as puppeteer from 'puppeteer';
import * as cuid from 'cuid';

import { HTMLFile } from './HTMLFile';
import { generateHtml } from '../templates';
import { PDF_CONFIG } from '../application/consts';

process.setMaxListeners(0);

interface IPDFGeneratorOptions {
    templatePath: string,
    resourcesPath: string,
    data: any,
    pdfConfiguration?: puppeteer.PDFOptions,
    fileNamePrefix?: string,
}

class PDFGenerator {
    private browser: puppeteer.Browser;
    private pdfConfiguration: puppeteer.PDFOptions;

    constructor (pdfOptions?: puppeteer.PDFOptions) {
        this.pdfConfiguration = pdfOptions || PDF_CONFIG;
        this.setupBrowser();
    }

    private setupBrowser = async () => {
        this.browser = await puppeteer.launch({ headless: true });

        this.browser.on('disconnected', () => {
            console.log('Browser disconnected trying to reconnect');
            this.setupBrowser();
        })
    };

    private generateHtmlWithData = async (
        templatePath: string,
        resourcesPath: string,
        data: any
    ) => {
        return await generateHtml(templatePath, { ...data, resourcesPath });
    }

    private getFileName = (fileNamePrefix?: string): string => {
        let name = `${cuid()}.pdf`;

        if (fileNamePrefix) {
            name = fileNamePrefix + '-' + name;
        }

        return name;
    }

    public createPdf = async ({
        templatePath,
        resourcesPath,
        data,
        pdfConfiguration = this.pdfConfiguration,
        fileNamePrefix,
    }: IPDFGeneratorOptions) => {
        try {
            const page = await this.browser.newPage();
            console.log('Opened new page');

            const html = await this.generateHtmlWithData(templatePath, resourcesPath, data);
            const fileInstance = new HTMLFile();
            await fileInstance.generateHtmlAndSave(html);

            await page.goto(fileInstance.getFilePath(), { timeout: 0 });

            const pdf = await page.pdf(pdfConfiguration);

            await fileInstance.deleteFile();

            await page.close();
            console.log('Closed page');

            return {
                pdf,
                name: this.getFileName(fileNamePrefix),
            };
        } catch (e) {
            console.log(e);
        }
    }
}

export const PDFGeneratorInstance = new PDFGenerator();
