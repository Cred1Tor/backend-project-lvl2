import fs from 'fs';
import genDiff from '../src/lib';

const getFullPath = (fileName) => `${__dirname}/../__fixtures__/${fileName}`;

describe.each([
  ['tree', 'tree-diff.txt'],
  ['plain', 'plain-diff.txt'],
  ['json', 'json-diff.json'],
])('%s', (format, expectedFileName) => {
  const expected = fs.readFileSync(getFullPath(expectedFileName), 'utf-8');

  test.each([
    ['json', 'before.json', 'after.json'],
    ['yaml', 'before.yml', 'after.yml'],
    ['ini', 'before.ini', 'after.ini'],
  ])('%s', (_testName, beforeFileName, afterFileName) => {
    const beforePath = getFullPath(beforeFileName);
    const afterPath = getFullPath(afterFileName);
    const diff = genDiff.compareFiles(beforePath, afterPath, format);
    expect(diff).toEqual(expected);
  });
});

test('err', () => {
  const beforePath = getFullPath('before.json');
  const afterPath = getFullPath('bad.ext');
  const shouldFail = () => genDiff.compareFiles(beforePath, afterPath);
  expect(shouldFail).toThrow('\'bad.ext\' has unsupported file extension');
});
