import _ from 'lodash';

const makeIndent = (depthLevel) => {
  const tabSize = 4;
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
    .map(([key, value]) => `${indent.normal}${key}: ${value}`);

  return `{\n${lines.join('\n')}\n${indent.higher}}`;
};

const stringifyDiff = (diff, depthLevel = 1) => {
  const lowerLevel = depthLevel + 1;
  const indent = makeIndent(depthLevel);

  const renderNode = ({
    key, status, value, oldValue, newValue, children,
  }) => {
    switch (status) {
      case 'updated':
        return `${indent.minus}${key}: ${stringifyValue(oldValue, lowerLevel)}\n${indent.plus}${key}: ${stringifyValue(newValue, lowerLevel)}`;
      case 'added':
        return `${indent.plus}${key}: ${stringifyValue(value, lowerLevel)}`;
      case 'removed':
        return `${indent.minus}${key}: ${stringifyValue(value, lowerLevel)}`;
      case 'unchanged':
        return `${indent.normal}${key}: ${stringifyValue(value, lowerLevel)}`;
      case 'nestedDiff':
        return `${indent.normal}${key}: ${stringifyDiff(children, lowerLevel)}`;
      default:
        throw new Error(`Unknown diff node status: ${status}`);
    }
  };

  const lines = diff.map(renderNode);

  return `{\n${lines.join('\n')}\n${indent.higher}}`;
};

export default stringifyDiff;
