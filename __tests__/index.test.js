import fs from 'fs';
import genDiff from '../src';

const getFullPath = (fileName) => `${__dirname}/../__fixtures__/${fileName}`;

describe.each([
  ['tree', 'diff-nested'],
  ['plain', 'plain-diff.txt'],
  ['json', 'nested-ordered-diff.json'],
])('%s', (format, expectedFileName) => {
  const expected = fs.readFileSync(getFullPath(expectedFileName), 'utf-8');

  test.each([
    ['json', 'before-nested.json', 'after-nested.json'],
    ['yaml', 'before-nested.yml', 'after-nested.yml'],
    ['ini', 'before-nested.ini', 'after-nested.ini'],
  ])('%s', (_testName, beforeFileName, afterFileName) => {
    const beforePath = getFullPath(beforeFileName);
    const afterPath = getFullPath(afterFileName);
    const diff = genDiff(beforePath, afterPath, format);
    expect(diff).toEqual(expected);
  });
});
