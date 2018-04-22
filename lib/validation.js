'use strict';

const txl = require('txl');

const defaultMessages = require('./messages');
const isEmpty = require('./util').isEmpty;
const rule = require('./rule');

class Validation {

  async validate(params, rules = {}, messages = {}) {
    params = params || {};

    const errors = [];

    for (const field in rules) {
      let ruleMap = this.parseRule(rules[field]);
      const defaultRuleMap = { required: false, bail: true };
      ruleMap = Object.assign(defaultRuleMap, ruleMap);
      if (isEmpty(params[field]) && ruleMap.required === false) {
        continue;
      } else {
        ruleMap.required = true;
      }
      const validators = [];
      for (const ruleName in ruleMap) {
        if (ruleName === 'bail') continue;
        const options = ruleMap[ruleName];
        let validator;
        if (typeof options === 'function') {
          validator = options;
        } else {
          validator = this.makeRule(ruleName)(field)(options);
        }
        validator.field = field;
        const message = messages[`${field}.${ruleName}`] || defaultMessages[ruleName];
        validator.message = this.formatMessage(message, options);
        if (ruleName === 'required') {
          validator.code = 'missing_field';
          validators.unshift(validator);
        } else {
          validators.push(validator);
        }
      }
      for (const v of validators) {
        let ok = false;
        try {
          ok = await Promise.resolve(v(params));
        } catch (e) {
          return Promise.reject(e);
        }
        if (ok === false) {
          const { field, message } = v;
          errors.push({
            code: v.code || 'invalid',
            field,
            message,
          });
          if (ruleMap.bail === true) {
            break;
          }
        }
      }
    }

    if (errors.length) {
      return errors;
    }
  }

  makeRule(ruleName) {
    if (typeof rule[ruleName] !== 'function') {
      throw new Error(`Rule \`${ruleName}\` may be not a built-in rule, please add it.`);
    }
    return rule[ruleName];
  }

  formatMessage(message, options) {
    options = Object.assign({}, options);
    return txl(message)(options);
  }

  parseRule(rule) {
    if (!rule) return null;
    if (Array.isArray(rule)) {
      return {
        required: true,
        in: rule,
      };
    }
    if (typeof rule === 'object') return rule;
    return null;
  }
}

module.exports = Validation;
