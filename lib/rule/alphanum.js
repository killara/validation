'use strict';

module.exports = field => context => params => {
  let { options } = context;
  if (typeof options === 'number') {
    options = { len: ~~options };
  } else {
    options = Object.assign({ len: 0 }, options);
  }
  const value = params[field];
  const { len } = options;
  if (len) {
    const regexp = new RegExp(`^[0-9a-z]{${len}}$`, 'i');
    return regexp.test(value);
  }
  return /^[0-9a-z]+$/i.test(value);
};
