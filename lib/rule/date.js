'use strict';

const { isDate } = require('../util');

module.exports = field => () => params => {
  const value = params[field];
  return isDate(value);
};
