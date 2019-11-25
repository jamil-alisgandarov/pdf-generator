import * as puppeteer from 'puppeteer';
import { generateHtml } from '../templates';

class PDFGenerator {
    private browser: puppeteer.Browser;

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


    public createPdf = async (
        templatePath: string,
        data: any
    ) => {
        const { page } = await this.getBrowserIntance();
        const html = await generateHtml(templatePath, data);

        await page.setContent(html, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });

        const pdf = await page.pdf({ path: 'test.pdf' });

        page.close();

        return pdf;
    }
}

export const PDFGeneratorInstance = new PDFGenerator();
