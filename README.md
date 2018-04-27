# validation

A validator for HTTP request parameters.

[![npm](https://img.shields.io/npm/v/@killara/validation.svg)](https://www.npmjs.com/package/@killara/validation)
[![Travis branch](https://img.shields.io/travis/killara/validation/master.svg)](https://travis-ci.org/killara/validation)
[![Codecov branch](https://img.shields.io/codecov/c/github/killara/validation/master.svg)](https://codecov.io/github/killara/validation?branch=master)
[![David deps](https://img.shields.io/david/killara/validation.svg)](https://david-dm.org/killara/validation)
[![Known Vulnerabilities](https://snyk.io/test/npm/@killara/validation/badge.svg)](https://snyk.io/test/npm/@killara/validation)
[![npm download](https://img.shields.io/npm/dt/@killara/validation.svg)](https://www.npmjs.com/package/@killara/validation)

## Installation

```bash
npm i @killara/validation -S
```

## Features

* It supports three kinds of rule declarations. String inline rules, object rules and array rules.
* It supports async validation rule. For example, unique validation for only specific record in database table.
* It supports custom rules
* It supports custom error messages, or it uses default messages.
* WIP...

## Usage

```js
const validation = require('@killara/validation');

const values = {
  username: 'admins',
  password: 'abcdef',
  sex: 'male',
};

const rules = {
  username: 'required|alpha:6',
  password: {
    required: true,
    regexp: /^[a-z]{6,18}$/,
  },
  sex: [ 'male', 'female' ],
};

const messages = {
  'username.alpha': 'The field must be entirely alphabetic characters with the length of ${len}'
  'sex.in': 'The field should be included in the list of ${ _items_.join(", ") }'
};

const errors = await validation.validate(values, rules);

if (!errors) {
  // all validations passed
} else {
  // we got an array of errors
}
```

## Rule

* accepted
  * string style: `field: 'accepted'`
  * object style: `field: { accepted: true }`
* alpha
  * string style: `field: 'alpha:6'` or `field: 'alpha:len=6'`
  * object style: `field: { alpha: { len: 6 } }`
* date
  * string style: `field: 'date'`
  * object style: `field: { date: true }`
* email
  * string style: `field: 'email:true'`
  * object style: `field: { email: true }`
* in
  * `array` style: `field: [ 'basketball', 'football' ]`
  * object style: `field: { in: [ 'basketball', 'football' ] }`
* numeric
  * string style: `field: 'numeric:6'` or `field: 'numeric:len=6'`
  * object style: `field: { numeric: { len: 6 } }`
* regexp
  * string style: `field: 'regexp:"^123456$"'`
  * object style: `field: { regexp: new RegExp(/abc/, 'i') }` or `field: { regexp: /^[0-9a-zA-z]{8,16}$/ }`
* required
  * string style: `field: 'required'` or `field: 'required:true'`
  * object style: `field: { required: true }`