import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';
import ini from 'ini';

const extensionsMapping = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

export default (filepath) => {
  const extension = path.extname(filepath);
  const parse = extensionsMapping[extension];
  const data = fs.readFileSync(filepath, 'utf-8');
  return parse(data);
};
