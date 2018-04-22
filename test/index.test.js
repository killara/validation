'use strict';

const validation = require('..');

describe('validation', () => {
  describe('built-in rules', () => {
    describe('bail', () => {
      test('true', () => {
        expect.assertions(1);
        const values = {
          username: 'admin123',
        };
        const rules = {
          username: {
            required: true,
            alpha: true,
            numeric: true,
          },
        };
        const expected = [
          { code: 'invalid', field: 'username', message: 'The field only contains letters.' },
        ];
        return expect(validation.validate(values, rules)).resolves.toEqual(expected);
      });
      test('false', () => {
        expect.assertions(1);
        const values = {
          username: 'admin123',
        };
        const rules = {
          username: {
            bail: false,
            required: true,
            alpha: true,
            numeric: true,
          },
        };
        const expected = [
          { code: 'invalid', field: 'username', message: 'The field only contains letters.' },
          { code: 'invalid', field: 'username', message: 'The field only contains numeric.' },
        ];
        return expect(validation.validate(values, rules)).resolves.toEqual(expected);
      });
    });
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
      test('true', () => {
        expect.assertions(1);
        const values = {
          username: 'admin',
        };
        const rules = {
          username: {
            required: true,
            alpha: true,
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

    describe('accepted', () => {
      test('true', async () => {
        expect.assertions(1);
        const values = {
          TermsofService: 'on',
        };
        const rules = {
          TermsofService: {
            required: true,
            accepted: true,
          },
        };
        await expect(validation.validate(values, rules)).resolves.toBeUndefined();
      });
    });

    describe('numeric', () => {
      test('true', () => {
        expect.assertions(1);
        const values = {
          number: '012345',
        };
        const rules = {
          number: {
            required: true,
            numeric: true,
          },
        };
        return expect(validation.validate(values, rules)).resolves.toBeUndefined();
      });
      test('{ len: 6 }', () => {
        expect.assertions(1);
        const values = {
          number: '012345',
        };
        const rules = {
          number: {
            required: true,
            numeric: { len: 6 },
          },
        };
        return expect(validation.validate(values, rules)).resolves.toBeUndefined();
      });
      test('{ len: 6 } with no matched length', async () => {
        expect.assertions(1);
        const values = {
          number: '0123456',
        };
        const rules = {
          number: {
            required: true,
            numeric: { len: 6 },
          },
        };
        const messages = {
          'number.numeric': 'The field shoud be a numeric string with length ${len}',
        };
        const expected = [{ code: 'invalid', field: 'number', message: 'The field shoud be a numeric string with length 6' }];
        await expect(validation.validate(values, rules, messages)).resolves.toEqual(expected);
      });
    });

    describe('email', () => {
      test('true', async () => {
        const values = {
          email: 'runrioter@gmail.com',
        };
        const rules = {
          email: {
            email: true,
          },
        };
        await expect(validation.validate(values, rules)).resolves.toBeUndefined();
      });
      test('false', async () => {
        const values = {
          email: 'runriotergmail.com',
        };
        const rules = {
          email: {
            email: false,
          },
        };
        const expected = [{ code: 'invalid', field: 'email', message: 'The field should be a valid email address.' }];
        await expect(validation.validate(values, rules)).resolves.toEqual(expected);
      });
    });
  });

  describe('missing rules', () => {
    describe('use empty rule', () => {
      test('{}', async () => {
        expect.assertions(1);
        await expect(validation.validate()).resolves.toBeUndefined();
      });
    });
    describe('using missing rule', () => {
      test('missing', async () => {
        expect.assertions(1);
        const values = {
          username: 'admin',
        };
        const rules = {
          username: {
            missing: true,
          },
        };
        await expect(validation.validate(values, rules)).rejects.toThrowError('Rule `missing` may be not a built-in rule, please add it.');
      });
    });
    describe('custom', () => {
      test('custom', async () => {
        expect.assertions(1);
        const values = {
          username: 'admin',
        };
        const rules = {
          username: {
            notadmin: params => params.username !== 'admin',
          },
        };
        const messages = {
          'username.notadmin': 'the field value shoud be not admin',
        };
        const expected = [{ code: 'invalid', field: 'username', message: 'the field value shoud be not admin' }];
        await expect(validation.validate(values, rules, messages)).resolves.toEqual(expected);
      });
    });
  });
});
