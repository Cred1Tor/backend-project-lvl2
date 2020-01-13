import fs from 'fs';
import path from 'path';
import genDiff from '../src';

test('genDiff', () => {
  const path1 = path.join(__dirname, '../__fixtures__/before.json');
  const path2 = path.join(__dirname, '../__fixtures__/after.json');
  const diff = genDiff(path1, path2);
  const path3 = path.join(__dirname, '../__fixtures__/expected');
  const expected = fs.readFileSync(path3, 'utf-8');
  expect(diff).toEqual(expected);
});
