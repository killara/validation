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

describe('parseRules', () => {
  test('|required:true||alpha:any', () => {
    const expected = {
      required: true,
      alpha: true,
    };
    expect(util.parseRules('|required:true||alpha:any')).toEqual(expected);
  });
  test('bail:false|required|numeric:6', () => {
    const expected = {
      bail: false,
      required: true,
      numeric: 6,
    };
    expect(util.parseRules('bail:false|required|numeric:6')).toEqual(expected);
  });
  test('numeric:len=6', () => {
    const expected = {
      numeric: { len: 6 },
    };
    expect(util.parseRules('numeric:len=6')).toEqual(expected);
  });
  test('numeric:len=6, |required', () => {
    const expected = {
      numeric: { len: 6 },
      required: true,
    };
    expect(util.parseRules('numeric:len=6, |required')).toEqual(expected);
  });
  test('numeric:len=6,size', () => {
    const expected = {
      numeric: { len: 6, size: undefined },
    };
    expect(util.parseRules('numeric:len=6,size')).toEqual(expected);
  });
  test('numeric:len=any', () => {
    const expected = {
      numeric: { len: undefined },
    };
    expect(util.parseRules('numeric:len=any')).toEqual(expected);
  });
  test('regexp:"^123456$"', () => {
    const expected = {
      regexp: '^123456$',
    };
    expect(util.parseRules('regexp:"^123456$"')).toEqual(expected);
  });
});
