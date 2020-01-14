import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';

const mapping = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
};

export default (filepath) => {
  const type = path.extname(filepath);
  const parse = mapping[type];
  const data = fs.readFileSync(filepath, 'utf-8');
  return parse(data);
};
