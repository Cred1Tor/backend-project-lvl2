import { isObject } from '../utils';

const tabSize = 4;

class Indent {
  constructor(depthLevel) {
    const indentSize = depthLevel * tabSize;
    this.normal = ' '.repeat(indentSize);
    this.plus = ' '.repeat(indentSize - 2).concat('+ ');
    this.minus = ' '.repeat(indentSize - 2).concat('- ');
    this.higher = ' '.repeat(indentSize - tabSize);
    this.lower = ' '.repeat(indentSize + tabSize);
    this.byStatus = {
      unchanged: this.normal,
      added: this.plus,
      removed: this.minus,
      nestedDiff: this.normal,
    };
  }
}

const stringifyValue = (data, depthLevel) => {
  if (!isObject(data)) {
    return data.toString();
  }

  const indent = new Indent(depthLevel);
  const lines = Object.entries(data)
    .reduce((acc, [key, value]) => [...acc, `${indent.normal}${key}: ${value}`], []);

  return `{\n${lines.join('\n')}\n${indent.higher}}`;
};

const stringify = (diff, depthLevel = 1) => {
  const lowerLevel = depthLevel + 1;
  const indent = new Indent(depthLevel);

  const renderNode = ({
    key, status, value, oldValue, newValue,
  }) => {
    if (status === 'updated') {
      return `${indent.minus}${key}: ${stringifyValue(oldValue, lowerLevel)}\n${indent.plus}${key}: ${stringifyValue(newValue, lowerLevel)}`;
    }

    const valueOutput = status === 'nestedDiff' ? stringify(value, lowerLevel) : stringifyValue(value, lowerLevel);
    return `${indent.byStatus[status]}${key}: ${stringifyValue(valueOutput, lowerLevel)}`;
  };

  const lines = diff.map(renderNode);

  return `{\n${lines.join('\n')}\n${indent.higher}}`;
};

export default stringify;
