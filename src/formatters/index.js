import treeStringify from './tree';
import plainStringify from './plain';
import jsonStringify from './json';

const formatsMapping = {
  tree: treeStringify,
  plain: plainStringify,
  json: jsonStringify,
};

const supportedFormats = Object.keys(formatsMapping);

export default (formatType) => {
  if (!supportedFormats.includes(formatType)) {
    throw new Error(`${formatType} is not a valid format type. Supported formats are: ${supportedFormats.join(', ')}.`);
  }

  return formatsMapping[formatType];
};
