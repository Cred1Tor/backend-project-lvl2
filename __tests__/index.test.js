import fs from 'fs';
import genDiff from '../src';

describe('gendiff', () => {
  const expectedPath = `${__dirname}/../__fixtures__/expected`;
  const expected = fs.readFileSync(expectedPath, 'utf-8');

  test('json', () => {
    const path1 = `${__dirname}/../__fixtures__/before.json`;
    const path2 = `${__dirname}/../__fixtures__/after.json`;
    const diff = genDiff(path1, path2);
    expect(diff).toEqual(expected);
  });

  test('yaml', () => {
    const path1 = `${__dirname}/../__fixtures__/before.yml`;
    const path2 = `${__dirname}/../__fixtures__/after.yml`;
    const diff = genDiff(path1, path2);
    expect(diff).toEqual(expected);
  });

  test('ini', () => {
    const path1 = `${__dirname}/../__fixtures__/before.ini`;
    const path2 = `${__dirname}/../__fixtures__/after.ini`;
    const diff = genDiff(path1, path2);
    expect(diff).toEqual(expected);
  });
});
