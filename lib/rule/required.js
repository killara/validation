'use strict';

const util = require('../util');
/* eslint-disable no-unused-vars */
module.exports = field => options => params => {
  const value = params[field];
  return !util.isEmpty(value);
};
