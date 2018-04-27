'use strict';

module.exports = field => () => params => {
  const value = params[field];
  const matched = value.toString().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (matched) {
    const year = parseInt(matched[1]);
    const month = parseInt(matched[2]);
    const day = parseInt(matched[3]);
    if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year
        && date.getMonth() === month - 1
        && date.getDate() === day;
  }
  return false;
};
