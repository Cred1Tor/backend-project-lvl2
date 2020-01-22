import _ from 'lodash';
import treeStringify from './formatters/tree';
import plainStringify from './formatters/plain';
import jsonStringify from './formatters/json';
import { isObject } from './utils';
import parse from './parsers';

const format = {
  tree: treeStringify,
  plain: plainStringify,
  json: jsonStringify,
};

export const getDiff = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));

  const diffs = keys.map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (_.has(data1, key) && !_.has(data2, key)) {
      return {
        key,
        status: 'removed',
        value: value1,
      };
    }

    if (!_.has(data1, key) && _.has(data2, key)) {
      return {
        key,
        status: 'added',
        value: value2,
      };
    }

    if (value1 === value2) {
      return {
        key,
        status: 'unchanged',
        value: value2,
      };
    }

    if (isObject(value1) && isObject(value2)) {
      return {
        key,
        status: 'nestedDiff',
        value: getDiff(value1, value2),
      };
    }

    return {
      key,
      status: 'updated',
      oldValue: value1,
      newValue: value2,
    };
  });

  return diffs;
};

export default (filepath1, filepath2, formatType = 'tree') => {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);
  const diff = getDiff(data1, data2);
  return format[formatType](diff);
};
