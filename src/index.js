import _ from 'lodash';
import parse from './parsers';

const getDiffByKey = (data1, data2, key) => {
  if (data1[key] === data2[key]) {
    return `    ${key}: ${data2[key]}\n`;
  }
  let result = '';
  if (_.has(data1, key)) {
    result += `  - ${key}: ${data1[key]}\n`;
  }
  if (_.has(data2, key)) {
    result += `  + ${key}: ${data2[key]}\n`;
  }
  return result;
};

export default (filepath1, filepath2) => {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);
  const keys = _.union(Object.keys(data1), Object.keys(data2));
  const diffs = keys.map((key) => getDiffByKey(data1, data2, key));
  return `{\n${diffs.join('')}}`;
};
