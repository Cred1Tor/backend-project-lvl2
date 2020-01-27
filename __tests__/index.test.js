import fs from 'fs';
import genDiff from '../src';

const getFullPath = (fileName) => `${__dirname}/../__fixtures__/${fileName}`;

describe.each([
  ['tree', 'tree-diff.txt'],
  ['plain', 'plain-diff.txt'],
  ['json', 'json-diff.json'],
])('%s', (format, expectedFileName) => {
  let expected = fs.readFileSync(getFullPath(expectedFileName), 'utf-8');

  test.each([
    ['json', 'before.json', 'after.json'],
    ['yaml', 'before.yml', 'after.yml'],
    ['ini', 'before.ini', 'after.ini'],
  ])('%s', (testName, beforeFileName, afterFileName) => {
    const beforePath = getFullPath(beforeFileName);
    const afterPath = getFullPath(afterFileName);
    const diff = genDiff(beforePath, afterPath, format);

    // ini parser converts numbers to strings
    // so the expected result for json format on ini files will be different
    if (format === 'json' && testName === 'ini') {
      expected = fs.readFileSync(getFullPath('json-diff-no-numbers.json'), 'utf-8');
    }

    expect(diff).toEqual(expected);
  });
});
