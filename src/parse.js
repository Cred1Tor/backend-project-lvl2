import yaml from 'js-yaml';
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

const supportedExtensions = Object.keys(extensionsMapping);

export default (text, extension) => {
  if (!supportedExtensions.includes(extension)) {
    throw new Error(`'${extension}' is unsupported file extension. Supported extensions are: ${supportedExtensions.join(', ')}.`);
  }

  const parse = extensionsMapping[extension];
  return parse(text);
};
