import fs from 'fs';
import genDiff, { getDiffData } from '../src';

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
    ['yaml', 'before-nested.yml', 'after-nested.yml'],
    ['ini', 'before-nested.ini', 'after-nested.ini'],
  ])('%s', (_testName, beforeFileName, afterFileName) => {
    const beforePath = getFixturePath(beforeFileName);
    const afterPath = getFixturePath(afterFileName);
    const diff = genDiff(beforePath, afterPath);
    expect(diff).toEqual(expected);
  });
});

describe('giff data', () => {
  test('flat', () => {
    const beforePath = getFixturePath('before.json');
    const afterPath = getFixturePath('after.json');
    const data1 = JSON.parse(fs.readFileSync(beforePath));
    const data2 = JSON.parse(fs.readFileSync(afterPath));
    const diffData = getDiffData(data1, data2);
    const expected = JSON.parse(fs.readFileSync(getFixturePath('diff-structure.json')));
    expect(diffData).toEqual(expected);
  });
});
