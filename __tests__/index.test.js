import fs from 'fs';
import genDiff, { getDiff } from '../src';

const getFixturePath = (fixtureName) => `${__dirname}/../__fixtures__/${fixtureName}`;

describe('tree', () => {
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

describe('plain', () => {
  const expected = fs.readFileSync(getFixturePath('plain-diff.txt'), 'utf-8');

  test.each([
    ['json', 'before-nested.json', 'after-nested.json'],
    ['yaml', 'before-nested.yml', 'after-nested.yml'],
    ['ini', 'before-nested.ini', 'after-nested.ini'],
  ])('%s', (_testName, beforeFileName, afterFileName) => {
    const beforePath = getFixturePath(beforeFileName);
    const afterPath = getFixturePath(afterFileName);
    const diff = genDiff(beforePath, afterPath, 'plain');
    expect(diff).toEqual(expected);
  });
});

describe('diff data', () => {
  test('ordered', () => {
    const beforePath = getFixturePath('before-nested.json');
    const afterPath = getFixturePath('after-nested.json');
    const expectedPath = getFixturePath('nested-ordered-diff.json');
    const data1 = JSON.parse(fs.readFileSync(beforePath), 'utf-8');
    const data2 = JSON.parse(fs.readFileSync(afterPath), 'utf-8');
    const expected = JSON.parse(fs.readFileSync(expectedPath, 'utf-8'));
    const diffData = getDiff(data1, data2);
    expect(diffData).toEqual(expected);
  });
});

// const beforePath = getFixturePath('before-nested.json');
// const afterPath = getFixturePath('after-nested.json');
// // const data1 = JSON.parse(fs.readFileSync(beforePath), 'utf-8');
// // const data2 = JSON.parse(fs.readFileSync(afterPath), 'utf-8');
// // const diffStructure = getDiff(data1, data2);
// console.log(genDiff(beforePath, afterPath, 'plain'));
