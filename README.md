# validation

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