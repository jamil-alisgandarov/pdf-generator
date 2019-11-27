import * as puppeteer from 'puppeteer';
import * as cuid from 'cuid';
import * as logger from 'fancy-log';

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
        try {
            this.browser = await puppeteer.launch({ headless: true });
            logger.info('Browser launched');
        } catch (err) {
            logger.error(`Couldn't launch the browser, trying again.`)
            await this.setupBrowser();
        }

        this.browser.on('disconnected', () => {
            logger.warn('Browser disconnected, trying to reconnect');
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

    private getUniqueFileName = (fileNamePrefix?: string): string => {
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
            logger.info('Opened new page');

            const html = await this.generateHtmlWithData(templatePath, resourcesPath, data);
            const fileInstance = new HTMLFile();

            try {
                await fileInstance.generateHtmlAndSave(html);
                logger.info('Generated HTML file');
            } catch (err) {
                logger.error(`Couldn't generate HTML file `, err);
            }

            await page.goto(fileInstance.getFilePath(), { timeout: 0 });

            let pdf: Buffer;
            try {
                pdf = await page.pdf(pdfConfiguration);
                logger.info('Generated PDF file');
            } catch (err) {
                logger.error(`Couldn't generate PDF `, err);
            }

            await fileInstance.deleteFile();

            try {
                await page.close();
                logger.info('Closed page');
            } catch (err) { }

            return {
                pdf,
                name: this.getUniqueFileName(fileNamePrefix),
            };
        } catch (e) {
            logger.error(e);
        }
    }
}

export const PDFGeneratorInstance = new PDFGenerator();
