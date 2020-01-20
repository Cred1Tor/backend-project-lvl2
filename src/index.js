import _ from 'lodash';
import parse from './parsers';

const isObject = (item) => typeof item === 'object' && item !== null;

const tabSize = 4;

export const getGroupedDiff = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));
  const result = {
    unchanged: [],
    changed: [],
    added: [],
    deleted: [],
    children: [],
  };

  keys.forEach((key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (_.has(data1, key) && !_.has(data2, key)) {
      result.deleted.push({
        key,
        value: value1,
      });
      return;
    }

    if (!_.has(data1, key) && _.has(data2, key)) {
      result.added.push({
        key,
        value: value2,
      });
      return;
    }

    if (value1 === value2) {
      result.unchanged.push({
        key,
        value: value2,
      });
      return;
    }

    if (isObject(value1) && isObject(value2)) {
      result.children.push({
        key,
        value: getGroupedDiff(value1, value2),
      });
      return;
    }

    result.changed.push({
      key,
      oldValue: value1,
      newValue: value2,
    });
  });

  return result;
};

export const stringifyGroupedDiff = (diff, depthLevel = 1) => {
  const indentSize = depthLevel * tabSize;
  const normalIndent = ' '.repeat(indentSize);
  const plusIndent = ' '.repeat(indentSize - 2).concat('+ ');
  const minusIndent = ' '.repeat(indentSize - 2).concat('- ');
  const higherIndent = ' '.repeat(indentSize - tabSize);
  const lowerIndent = ' '.repeat(indentSize + tabSize);

  const stringifyValue = (data) => {
    if (!isObject(data)) {
      return data.toString();
    }

    const lines = Object.entries(data)
      .reduce((acc, [key, value]) => [...acc, `${lowerIndent}${key}: ${value}`], []);

    return `{\n${lines.join('\n')}\n${normalIndent}}`;
  };

  const renderLine = (indent, key, value) => `${indent}${key}: ${stringifyValue(value)}`;

  const unchangedLines = diff.unchanged.map(
    ({ key, value }) => renderLine(normalIndent, key, value),
  );
  const changedLines = diff.changed.map(
    ({ key, oldValue, newValue }) => `${renderLine(minusIndent, key, oldValue)}\n${renderLine(plusIndent, key, newValue)}`,
  );
  const deletedLines = diff.deleted.map(({ key, value }) => `${renderLine(minusIndent, key, value)}`);
  const addedLines = diff.added.map(({ key, value }) => `${renderLine(plusIndent, key, value)}`);
  const childrenLines = diff.children.map(({ key, value }) => `${normalIndent}${key}: ${stringifyGroupedDiff(value, depthLevel + 1)}`);
  const allLines = unchangedLines.concat(childrenLines, changedLines, deletedLines, addedLines);

  return `{\n${allLines.join('\n')}\n${higherIndent}}`;
};

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
      status: 'deleted',
      value: value1,
    });
    result.push({
      key,
      status: 'added',
      value: value2,
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

  const renderLine = ({ key, status, value }) => {
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
