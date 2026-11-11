# letter-to-family

一封用密碼加密的信，放在 GitHub Pages 上。repo 裡只有加密後的內容，原文不會出現在任何地方。

## 更新信件內容

1. 在 `private/letter.md` 寫信（`private/` 已被 `.gitignore` 排除）
2. 用瀏覽器直接開啟本機的 `encrypt.html`，選取這個檔案、輸入密碼兩次，下載 `data.js`
3. 把 `data.js` 放到專案根目錄覆蓋舊檔，然後 commit 並 push

修改提示文字：編輯 `index.html` 中 `class="hint"` 那一行。

## 檔案

| 檔案 | 用途 |
|---|---|
| `index.html` | 家人看到的解鎖頁 |
| `encrypt.html` | 本機加密工具 |
| `letter-crypto.js` | 加解密核心（PBKDF2-SHA256 60 萬次 + AES-256-GCM） |
| `data.js` | 加密後的信件（由 encrypt.html 產生） |
| `test/` | `node --test test/roundtrip.test.mjs` |

## 注意

- 網頁內容不具法律效力。台灣的自書遺囑必須親筆寫全文、寫日期並簽名；這裡適合寫心意，以及正式遺囑放在哪裡。
- 換密碼或改內容後，舊版加密檔仍留在 git 歷史中，用舊密碼還是能解開。
