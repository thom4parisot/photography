#! /usr/bin/env node

const gm = require('gm');
const each = require('each-async');

const [,, maxSize, ...files] = process.argv;

each(files, (filepath, index, next) => {
  gm(filepath)
    .size((err, size) => {
      if (size.height > maxSize && size.width > maxSize) {
        gm(filepath)
          .resize(maxSize, maxSize, '>')
          .noProfile()
          .write(filepath, err => {
            console.log(`${err ? '✘' : '✔'} ${filepath}`);
            next();
          });
      }
      else {
        console.log(`⊝ ${filepath}`);
        next();
      }
    });
});
