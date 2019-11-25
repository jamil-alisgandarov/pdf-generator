import { Router } from 'express';
import { IAsanFinanceReqParams } from './models';
import { PDFGeneratorInstance } from '../..';

export const ASAN_ROUTER = Router();

ASAN_ROUTER.post('/asan-finance', (req, res) => {
    const body: IAsanFinanceReqParams = req.body;

    PDFGeneratorInstance
        .createPdf('/asan/asan_finance,ejs', body)
        .then((pdf) => {
            res.setHeader('Content-disposition', 'attachment; filename=agreement.pdf');
            res.end(pdf);
        });
});
