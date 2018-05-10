'use strict';

module.exports = field => context => params => {
  let { options } = context;
  if (typeof options === 'number') {
    options = { decimal: ~~options };
  } else {
    options = Object.assign({ decimal: 2 }, options);
  }
  const value = params[field];
  const { decimal } = options;
  if (decimal) {
    const regexp = new RegExp(`^(0|([1-9][0-9]*))(\\.[0-9]{1,${decimal}})?$`);
    return regexp.test(value);
  }
  return /^0|[1-9][0-9]*$/.test(value);
};
