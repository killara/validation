'use strict';

const { isTime } = require('../util');

module.exports = field => () => params => {
  const value = params[field];
  return isTime(value);
};
