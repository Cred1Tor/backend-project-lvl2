import fs from 'fs';
import genDiff from '../src';

const getFixturePath = (fixtureName) => `${__dirname}/../__fixtures__/${fixtureName}`;

describe('gendiff', () => {
  const expected = fs.readFileSync(getFixturePath('expected'), 'utf-8');

  test.each([
    ['json', 'before.json', 'after.json'],
    ['yaml', 'before.yml', 'after.yml'],
    ['ini', 'before.ini', 'after.ini'],
  ])('%s', (_testName, beforeFileName, afterFileName) => {
    const beforePath = getFixturePath(beforeFileName);
    const afterPath = getFixturePath(afterFileName);
    const diff = genDiff(beforePath, afterPath);
    expect(diff).toEqual(expected);
  });
});
