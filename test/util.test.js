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

describe('isDate', () => {
  test('valid date', () => {
    expect(util.isDate('2018-01-01')).toBeTruthy();
    expect(util.isDate('2001-02-28')).toBeTruthy();
    expect(util.isDate('2000-02-29')).toBeTruthy();
    expect(util.isDate('2018-12-01')).toBeTruthy();
    expect(util.isDate('1001-01-31')).toBeTruthy();
    expect(util.isDate('1000-01-01')).toBeTruthy();
  });
  test('invalid date', () => {
    expect(util.isDate('0000-01-01')).toBeFalsy();
    expect(util.isDate('2001-00-01')).toBeFalsy();
    expect(util.isDate('2001-13-01')).toBeFalsy();
    expect(util.isDate('2001-01-32')).toBeFalsy();
    expect(util.isDate('2001-1-01')).toBeFalsy();
    expect(util.isDate('10001-01-01')).toBeFalsy();
  });
});

describe('isTime', () => {
  test('valid time', () => {
    expect(util.isTime('00:00:00')).toBeTruthy();
    expect(util.isTime('01:01:00')).toBeTruthy();
    expect(util.isTime('01:01:59')).toBeTruthy();
    expect(util.isTime('01:00:00')).toBeTruthy();
    expect(util.isTime('01:59:00')).toBeTruthy();
    expect(util.isTime('23:59:59')).toBeTruthy();
  });
  test('invalid time', () => {
    expect(util.isTime('01:01:60')).toBeFalsy();
    expect(util.isTime('010:01:60')).toBeFalsy();
    expect(util.isTime('01:60:00')).toBeFalsy();
    expect(util.isTime('24:00:00')).toBeFalsy();
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
  test('required:|numeric:len=6', () => {
    const expected = {
      required: true,
      numeric: { len: 6 },
    };
    expect(util.parseRules('required:|numeric:len=6')).toEqual(expected);
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
  test('regexp:"^[a-z0-9!()-._@#]{8,18}$"', () => {
    const expected = {
      regexp: '^[a-z0-9!()-._@#]{8,18}$',
    };
    expect(util.parseRules('regexp:"^[a-z0-9!()-._@#]{8,18}$"')).toEqual(expected);
  });
});
