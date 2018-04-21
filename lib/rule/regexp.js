'use strict';

const is = require('@killara/is');

module.exports = field => options => params => {
  if (!is.regexp(options)) {
    throw new TypeError('Options for regexp rule should be a regular expression');
  }
  const value = params[field];
  return options.test(value);
};
