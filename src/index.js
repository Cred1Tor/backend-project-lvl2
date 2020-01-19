import _ from 'lodash';
import parse from './parsers';

const isObject = (item) => typeof item === 'object' && item !== null;

const cleanStringify = (data, indentSize = 4) => {
  if (!isObject(data)) {
    return data.toString();
  }

  const indent = ' '.repeat(indentSize);
  const higherIndent = ' '.repeat(indentSize - 4);
  const entriesString = Object.entries(data)
    .reduce((acc, [key, value]) => [...acc, `${indent}${key}: ${value}`], [])
    .join('\n');
  return `{\n${entriesString}\n${higherIndent}}`;
};

const getDiff = (data1, data2, indentSize = 4) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));

  const getDiffByKey = (key) => {
    const indent = ' '.repeat(indentSize);
    const indentShort = ' '.repeat(indentSize - 2);

    if (isObject(data1[key]) && isObject(data2[key])) {
      return `${indent}${key}: ${getDiff(data1[key], data2[key], indentSize + 4)}\n`;
    }
    if (data1[key] === data2[key]) {
      return `${indent}${key}: ${data2[key]}\n`;
    }

    let result = '';

    if (_.has(data1, key)) {
      result += `${indentShort}- ${key}: ${cleanStringify(data1[key], indentSize + 4)}\n`;
    }
    if (_.has(data2, key)) {
      result += `${indentShort}+ ${key}: ${cleanStringify(data2[key], indentSize + 4)}\n`;
    }

    return result;
  };

  const diffs = keys.map((key) => getDiffByKey(key));
  const higherIndent = ' '.repeat(indentSize - 4);
  return `{\n${diffs.join('')}${higherIndent}}`;
};

export const getDiffData = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));
  const result = {
    unchanged: [],
    changed: [],
    added: [],
    deleted: [],
  };

  keys.forEach((key) => {
    if (_.has(data1, key) && !_.has(data2, key)) {
      result.deleted.push({
        key,
        value: data1[key],
      });
      return;
    }

    if (!_.has(data1, key) && _.has(data2, key)) {
      result.added.push({
        key,
        value: data2[key],
      });
      return;
    }


    if (data1[key] === data2[key]) {
      result.unchanged.push({
        key,
        value: data2[key],
      });
      return;
    }

    result.changed.push({
      key,
      oldValue: data1[key],
      newValue: data2[key],
    });
  });

  return result;
};

export default (filepath1, filepath2) => {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);
  return getDiff(data1, data2);
};
