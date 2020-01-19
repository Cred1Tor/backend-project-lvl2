import _ from 'lodash';
import parse from './parsers';

const isObject = (item) => typeof item === 'object' && item !== null;

const tabSize = 4;

// const cleanStringify = (data, indentSize = 4) => {
//   if (!isObject(data)) {
//     return data.toString();
//   }

//   const indent = ' '.repeat(indentSize);
//   const higherIndent = ' '.repeat(indentSize - 4);
//   const entriesString = Object.entries(data)
//     .reduce((acc, [key, value]) => [...acc, `${indent}${key}: ${value}`], [])
//     .join('\n');
//   return `{\n${entriesString}\n${higherIndent}}`;
// };

// const getDiff = (data1, data2, indentSize = 4) => {
//   const keys = _.union(Object.keys(data1), Object.keys(data2));

//   const getDiffByKey = (key) => {
//     const indent = ' '.repeat(indentSize);
//     const indentShort = ' '.repeat(indentSize - 2);

//     if (isObject(data1[key]) && isObject(data2[key])) {
//       return `${indent}${key}: ${getDiff(data1[key], data2[key], indentSize + 4)}\n`;
//     }
//     if (data1[key] === data2[key]) {
//       return `${indent}${key}: ${data2[key]}\n`;
//     }

//     let result = '';

//     if (_.has(data1, key)) {
//       result += `${indentShort}- ${key}: ${cleanStringify(data1[key], indentSize + 4)}\n`;
//     }
//     if (_.has(data2, key)) {
//       result += `${indentShort}+ ${key}: ${cleanStringify(data2[key], indentSize + 4)}\n`;
//     }

//     return result;
//   };

//   const diffs = keys.map((key) => getDiffByKey(key));
//   const higherIndent = ' '.repeat(indentSize - 4);
//   return `{\n${diffs.join('')}${higherIndent}}`;
// };

export const getDiffData = (data1, data2) => {
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
        value: getDiffData(value1, value2),
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

export const stringifyDiff = (diff, depthLevel = 1) => {
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
  const childrenLines = diff.children.map(({ key, value }) => `${normalIndent}${key}: ${stringifyDiff(value, depthLevel + 1)}`);
  const allLines = unchangedLines.concat(childrenLines, changedLines, deletedLines, addedLines);

  return `{\n${allLines.join('\n')}\n${higherIndent}}`;
};

export default (filepath1, filepath2) => {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);
  const diff = getDiffData(data1, data2);
  return stringifyDiff(diff);
};

// export default (filepath1, filepath2) => {
//   const data1 = parse(filepath1);
//   const data2 = parse(filepath2);
//   return getDiff(data1, data2);
// };
