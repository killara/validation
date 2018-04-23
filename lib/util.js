'use strict';

exports.isEmpty = value => value == null || (typeof value === 'string' && value.trim().length === 0) || false;
