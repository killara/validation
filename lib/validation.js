'use strict';

const txl = require('txl');

const defaultMessages = require('./messages');
const util = require('./util');
const builtInRules = require('./rule');

class Validation {

  async validate(params, rules = {}, messages = {}) {
    params = params || {};

    const errors = [];

    for (const field in rules) {
      if (!rules[field]) { continue; }
      let ruleMap = this.parseRule(rules[field]);
      const defaultRuleMap = { required: false, bail: true };
      ruleMap = Object.assign(defaultRuleMap, ruleMap);
      if (util.isEmpty(params[field]) && ruleMap.required === false) {
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
    const rules = Validation.rules();
    if (typeof rules[ruleName] !== 'function') {
      throw new Error(`Rule \`${ruleName}\` may be not a built-in rule, please add it.`);
    }
    return rules[ruleName];
  }

  formatMessage(message, options) {
    if (Array.isArray(options)) {
      options = { _items_: options };
    }
    options = Object.assign({}, options);
    return txl(message)(options);
  }

  parseRule(rule) {
    if (typeof rule === 'string') {
      return util.parseRules(rule);
    }
    if (Array.isArray(rule)) {
      return {
        required: true,
        in: rule,
      };
    }
    if (typeof rule === 'object') return rule;
    throw new TypeError('Just support string, array and object rules');
  }

  static rules() {
    return builtInRules;
  }

  addRule(name, ruleFunc) {
    if (typeof ruleFunc !== 'function') {
      throw new TypeError('Rule should be function');
    }
    const rules = Validation.rules();
    if (rules[name]) {
      throw new Error(`Rule ${name} has existed`);
    }
    rules[name] = ruleFunc;
  }
}

module.exports = Validation;
