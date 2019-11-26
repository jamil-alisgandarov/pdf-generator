import { Router } from 'express';
import { IAsanFinanceReqParams } from './models';
import { TEMPLATES_PATH } from '../../../templates/consts';
import { PDFGeneratorInstance } from '../../../src';

export const ASAN_ROUTER = Router();

ASAN_ROUTER.post('/asan-finance', (req, res) => {
    const body: IAsanFinanceReqParams = req.body;

    PDFGeneratorInstance
        .createPdf(
            '/asan/asan_finance.ejs',
            TEMPLATES_PATH + '/asan/assets',
            body
        )
        .then((pdf) => {
            res.setHeader('Content-disposition', 'attachment; filename=agreement.pdf');
            res.end(pdf);
        });
});
