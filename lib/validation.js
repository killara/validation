'use strict';

const txl = require('txl');

const builtInMessages = require('./messages');
const util = require('./util');
const builtInRules = require('./rule');

class Validation {

  constructor(context = {}) {
    if (context.options) {
      throw new TypeError('Options can not have `options` properties');
    }
    this.options = context;
  }

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
          const mergedOptions = Object.assign(this.options, { options });
          validator = this.constructor.makeRule(ruleName)(field)(mergedOptions);
        }
        validator.field = field;
        const message = messages[`${field}.${ruleName}`] || this.constructor.messages()[ruleName];
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

  static makeRule(ruleName) {
    const rules = this.rules();
    if (typeof rules[ruleName] !== 'function') {
      throw new Error(`Rule \`${ruleName}\` may be not a built-in rule, please add it.`);
    }
    return rules[ruleName];
  }

  formatMessage(message, options) {
    if (Array.isArray(options)) {
      options = { _items_: options };
    } else if (typeof options === 'string') {
      options = { _regexp_: options };
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
    const rules = this.constructor.rules();
    if (rules[name]) {
      throw new Error(`Rule ${name} has existed`);
    }
    rules[name] = ruleFunc;
  }

  static messages() {
    return builtInMessages;
  }

  addMessage(name, message) {
    if (typeof message !== 'string') {
      throw new TypeError('Message should be a string');
    }
    const messages = this.constructor.messages();
    messages[name] = message;
  }
}

module.exports = Validation;
