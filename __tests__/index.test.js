import fs from 'fs';
import genDiff from '../src';

const getFixturePath = (fixtureName) => `${__dirname}/../__fixtures__/${fixtureName}`;

describe('gendiff flat', () => {
  const expected = fs.readFileSync(getFixturePath('diff-flat'), 'utf-8');

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

describe('gendiff nested', () => {
  const expected = fs.readFileSync(getFixturePath('diff-nested'), 'utf-8');

  test.each([
    ['json', 'before-nested.json', 'after-nested.json'],
    // ['yaml', 'before.yml', 'after.yml'],
    // ['ini', 'before.ini', 'after.ini'],
  ])('%s', (_testName, beforeFileName, afterFileName) => {
    const beforePath = getFixturePath(beforeFileName);
    const afterPath = getFixturePath(afterFileName);
    const diff = genDiff(beforePath, afterPath);
    expect(diff).toEqual(expected);
  });
});
