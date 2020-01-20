import _ from 'lodash';
import parse from './parsers';

const isObject = (item) => typeof item === 'object' && item !== null;

const tabSize = 4;

export const getOrderedDiff = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));
  const result = [];

  keys.forEach((key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (_.has(data1, key) && !_.has(data2, key)) {
      result.push({
        key,
        status: 'deleted',
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
        value: getOrderedDiff(value1, value2),
      });
      return;
    }

    result.push({
      key,
      status: 'changed',
      oldValue: value1,
      newValue: value2,
    });
  });

  return result;
};

export const stringifyOrderedDiff = (diff, depthLevel = 1) => {
  const indentSize = depthLevel * tabSize;
  const normalIndent = ' '.repeat(indentSize);
  const plusIndent = ' '.repeat(indentSize - 2).concat('+ ');
  const minusIndent = ' '.repeat(indentSize - 2).concat('- ');
  const higherIndent = ' '.repeat(indentSize - tabSize);
  const lowerIndent = ' '.repeat(indentSize + tabSize);

  const indent = {
    unchanged: normalIndent,
    added: plusIndent,
    deleted: minusIndent,
    nestedDiff: normalIndent,
  };

  const stringifyValue = (data) => {
    if (!isObject(data)) {
      return data.toString();
    }

    const lines = Object.entries(data)
      .reduce((acc, [key, value]) => [...acc, `${lowerIndent}${key}: ${value}`], []);

    return `{\n${lines.join('\n')}\n${normalIndent}}`;
  };

  const renderLine = ({
    key, status, value, oldValue, newValue,
  }) => {
    if (status === 'changed') {
      return `${minusIndent}${key}: ${stringifyValue(oldValue)}\n${plusIndent}${key}: ${stringifyValue(newValue)}`;
    }

    const valueOutput = status === 'nestedDiff' ? stringifyOrderedDiff(value, depthLevel + 1) : stringifyValue(value);
    return `${indent[status]}${key}: ${stringifyValue(valueOutput)}`;
  };

  const lines = diff.map(renderLine);

  return `{\n${lines.join('\n')}\n${higherIndent}}`;
};

export default (filepath1, filepath2) => {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);
  const diff = getOrderedDiff(data1, data2);
  return stringifyOrderedDiff(diff);
};
