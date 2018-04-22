'use strict';

module.exports = field => () => params => {
  const value = params[field];
  return [ 'yes', 'on', '1', 1, true, 'true' ].includes(value);
};
