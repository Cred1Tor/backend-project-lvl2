import genDiff from '../src';

test('genDiff', () => {
  const diff = genDiff('__tests__/test-files/before.json', '__tests__/test-files/after.json');
  const lines = diff.split('\n').length;
  expect(lines).toBe(8);
});
