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
    const regexp = new RegExp(`^[a-z]{${len}}$`, 'i');
    return regexp.test(value);
  }
  return /^[a-z]+$/i.test(value);
};
