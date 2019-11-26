import { Router } from 'express';
import { IAsanFinanceReqParams } from './models';
import { TEMPLATES_PATH } from '../../../templates/consts';
import { PDFGeneratorInstance } from '../../../src';

export const ASAN_ROUTER = Router();

ASAN_ROUTER.post('/asan-finance', (req, res) => {
    const body: IAsanFinanceReqParams = req.body;
    PDFGeneratorInstance
        .createPdf({
            templatePath: '/asan/asan_finance.ejs',
            resourcesPath: TEMPLATES_PATH + '/asan/assets',
            data: body,
            fileNamePrefix: `asan-doc`,
        })
        .then(({ pdf, name }) => {
            res.setHeader('Content-disposition', `attachment; filename=${name}`);
            res.status(200);
            res.end(pdf);
        });
});
