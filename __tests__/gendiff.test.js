import genDiff from '../src';

test('genDiff', () => {
  const diff = genDiff('/test-files/before.json', '/test-files/after.json');
  const lines = diff.split('\n').length;
  expect(lines).toBe(8);
});
