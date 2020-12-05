const path = require('path');
const get = require('lodash/get');

module.exports = path.dirname(get(process, 'mainModule.filename'));
// ^^^ root project directory
