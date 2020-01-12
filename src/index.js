import * as fs from 'fs';
import _ from 'lodash';

const getDiffByKey = (json1, json2, key) => {
  if (_.has(json1, key) && !_.has(json2, key)) {
    return `  - "${key}": ${json1[key]}`;
  }
  if (!_.has(json1, key) && _.has(json2, key)) {
    return `  + "${key}": ${json2[key]}`;
  }
  if (json1[key] === json2[key]) {
    return `    "${key}": ${json2[key]}`;
  }
  return `  - "${key}": ${json1[key]}\n  + "${key}": ${json2[key]}`;
};

export default (filepath1, filepath2) => {
  const data1 = fs.readFileSync(filepath1, 'utf-8');
  const data2 = fs.readFileSync(filepath2, 'utf-8');
  const json1 = JSON.parse(data1);
  const json2 = JSON.parse(data2);
  const keys = _.union(Object.keys(json1), Object.keys(json2));
  const diffs = keys.map((key) => getDiffByKey(json1, json2, key));
  return `{\n${diffs.join('\n')}\n}`;
};
