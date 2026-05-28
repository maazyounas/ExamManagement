const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

const outPath = path.join(__dirname, 'temp_test.pdf');
const doc = new PDFDocument();
const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

doc.fontSize(12).text('What is 2+2?');
doc.moveDown();
doc.text('A. 3');
doc.text('B. 4');
doc.text('C. 5');
doc.text('D. 6');
doc.moveDown();
doc.text('Answer: B');
doc.end();

stream.on('finish', async () => {
  try {
    const { parsePdfQuestions } = require('./backend/utils/pdfParser');
    const buffer = fs.readFileSync(outPath);
    const result = await parsePdfQuestions(buffer);
    console.log('Parsed:', JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('Error during parse:', e);
  }
});
