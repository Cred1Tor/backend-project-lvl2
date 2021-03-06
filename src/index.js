import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parse';
import getFormatter from './formatters';

const getDiff = (data1, data2) => {
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

    if (_.isObject(value1) && _.isObject(value2)) {
      return {
        key,
        status: 'nestedDiff',
        children: getDiff(value1, value2),
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

const extMapping = {
  yml: 'yaml',
};

export default (filepath1, filepath2, formatType = 'tree') => {
  const data1 = fs.readFileSync(filepath1, 'utf-8');
  const data2 = fs.readFileSync(filepath2, 'utf-8');

  const ext1 = path.extname(filepath1).slice(1);
  const ext2 = path.extname(filepath2).slice(1);

  const data1Type = _.get(extMapping, ext1, ext1);
  const data2Type = _.get(extMapping, ext2, ext2);

  const parsedData1 = parse(data1, data1Type);
  const parsedData2 = parse(data2, data2Type);

  const diff = getDiff(parsedData1, parsedData2);
  const format = getFormatter(formatType);
  return format(diff);
};
