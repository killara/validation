'use strict';

const validation = require('..');

describe('validation', () => {
  describe('rules', () => {
    test('required', () => {
      const values = {
        password: 'admin',
      };
      const rules = {
        username: {
          required: true,
        },
      };
      const expected = [{ code: 'missing_field', field: 'username', message: 'The field is a must' }];
      expect(validation.validate(values, rules)).resolves.toEqual(expected);
    });
  });
});
