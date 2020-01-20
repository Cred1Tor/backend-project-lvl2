import fs from 'fs';
import genDiff, { getOrderedDiff, getGroupedDiff } from '../src';

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

describe('diff data', () => {
  test.each([
    ['grouped', getGroupedDiff, 'before-nested.json', 'after-nested.json', 'nested-grouped-diff.json'],
    ['ordered', getOrderedDiff, 'before-nested.json', 'after-nested.json', 'nested-ordered-diff.json'],
  ])('%s', (_testName, getDiffData, beforeFileName, afterFileName, expectedFileName) => {
    const beforePath = getFixturePath(beforeFileName);
    const afterPath = getFixturePath(afterFileName);
    const expectedPath = getFixturePath(expectedFileName);
    const data1 = JSON.parse(fs.readFileSync(beforePath), 'utf-8');
    const data2 = JSON.parse(fs.readFileSync(afterPath), 'utf-8');
    const expected = JSON.parse(fs.readFileSync(expectedPath, 'utf-8'));
    const diffData = getDiffData(data1, data2);
    expect(diffData).toEqual(expected);
  });
});

// const beforePath = getFixturePath('before-nested.json');
// const afterPath = getFixturePath('after-nested.json');
// const data1 = JSON.parse(fs.readFileSync(beforePath), 'utf-8');
// const data2 = JSON.parse(fs.readFileSync(afterPath), 'utf-8');
// const diffStructure = getOrderedDiff(data1, data2);
// console.log(JSON.stringify(diffStructure, null, 2));
