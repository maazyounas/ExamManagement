const fs = require('fs');
const PDFDocument = require('pdfkit');
const { parsePdfQuestions } = require('./utils/pdfParser');

const doc = new PDFDocument();
const outPath = 'test.pdf';
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
    const buffer = fs.readFileSync(outPath);
    const result = await parsePdfQuestions(buffer);
    console.log('Parsed questions:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error parsing PDF:', err);
  }
});
