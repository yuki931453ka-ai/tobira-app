// ローカル開発用サーバー（Vercelデプロイ時は使用しない）
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes（Vercelのserverless functionsと同じモジュールを使用）
const loginHandler = require('./api/login');
const chatHandler = require('./api/chat');
const generateHandler = require('./api/generate-draft');
const editHandler = require('./api/edit-draft');

// パスワード変更（ローカル用簡易実装）
const { USERS } = require('./api/_shared');

app.post('/api/login', (req, res) => loginHandler(req, res));
app.post('/api/chat', (req, res) => chatHandler(req, res));
app.post('/api/generate-draft', (req, res) => generateHandler(req, res));
app.post('/api/edit-draft', (req, res) => editHandler(req, res));

app.post('/api/change-password', (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  // 簡易: 最初のユーザーのパスワードを変更
  const user = Object.values(USERS)[0];
  if (user.password !== currentPassword) {
    return res.status(400).json({ error: '現在のパスワードが正しくありません。' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'パスワードは8文字以上で設定してください。' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: '新しいパスワードが一致しません。' });
  }
  user.password = newPassword;
  user.passwordChanged = true;
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Tobira が起動しました: http://localhost:${PORT}`);
});
