'use strict';

const path = require('path');

hexo.extend.helper.register('remote_partial', function(moduleName, file) {

  const p = path.resolve(`./node_modules/${moduleName}/${file}.ejs`);
  console.log(p)
  console.log(hexo.theme.getView(p));

  return '';
});
