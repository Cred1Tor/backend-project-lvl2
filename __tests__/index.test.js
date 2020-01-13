import genDiff from '../src';

test('genDiff', () => {
  const diff = genDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json');
  const expected = `{
    host: hexlet.io
  - timeout: 50
  + timeout: 20
  - proxy: 123.234.53.22
  - follow: false
  + verbose: true
}`;
  expect(diff).toEqual(expected);
});