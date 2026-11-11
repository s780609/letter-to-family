// 執行：node --test test/roundtrip.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../letter-crypto.js';

const { encrypt, decrypt } = globalThis.LetterCrypto;
const TEXT = '親愛的家人：\n\n這是測試內容，含中文、emoji 🌸 與換行。\n';

test('正確密碼可解密回原文', async () => {
  const payload = await encrypt(TEXT, '0815王小美美');
  assert.equal(await decrypt(payload, '0815王小美美'), TEXT);
});

test('密碼前後與中間的空白會被忽略', async () => {
  const payload = await encrypt(TEXT, '0815王小美美');
  assert.equal(await decrypt(payload, ' 0815 王小美美 '), TEXT);
});

test('錯誤密碼會失敗', async () => {
  const payload = await encrypt(TEXT, '0815王小美美');
  await assert.rejects(decrypt(payload, '0816王小美美'));
});

test('加密結果不含明文，且每次 salt/iv 都不同', async () => {
  const a = await encrypt(TEXT, 'pw');
  const b = await encrypt(TEXT, 'pw');
  assert.ok(!JSON.stringify(a).includes('親愛'));
  assert.notEqual(a.salt, b.salt);
  assert.notEqual(a.iv, b.iv);
});
