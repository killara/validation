'use strict';

const { isDate, isTime } = require('../util');

module.exports = field => () => params => {
  const value = params[field];
  const [ date, time ] = value.split(' ', 2);
  if (!date || !time) return false;
  return isDate(date) && isTime(time);
};
