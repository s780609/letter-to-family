// 加解密核心：PBKDF2-SHA256 推導金鑰 + AES-256-GCM
// 瀏覽器（index.html / encrypt.html）與 Node 測試共用
(function () {
  const ITERATIONS = 600000;

  const toB64 = (bytes) => btoa(String.fromCharCode(...bytes));
  const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

  // 統一密碼格式：Unicode 正規化並移除所有空白，避免輸入法造成差異
  function normalize(password) {
    return password.normalize('NFC').replace(/\s+/g, '');
  }

  async function deriveKey(password, salt, iterations, usage) {
    const base = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(normalize(password)), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
      base, { name: 'AES-GCM', length: 256 }, false, [usage]);
  }

  async function encrypt(text, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt, ITERATIONS, 'encrypt');
    const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(text));
    return { v: 1, iterations: ITERATIONS, salt: toB64(salt), iv: toB64(iv), data: toB64(new Uint8Array(data)) };
  }

  // 密碼錯誤時 AES-GCM 驗證失敗，會丟出例外
  async function decrypt(payload, password) {
    const key = await deriveKey(password, fromB64(payload.salt), payload.iterations, 'decrypt');
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(payload.iv) }, key, fromB64(payload.data));
    return new TextDecoder().decode(plain);
  }

  globalThis.LetterCrypto = { encrypt, decrypt, normalize };
})();
