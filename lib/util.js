'use strict';

function isEmpty(value) {
  return value == null || (typeof value === 'string' && value.trim().length === 0) || false;
}

function parseRules(rule) {
  const options = {};
  const ruleTokens = rule.trim().split('|');
  for (const ruleToken of ruleTokens) {
    if (!ruleToken.trim()) { continue; }
    let [ ruleName, ruleOptions ] = ruleToken.split(':', 2);
    if (typeof ruleOptions === 'undefined') {
      options[ruleName] = true;
      continue;
    }
    ruleOptions = ruleOptions.trim();
    if (!ruleOptions) {
      options[ruleName] = true;
      continue;
    }
    try {
      options[ruleName] = JSON.parse(ruleOptions);
      continue;
    } catch (e) {
      // just silent
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

function isDate(value) {
  const matched = value.toString().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (matched) {
    const year = parseInt(matched[1]);
    const month = parseInt(matched[2]);
    const day = parseInt(matched[3]);
    if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year
        && date.getMonth() === month - 1
        && date.getDate() === day;
  }
  return false;
}

function isTime(value) {
  const matched = value.toString().match(/^(\d{2}):(\d{2}):(\d{2})$/);
  if (matched) {
    const hour = parseInt(matched[1]);
    const minite = parseInt(matched[2]);
    const second = parseInt(matched[3]);
    if (hour > 23 || minite > 59 || second > 59) {
      return false;
    }
    const date = new Date(2006, 2, 2, hour, minite, second);
    return date.getFullYear() === 2006
        && date.getMonth() === 2
        && date.getDate() === 2
        && date.getHours() === hour
        && date.getMinutes() === minite
        && date.getSeconds() === second;
  }
  return false;
}

module.exports = {
  isEmpty,
  isDate,
  isTime,
  parseRules,
};
