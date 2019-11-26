## class: PDFGenerator

***

### method: createPdf(templatePath, resourcesPath, data, pdfConfiguration)

- `templatePath` <String> - is used to show the direction of base template from `/templates` dir
- `resourcesPath` <String> - direction of template assets (CSS, IMGs and etc.)
- `data` <any> - The data that will be used inside template
- `pdfConfiguration` [<puppeteer.PDFOptions>](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#pagepdfoptions) - PDF Configurations
