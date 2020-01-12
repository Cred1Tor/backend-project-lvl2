import * as fs from 'fs';
import _ from 'lodash';

const getDiffByKey = (json1, json2, key) => {
  if (json1[key] === json2[key]) {
    return `    "${key}": ${json2[key]}\n`;
  }
  let result = '';
  if (_.has(json1, key)) {
    result += `  - "${key}": ${json1[key]}\n`;
  }
  if (_.has(json2, key)) {
    result += `  + "${key}": ${json2[key]}\n`;
  }
  return result;
};

export default (filepath1, filepath2) => {
  const data1 = fs.readFileSync(filepath1, 'utf-8');
  const data2 = fs.readFileSync(filepath2, 'utf-8');
  const json1 = JSON.parse(data1);
  const json2 = JSON.parse(data2);
  const keys = _.union(Object.keys(json1), Object.keys(json2));
  const diffs = keys.map((key) => getDiffByKey(json1, json2, key));
  return `{\n${diffs.join('')}}`;
};
