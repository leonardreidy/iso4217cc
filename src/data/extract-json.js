/**
  File: extract-json.js
  Description: Rough and ready NodeJS script for parsing and extracting currency related
  data from a suitably prepared CSV file. The original source file may be
  found here: https://www.currency-iso.org/en/home/tables/table-a1.html,
  specifically List One. The file was downloaded, unnecessary columns and rows
  were removed and the file was saved as CSV (ISO-4217.csv).
  TODO - Generalise to make a more useful module for parsing target file.
*/
const csv = require('csv-parser');
const fs = require('fs');

const results = [];

fs.createReadStream('./ISO-4217.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    const interim = {};
    results.map((item) => {
      interim[`${item.ENTITY.toLowerCase()}`] = {
        entity: item.ENTITY,
        currency: item.Currency,
        alphabeticCode: item['Alphabetic Code'],
        numericCode: item['Numeric Code'],
        minorUnit: item['Minor unit'],
      };
      const jsonString = JSON.stringify(interim);
      fs.writeFile('./currencies.json', jsonString, (err) => {
        if (err) {
          console.log('Error writing file', err);
        } else {
          console.log('Successfully wrote file');
        }
      });
      return item;
    });
  });

fs.close();
