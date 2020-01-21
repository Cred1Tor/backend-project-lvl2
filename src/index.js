import _ from 'lodash';
import treeStringify from './formatters/tree';
import plainStringify from './formatters/plain';
import { isObject } from './utils';
import parse from './parsers';

export const getDiff = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));
  const result = [];

  keys.forEach((key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (_.has(data1, key) && !_.has(data2, key)) {
      result.push({
        key,
        status: 'removed',
        value: value1,
      });
      return;
    }

    if (!_.has(data1, key) && _.has(data2, key)) {
      result.push({
        key,
        status: 'added',
        value: value2,
      });
      return;
    }

    if (value1 === value2) {
      result.push({
        key,
        status: 'unchanged',
        value: value2,
      });
      return;
    }

    if (isObject(value1) && isObject(value2)) {
      result.push({
        key,
        status: 'nestedDiff',
        value: getDiff(value1, value2),
      });
      return;
    }

    result.push({
      key,
      status: 'updated',
      oldValue: value1,
      newValue: value2,
    });
  });

  return result;
};

export default (filepath1, filepath2, format = 'tree') => {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);
  const diff = getDiff(data1, data2);
  const stringify = format === 'plain' ? plainStringify : treeStringify;
  return stringify(diff);
};
