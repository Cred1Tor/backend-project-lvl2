import { isObject } from '../utils';

const stringifyValue = (data) => (isObject(data) ? '[complex value]' : data.toString());

const stringifyDiff = (diff, path = '') => {
  const renderNode = ({
    key, status, value, oldValue, newValue,
  }) => {
    const pathToKey = `${path}${key}`;
    switch (status) {
      case 'updated':
        return `Property '${pathToKey}' was updated. From ${stringifyValue(oldValue)} to ${stringifyValue(newValue)}`;
      case 'unchanged':
        return `Property '${pathToKey}' was not changed. Value: ${stringifyValue(value)}`;
      case 'added':
        return `Property '${pathToKey}' was added with value: ${stringifyValue(value)}`;
      case 'removed':
        return `Property '${pathToKey}' was removed.`;
      case 'nestedDiff':
        return stringifyDiff(value, `${pathToKey}.`);
      default:
        throw new Error(`Unexpected status: ${status}`);
    }
  };

  const lines = diff.map(renderNode);
  return `${lines.join('\n')}`;
};

export default stringifyDiff;