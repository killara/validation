'use strict';

module.exports = field => context => params => {
  const { options } = context;
  let fieldname_confirmed = `${field}_confirmation`;
  if (typeof options === 'string') {
    fieldname_confirmed = options;
  }
  return params[field] === params[fieldname_confirmed];
};
