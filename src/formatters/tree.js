import _ from 'lodash';

const tabSize = 4;

const makeIndent = (depthLevel) => {
  const indentSize = depthLevel * tabSize;
  const indent = {
    normal: ' '.repeat(indentSize),
    plus: ' '.repeat(indentSize - 2).concat('+ '),
    minus: ' '.repeat(indentSize - 2).concat('- '),
    higher: ' '.repeat(indentSize - tabSize),
    lower: ' '.repeat(indentSize + tabSize),
  };

  return indent;
};

const stringifyValue = (data, depthLevel) => {
  if (!_.isObject(data)) {
    return data.toString();
  }

  const indent = makeIndent(depthLevel);
  const lines = Object.entries(data)
    .reduce((acc, [key, value]) => [...acc, `${indent.normal}${key}: ${value}`], []);

  return `{\n${lines.join('\n')}\n${indent.higher}}`;
};

const stringify = (diff, depthLevel = 1) => {
  const lowerLevel = depthLevel + 1;
  const indent = makeIndent(depthLevel);
  const indentByStatus = {
    unchanged: indent.normal,
    added: indent.plus,
    removed: indent.minus,
    nestedDiff: indent.normal,
  };

  const renderNode = ({
    key, status, value, oldValue, newValue,
  }) => {
    if (status === 'updated') {
      return `${indent.minus}${key}: ${stringifyValue(oldValue, lowerLevel)}\n${indent.plus}${key}: ${stringifyValue(newValue, lowerLevel)}`;
    }

    const valueOutput = status === 'nestedDiff' ? stringify(value, lowerLevel) : stringifyValue(value, lowerLevel);
    return `${indentByStatus[status]}${key}: ${stringifyValue(valueOutput, lowerLevel)}`;
  };

  const lines = diff.map(renderNode);

  return `{\n${lines.join('\n')}\n${indent.higher}}`;
};

export default stringify;
