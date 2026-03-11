const { USERS } = require('./_shared');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { currentPassword, newPassword, confirmPassword } = req.body;
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
};
