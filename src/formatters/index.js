import treeStringify from './tree';
import plainStringify from './plain';
import jsonStringify from './json';

const formatsMapping = {
  tree: treeStringify,
  plain: plainStringify,
  json: jsonStringify,
};

export default (formatType) => formatsMapping[formatType];
