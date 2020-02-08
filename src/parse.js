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

const parsingTypesMapping = {
  json: JSON.parse,
  yaml: yaml.safeLoad,
  ini: (text) => convertStringValuesToNumbers(ini.parse(text)),
};

const supportedTypes = Object.keys(parsingTypesMapping);

export default (text, type) => {
  if (!supportedTypes.includes(type)) {
    throw new Error(`'${type}' is unsupported parsing type. Supported types are: ${supportedTypes.join(', ')}.`);
  }

  const parse = parsingTypesMapping[type];
  return parse(text);
};
