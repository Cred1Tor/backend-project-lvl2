import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';
import ini from 'ini';

const mapping = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

export default (filepath) => {
  const type = path.extname(filepath);
  const parse = mapping[type];
  const data = fs.readFileSync(filepath, 'utf-8');
  return parse(data);
};
