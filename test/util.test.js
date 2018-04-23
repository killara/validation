'use strict';

const util = require('../lib/util');

describe('isEmpty', () => {
  test('null is empty', () => {
    expect(util.isEmpty(null)).toBeTruthy();
  });
  test('undefined is empty', () => {
    expect(util.isEmpty(undefined)).toBeTruthy();
  });
  test('"" is empty', () => {
    expect(util.isEmpty('')).toBeTruthy();
  });
  test('Now, {} is not empty', () => {
    expect(util.isEmpty({})).toBeFalsy();
  });
});
