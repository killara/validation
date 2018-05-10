'use strict';

const is = require('@killara/is');

module.exports = field => context => params => {
  let { options } = context;
  if (typeof options === 'string') {
    options = new RegExp(options);
  } else if (!is.regexp(options)) {
    throw new TypeError('Options for regexp rule should be a regular expression');
  }
  const value = params[field];
  return options.test(value);
};
