import fs from 'fs';
import genDiff from '../src';

const getFullPath = (fileName) => `${__dirname}/../__fixtures__/${fileName}`;

describe('tree', () => {
  const expected = fs.readFileSync(getFullPath('diff-nested'), 'utf-8');

  test.each([
    ['json', 'before-nested.json', 'after-nested.json'],
    ['yaml', 'before-nested.yml', 'after-nested.yml'],
    ['ini', 'before-nested.ini', 'after-nested.ini'],
  ])('%s', (_testName, beforeFileName, afterFileName) => {
    const beforePath = getFullPath(beforeFileName);
    const afterPath = getFullPath(afterFileName);
    const diff = genDiff(beforePath, afterPath);
    expect(diff).toEqual(expected);
  });
});

describe('plain', () => {
  const expected = fs.readFileSync(getFullPath('plain-diff.txt'), 'utf-8');

  test.each([
    ['json', 'before-nested.json', 'after-nested.json'],
    ['yaml', 'before-nested.yml', 'after-nested.yml'],
    ['ini', 'before-nested.ini', 'after-nested.ini'],
  ])('%s', (_testName, beforeFileName, afterFileName) => {
    const beforePath = getFullPath(beforeFileName);
    const afterPath = getFullPath(afterFileName);
    const diff = genDiff(beforePath, afterPath, 'plain');
    expect(diff).toEqual(expected);
  });
});

describe('json', () => {
  const expected = fs.readFileSync(getFullPath('nested-ordered-diff.json'), 'utf-8');

  test.each([
    ['json', 'before-nested.json', 'after-nested.json'],
    ['yaml', 'before-nested.yml', 'after-nested.yml'],
    // eslint-disable-next-line max-len
    // ['ini', 'before-nested.ini', 'after-nested.ini'], ini parser converts numbers into strings, so it doesn't work for json output format
  ])('%s', (_testName, beforeFileName, afterFileName) => {
    const beforePath = getFullPath(beforeFileName);
    const afterPath = getFullPath(afterFileName);
    const diff = genDiff(beforePath, afterPath, 'json');
    expect(diff).toEqual(expected);
  });
});

// const beforePath = getFullPath('before-nested.ini');
// const afterPath = getFullPath('after-nested.json');
// // const data1 = JSON.parse(fs.readFileSync(beforePath), 'utf-8');
// // const data2 = JSON.parse(fs.readFileSync(afterPath), 'utf-8');
// // const diffStructure = getDiff(data1, data2);
// // console.log(genDiff(beforePath, afterPath, 'json'));
// console.log(parse(beforePath));
// console.log(parse(afterPath));
