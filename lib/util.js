'use strict';

exports.isEmpty = value => value == null || (typeof value === 'string' && value.trim().length === 0) || false;
exports.parseRules = parseRules;

function parseRules(rule) {
  const options = {};
  const ruleTokens = rule.trim().split('|');
  for (const ruleToken of ruleTokens) {
    if (!ruleToken.trim()) { continue; }
    const [ ruleName, ruleOptions ] = ruleToken.split(':', 2);
    if (typeof ruleOptions === 'undefined') {
      options[ruleName] = true;
      continue;
    }
    const optionTokens = ruleOptions.split(',');
    if (optionTokens.length === 1 && !~(optionTokens[0].indexOf('='))) {
      try {
        options[ruleName] = JSON.parse(optionTokens[0]);
      } catch (e) {
        options[ruleName] = true;
      }
      continue;
    }
    const ruleOptionsResolved = {};
    for (const optionToken of optionTokens) {
      const ot = optionToken.trim();
      if (!ot) { continue; }
      let [ key, value ] = ot.split('=', 2);
      if (typeof value !== 'undefined') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = undefined;
        }
      }
      ruleOptionsResolved[key] = value;
    }
    options[ruleName] = ruleOptionsResolved;
  }
  return options;
}
