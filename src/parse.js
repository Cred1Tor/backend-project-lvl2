import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';
import ini from 'ini';
import _ from 'lodash';

const convertStringValuesToNumbers = (data) => {
  const entries = Object.entries(data);
  return entries.reduce((acc, [key, value]) => {
    if (_.isObject(value)) {
      return { ...acc, [key]: convertStringValuesToNumbers(value) };
    }

    const newValue = typeof value === 'string' && !Number.isNaN(Number(value)) ? Number(value) : value;
    return { ...acc, [key]: newValue };
  }, {});
};

const extensionsMapping = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': (text) => convertStringValuesToNumbers(ini.parse(text)),
};

export default (filepath) => {
  const extension = path.extname(filepath);
  const parse = extensionsMapping[extension];
  const data = fs.readFileSync(filepath, 'utf-8');
  return parse(data);
};
