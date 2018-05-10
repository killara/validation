'use strict';

const util = require('../util');

module.exports = field => () => params => {
  const value = params[field];
  return !util.isEmpty(value);
};
