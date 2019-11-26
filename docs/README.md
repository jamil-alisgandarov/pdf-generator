# Simple PDF generator 

Simple library to generate **PDF** files fast and flexible using Node.js. 

***

## Used tools and technologies

- [Typescript](https://www.typescriptlang.org/) 
- [Node.js](https://nodejs.org/en/) - Generating **HTML** files based on passed data
- [Puppeteer](https://github.com/puppeteer/puppeteer) - used to generate **PDF** files
- [Express.js](https://expressjs.com/) - To accept and execute requests
- [EJS](https://ejs.co/) - Embedded JavaScript templating, to fulfill **HTML** with passed data
- [Docsify](https://docsify.js.org/#/) - Generated documentation with

## How it works?

- First it accepts request via Express.js
- `createPdf` method of `PDFGeneratorInstance` is called to generate **PDF** file
  - `browser` instance is created if there is not any. (Creating only one `browser` instance for optimization)
  - Opening new `page` for every call
  - Fullfilling and generating **HTML** string with passed data using **EJS**
  - Generating temporary **HTML** file inside `/temp` folder
  - Opening generated **HTML** in created `page`
  - Finally creates **PDF** based on that page using `page.pdf()` method of [Puppeteer](https://github.com/puppeteer/puppeteer)!
  - Remove temporarily generated **HTML** file
- `createPdf` method resolves generated **PDF**

***

## How to start?

- `docsify serve docs` - to start documentation
- `start:server` - to start express server
