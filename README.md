# validation

[![npm](https://img.shields.io/npm/v/@killara/validation.svg)](https://www.npmjs.com/package/@killara/validation)
[![Travis branch](https://img.shields.io/travis/killara/validation/master.svg)](https://travis-ci.org/killara/validation)
[![Codecov branch](https://img.shields.io/codecov/c/github/killara/validation/master.svg)](https://codecov.io/github/killara/validation?branch=master)

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

const errors = validation.validate(values, rules);
```