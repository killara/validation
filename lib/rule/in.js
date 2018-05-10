'use strict';

module.exports = field => context => params => {
  const { options } = context;
  if (!Array.isArray(options)) {
    throw new TypeError('Rule `in` need an array options');
  }
  const value = params[field];
  return options.includes(value);
};
