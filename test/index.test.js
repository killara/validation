'use strict';

const validation = require('..');

describe('validation', () => {
  describe('object rules', () => {
    describe('required', () => {
      test('true', () => {
        expect.assertions(1);
        const values = {
          password: 'admin',
        };
        const rules = {
          username: {
            required: true,
          },
        };
        const expected = [{ code: 'missing_field', field: 'username', message: 'The field is a must' }];
        return expect(validation.validate(values, rules)).resolves.toEqual(expected);
      });
      test('false', () => {
        expect.assertions(1);
        const values = {
          password: 'admin',
        };
        const rules = {
          username: {
            required: false,
          },
        };
        return expect(validation.validate(values, rules)).resolves.toBeUndefined();
      });
    });

    describe('alpha', () => {
      test('default', () => {
        expect.assertions(1);
        const values = {
          username: 'admin',
        };
        const rules = {
          username: {
            required: true,
            alpha: {},
          },
        };
        return expect(validation.validate(values, rules)).resolves.toBeUndefined();
      });
      test('{ len: 6 }', () => {
        expect.assertions(1);
        const values = {
          username: 'admin',
        };
        const rules = {
          username: {
            required: true,
            alpha: { len: 6 },
          },
        };
        const messages = {
          'username.alpha': 'The field only contains ${len} letters.',
        };
        const expected = [{ code: 'invalid', field: 'username', message: 'The field only contains 6 letters.' }];
        return expect(validation.validate(values, rules, messages)).resolves.toEqual(expected);
      });
    });

    describe('regexp', () => {
      test('no regexp should throw an exception', async () => {
        expect.assertions(1);
        const values = {
          username: 'admin',
        };
        const rules = {
          username: {
            required: true,
            regexp: {},
          },
        };
        await expect(validation.validate(values, rules)).rejects.toThrowError('Options for regexp rule should be a regular expression');
      });
      test('/^123456$/', async () => {
        expect.assertions(1);
        const values = {
          password: '123456',
        };
        const rules = {
          password: {
            required: true,
            regexp: /^123456$/,
          },
        };
        await expect(validation.validate(values, rules)).resolves.toBeUndefined();
      });
    });
  });
});
