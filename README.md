# validation

[![npm](https://img.shields.io/npm/v/@killara/validation.svg)](https://www.npmjs.com/package/@killara/validation)
[![Travis branch](https://img.shields.io/travis/killara/validation/master.svg)](https://travis-ci.org/killara/validation)
[![Codecov branch](https://img.shields.io/codecov/c/github/killara/validation/master.svg)](https://codecov.io/github/killara/validation?branch=master)
[![David deps](https://img.shields.io/david/killara/validation.svg)](https://david-dm.org/killara/validation)
[![Known Vulnerabilities](https://snyk.io/test/npm/@killara/validation/badge.svg)](https://snyk.io/test/npm/@killara/validation)
[![npm download](https://img.shields.io/npm/dt/@killara/validation.svg)](https://www.npmjs.com/package/@killara/validation)

[**WIP**] A validator for HTTP request parameters

## Installation

```bash
npm i @killara/validation -S
```

## Usage

```js
const validation = require('@killara/validation');

const values = {
  username: 'admin',
  password: 'admin',
}

const rules = {
  username: {
    required: true,
    alpha: { len: 6 },
  },
  password: {
    required: true,
    regexp: /^[a-z]{6:18}$/,
  }
}

const errors = await validation.validate(values, rules);
```

## Rule

* accepted
  * options (true)
    * type: `boolean`
    * example
      * `accepted: true`
* alpha
  * options (default: may be any length)
    * type: `object`
    * properties
      * len
    * example
      * `alpha: true`
      * `alpha: { len: 6 }`
* email
  * options
    * type: `boolean`
    * example
      * `email: true`
* numeric
  * options (default: may be any length)
    * type: `object`
    * properties
      * len
    * example
      * `numeric: true`
      * `numeric: { len: 6 }`
* regexp
  * options (no default: an RegExp object is a must)
    * type: `regexp`
    * example
      * `regexp: new RegExp(/abc/, 'i')`
      * `regexp: /^[0-9a-zA-z]{8:16}$/`
* required
  * options (default: false)
    * type: `boolean`
    * example
      * `required: true`
      * `required: false`