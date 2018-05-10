'use strict';

const Validation = require('..');
const validation = new Validation();

describe('validation', () => {

  describe('#constructor', () => {
    test('can not create an instance of Validation with a options with a `options` properties', () => {
      expect(() => {
        new Validation({ options: {} });
      }).toThrowError('Options can not have `options` properties');
    });
  });

  describe('#parseRule', () => {
    test('just support string, array and object rules', () => {
      expect.assertions(1);
      const values = {
        username: 'admin123',
      };
      const rules = {
        username: () => {
          return {
            required: true,
            alpha: true,
            numeric: true,
          };
        },
      };
      return expect(validation.validate(values, rules)).rejects.toThrowError('Just support string, array and object rules');
    });
  });

  describe('built-in rules', () => {
    describe('object rules', () => {

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
          expect.assertions(1);
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
          expect.assertions(1);
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

      describe('in', () => {
        test('no array option', async () => {
          expect.assertions(1);
          const values = {
            likes: 'football',
          };
          const rules = {
            likes: {
              in: true,
            },
          };
          await expect(validation.validate(values, rules)).rejects.toThrowError('Rule `in` need an array options');
        });
        test('array options', async () => {
          expect.assertions(1);
          const values = {
            likes: 'football',
          };
          const rules = {
            likes: {
              in: [ 'football', 'basketball' ],
            },
          };
          await expect(validation.validate(values, rules)).resolves.toBeUndefined();
        });
      });

      describe('date', () => {
        test('not valid date', async () => {
          expect.assertions(1);
          const values = {
            date1: '0000-01-01',
            date2: '0001-00-01',
            date3: '2001-1-01',
            date4: '0001-13-01',
            date5: '0001-01-32',
            date6: '10001-01-01',
          };
          const rules = {
            date1: { date: true },
            date2: { date: true },
            date3: { date: true },
            date4: { date: true },
            date5: { date: true },
            date6: { date: true },
          };
          const expected = [
            { code: 'invalid', field: 'date1', message: 'The field shoud be a valid date' },
            { code: 'invalid', field: 'date2', message: 'The field shoud be a valid date' },
            { code: 'invalid', field: 'date3', message: 'The field shoud be a valid date' },
            { code: 'invalid', field: 'date4', message: 'The field shoud be a valid date' },
            { code: 'invalid', field: 'date5', message: 'The field shoud be a valid date' },
            { code: 'invalid', field: 'date6', message: 'The field shoud be a valid date' },
          ];
          await expect(validation.validate(values, rules)).resolves.toEqual(expected);
        });
        test('valid date', async () => {
          expect.assertions(1);
          const values = {
            date1: '2018-01-01',
            date2: '2001-02-28',
            date3: '2000-02-29',
            date4: '2018-12-01',
            date5: '1001-01-31',
            date6: '1000-01-01',
          };
          const rules = {
            date1: { date: true },
            date2: { date: true },
            date3: { date: true },
            date4: { date: true },
            date5: { date: true },
            date6: { date: true },
          };
          await expect(validation.validate(values, rules)).resolves.toBeUndefined();
        });
      });

      describe('time', () => {
        test('not valid time', async () => {
          expect.assertions(1);
          const values = {
            time: '24:00:00',
          };
          const rules = {
            time: { time: true },
          };
          const expected = [
            { code: 'invalid', field: 'time', message: 'The field shoud be a valid time' },
          ];
          await expect(validation.validate(values, rules)).resolves.toEqual(expected);
        });
        test('valid time', async () => {
          expect.assertions(1);
          const values = {
            time: '00:00:00',
          };
          const rules = {
            time: { time: true },
          };
          await expect(validation.validate(values, rules)).resolves.toBeUndefined();
        });
      });

      describe('datetime', () => {
        test('not valid datetime', async () => {
          expect.assertions(1);
          const values = {
            datetime1: '2000-13-32 24:00:00',
            datetime2: '2000-13-32',
          };
          const rules = {
            datetime1: { datetime: true },
            datetime2: { datetime: true },
          };
          const expected = [
            { code: 'invalid', field: 'datetime1', message: 'The field shoud be a valid datetime' },
            { code: 'invalid', field: 'datetime2', message: 'The field shoud be a valid datetime' },
          ];
          await expect(validation.validate(values, rules)).resolves.toEqual(expected);
        });
        test('valid datetime', async () => {
          expect.assertions(1);
          const values = {
            datetime: '2000-12-31 00:00:00',
          };
          const rules = {
            datetime: { datetime: true },
          };
          await expect(validation.validate(values, rules)).resolves.toBeUndefined();
        });
      });

      describe('money', () => {
        test('not valid money', async () => {
          expect.assertions(1);
          const values = {
            money1: '00.1',
            money2: '1.',
            money3: '011',
            money4: '11.123',
            money5: '11.0',
          };
          const rules = {
            money1: { money: { decimal: 2 } },
            money2: { money: 2 },
            money3: { money: 2 },
            money4: { money: 2 },
            money5: { money: 0 },
          };
          const expected = [
            { code: 'invalid', field: 'money1', message: 'The field value shoud be a money format' },
            { code: 'invalid', field: 'money2', message: 'The field value shoud be a money format' },
            { code: 'invalid', field: 'money3', message: 'The field value shoud be a money format' },
            { code: 'invalid', field: 'money4', message: 'The field value shoud be a money format' },
            { code: 'invalid', field: 'money5', message: 'The field value shoud be a money format' },
          ];
          await expect(validation.validate(values, rules)).resolves.toEqual(expected);
        });
        test('valid money', async () => {
          expect.assertions(1);
          const values = {
            money1: '0.1',
            money2: '0.11',
            money3: '12',
            money4: '12.12',
            money5: '0',
            money6: '10',
          };
          const rules = {
            money1: { money: { decimal: 2 } },
            money2: { money: { decimal: 2 } },
            money3: { money: { decimal: 1 } },
            money4: { money: true },
            money5: { money: 0 },
            money6: { money: 0 },
          };
          await expect(validation.validate(values, rules)).resolves.toBeUndefined();
        });
      });
    });

    describe('string rules', () => {
      describe('bail', () => {
        test('true', () => {
          expect.assertions(1);
          const values = {
            username: 'admin123',
          };
          const rules = {
            username: 'required|alpha|numeric',
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
            username: 'bail:false|required:true|alpha:true|numeric:true',
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
            username: 'required:true',
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
            username: 'required: false',
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
            username: 'required:true|alpha:true',
          };
          return expect(validation.validate(values, rules)).resolves.toBeUndefined();
        });
        test('{ len: 6 }', () => {
          expect.assertions(1);
          const values = {
            username: 'admin',
          };
          const rules = {
            username: 'required:true|alpha:len=6',
          };
          const messages = {
            'username.alpha': 'The field only contains ${len} letters.',
          };
          const expected = [{ code: 'invalid', field: 'username', message: 'The field only contains 6 letters.' }];
          return expect(validation.validate(values, rules, messages)).resolves.toEqual(expected);
        });
        test('alpha:6', () => {
          expect.assertions(1);
          const values = {
            username: 'admin',
          };
          const rules = {
            username: 'required:true|alpha:6',
          };
          const messages = {
            'username.alpha': 'The field only contains 6 letters.',
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
            username: 'required|regexp:{}',
          };
          await expect(validation.validate(values, rules)).rejects.toThrowError('Options for regexp rule should be a regular expression');
        });
        test('/^123456$/', async () => {
          expect.assertions(1);
          const values = {
            password: '123456',
          };
          const rules = {
            password: 'required|regexp:"^123456$"',
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
            TermsofService: 'required:true|accepted',
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
            number: 'required|numeric',
          };
          return expect(validation.validate(values, rules)).resolves.toBeUndefined();
        });
        test('{ len: 6 }', () => {
          expect.assertions(1);
          const values = {
            number: '012345',
          };
          const rules = {
            number: 'required|numeric:len=6',
          };
          return expect(validation.validate(values, rules)).resolves.toBeUndefined();
        });
        test('numeric:6', () => {
          expect.assertions(1);
          const values = {
            number: '012345',
          };
          const rules = {
            number: 'required|numeric:6',
          };
          return expect(validation.validate(values, rules)).resolves.toBeUndefined();
        });
        test('{ len: 6 } with no matched length', async () => {
          expect.assertions(1);
          const values = {
            number: '0123456',
          };
          const rules = {
            number: 'required|numeric:len=6',
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
            email: 'email:true',
          };
          await expect(validation.validate(values, rules)).resolves.toBeUndefined();
        });
        test('invalid email', async () => {
          const values = {
            email: 'runriotergmail.com',
          };
          const rules = {
            email: 'email:true',
          };
          const expected = [{ code: 'invalid', field: 'email', message: 'The field should be a valid email address.' }];
          await expect(validation.validate(values, rules)).resolves.toEqual(expected);
        });
      });

      describe('date', () => {
        test('not valid date', async () => {
          expect.assertions(1);
          const values = {
            date1: '0000-01-01',
            date2: '0001-00-01',
            date3: '2001-1-01',
            date4: '0001-13-01',
            date5: '0001-01-32',
            date6: '10001-01-01',
          };
          const rules = {
            date1: 'date',
            date2: 'date',
            date3: 'date',
            date4: 'date',
            date5: 'date',
            date6: 'date',
          };
          const expected = [
            { code: 'invalid', field: 'date1', message: 'The field shoud be a valid date' },
            { code: 'invalid', field: 'date2', message: 'The field shoud be a valid date' },
            { code: 'invalid', field: 'date3', message: 'The field shoud be a valid date' },
            { code: 'invalid', field: 'date4', message: 'The field shoud be a valid date' },
            { code: 'invalid', field: 'date5', message: 'The field shoud be a valid date' },
            { code: 'invalid', field: 'date6', message: 'The field shoud be a valid date' },
          ];
          await expect(validation.validate(values, rules)).resolves.toEqual(expected);
        });
        test('valid date', async () => {
          expect.assertions(1);
          const values = {
            date1: '2018-01-01',
            date2: '2001-02-28',
            date3: '2000-02-29',
            date4: '2018-12-01',
            date5: '1001-01-31',
            date6: '1000-01-01',
          };
          const rules = {
            date1: 'date',
            date2: 'date',
            date3: 'date',
            date4: 'date',
            date5: 'date',
            date6: 'date',
          };
          await expect(validation.validate(values, rules)).resolves.toBeUndefined();
        });
      });

      describe('time', () => {
        test('not valid time', async () => {
          expect.assertions(1);
          const values = {
            time: '24:00:00',
          };
          const rules = {
            time: 'time',
          };
          const expected = [
            { code: 'invalid', field: 'time', message: 'The field shoud be a valid time' },
          ];
          await expect(validation.validate(values, rules)).resolves.toEqual(expected);
        });
        test('valid time', async () => {
          expect.assertions(1);
          const values = {
            time: '00:00:00',
          };
          const rules = {
            time: 'time',
          };
          await expect(validation.validate(values, rules)).resolves.toBeUndefined();
        });
      });

      describe('datetime', () => {
        test('not valid datetime', async () => {
          expect.assertions(1);
          const values = {
            datetime1: '2000-13-32 24:00:00',
            datetime2: '2000-13-32',
          };
          const rules = {
            datetime1: 'datetime',
            datetime2: 'datetime',
          };
          const expected = [
            { code: 'invalid', field: 'datetime1', message: 'The field shoud be a valid datetime' },
            { code: 'invalid', field: 'datetime2', message: 'The field shoud be a valid datetime' },
          ];
          await expect(validation.validate(values, rules)).resolves.toEqual(expected);
        });
        test('valid datetime', async () => {
          expect.assertions(1);
          const values = {
            datetime: '2000-12-31 00:00:00',
          };
          const rules = {
            datetime: 'datetime',
          };
          await expect(validation.validate(values, rules)).resolves.toBeUndefined();
        });
      });

      describe('money', () => {
        test('not valid money', async () => {
          expect.assertions(1);
          const values = {
            money1: '00.1',
            money2: '1.',
            money3: '011',
            money4: '11.123',
            money5: '11.0',
          };
          const rules = {
            money1: 'money:decimal=2',
            money2: 'money:2',
            money3: 'money:2',
            money4: 'money:2',
            money5: 'money:0',
          };
          const expected = [
            { code: 'invalid', field: 'money1', message: 'The field value shoud be a money format' },
            { code: 'invalid', field: 'money2', message: 'The field value shoud be a money format' },
            { code: 'invalid', field: 'money3', message: 'The field value shoud be a money format' },
            { code: 'invalid', field: 'money4', message: 'The field value shoud be a money format' },
            { code: 'invalid', field: 'money5', message: 'The field value shoud be a money format' },
          ];
          await expect(validation.validate(values, rules)).resolves.toEqual(expected);
        });
        test('valid money', async () => {
          expect.assertions(1);
          const values = {
            money1: '0.1',
            money2: '0.11',
            money3: '12',
            money4: '12.12',
            money5: '0',
            money6: '10',
          };
          const rules = {
            money1: 'money:decimal=2',
            money2: 'money:decimal=2',
            money3: 'money:decimal=2',
            money4: 'money',
            money5: 'money:0',
            money6: 'money:0',
          };
          await expect(validation.validate(values, rules)).resolves.toBeUndefined();
        });
      });
    });

    describe('array rules', () => {
      test('array rule is short for `in` rule', async () => {
        expect.assertions(1);
        const values = {
          likes: 'football',
        };
        const rules = {
          likes: [ 'football', 'basketball' ],
        };
        await expect(validation.validate(values, rules)).resolves.toBeUndefined();
      });
    });
  });

  describe('missing rules', () => {
    describe('use empty rule', () => {
      test('{}', async () => {
        expect.assertions(1);
        await expect(validation.validate()).resolves.toBeUndefined();
      });
      test('with field', async () => {
        expect.assertions(1);
        const values = {
          username: 'admin',
          password: 'admin',
        };
        const rules = {
          username: null,
        };
        await expect(validation.validate(values, rules)).resolves.toBeUndefined();
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

  describe('#addRule', () => {
    test('custom rule', async () => {
      expect.assertions(1);
      const values = {
        captcha: '01234abc',
        captcha1: '01234abcd',
      };
      const rules = {
        captcha: {
          required: true,
          captcha: { len: 8 },
        },
        captcha1: {
          required: true,
          captcha: { len: 8 },
        },
      };
      validation.addRule('captcha', field => context => params => {
        let { options } = context;
        options = Object.assign({ len: 0 }, options);
        const value = params[field];
        const { len } = options;
        if (len) {
          const regexp = new RegExp(`^[0-9a-z]{${len}}$`);
          return regexp.test(value);
        }
        return /^[0-9a-z]+$/.test(value);
      });
      const expected = [
        { code: 'invalid', field: 'captcha1', message: 'the captcha should be 8 length.' },
      ];
      await expect(validation.validate(values, rules, { 'captcha1.captcha': 'the captcha should be ${len} length.' })).resolves.toEqual(expected);
    });
    test('throw Error', () => {
      expect(() => validation.addRule('captcha', {})).toThrowError('Rule should be function');
      expect(() => {
        validation.addRule('alpha', () => {});
      }).toThrowError('Rule alpha has existed');
    });
  });

  describe('#addMessage', () => {
    test('custom message', () => {
      validation.addMessage('captcha', 'the captcha should be 8 length.');
      const got = validation.constructor.messages().captcha;
      expect(got).toEqual('the captcha should be 8 length.');
    });
    test('throw Error', () => {
      expect(() => {
        validation.addMessage('captcha', () => {});
      }).toThrowError('Message should be a string');
      expect(() => {
        validation.addMessage('required', 'another message');
      }).toThrowError('Message required has existed. Use validate function param instead.');
    });
  });
});

