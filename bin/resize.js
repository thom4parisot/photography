#! /usr/bin/env node

const glob = require('glob');
const gm = require('gm');
const each = require('each-async');

const [,,pattern,maxSize] = process.argv;

glob(pattern, (err, files) => {
  each(files, (filepath, index, next) => {
    gm(filepath)
      .size((err, size) => {
        if (size.height > maxSize && size.width > maxSize) {
          gm(filepath)
            .resize(maxSize, maxSize, '>')
            .noProfile()
            .write(filepath, err => {
              console.log(`${err ? '❎' : '✅'} ${filepath}`);
              next();
            });
        }
        else {
          console.log(`⏭ ${filepath}`);
          next();
        }
      });
  });
});
