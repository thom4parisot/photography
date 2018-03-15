#! /usr/bin/env node

const gm = require('gm');
const {promisify} = require('util');
const writeFile = promisify(require('fs').writeFile);
const each = require('each-async');
const imagemin = require('imagemin');
const imageminMozJPEG = require('imagemin-mozjpeg');

const [,, maxSize, ...files] = process.argv;

const compress = (buffer) => {
  return imagemin.buffer(buffer, { plugins: [imageminMozJPEG()] });
}

each(files, (filepath, index, next) => {
  gm(filepath)
    .size((err, size) => {
      if (size.height > maxSize && size.width > maxSize) {
        gm(filepath)
          .resize(maxSize, maxSize, '>')
          .noProfile()
          .toBuffer((err, buffer) => {
            if (err) {
              console.log(`✘ ${filepath}`);
              return next();
            }

            compress(buffer)
              .then(buffer => writeFile(filepath, buffer))
              .then(() => console.log(`✔ ${filepath}`))
              .then(() => next())
              .catch(err => {
                console.log(`✘ ${filepath}`);
                next(err);
              });
          });
      }
      else {
        console.log(`⊝ ${filepath}`);
        next();
      }
    });
});
