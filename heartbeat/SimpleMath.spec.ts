import 'jest';
import { add } from "./SimpleMath";

test('smoke test', () => {
  expect(true).toBeTruthy();
});

test('test add function', async () => {
  expect(await add(2, 3)).toBe(5);
});