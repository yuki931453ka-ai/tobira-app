// ユーザーデータ（Vercel Serverless用のインメモリストア）
// 注意: Serverless環境ではリクエスト間で状態が保持されない場合がある
// 本番ではDB（PlanetScale, Supabase等）を使用すべき

// 簡易的にcookieベースのトークンで認証する
const crypto = require('crypto');

const USERS = {
  'lj1000170@gmail.com': {
    password: 'kb19911226',
    name: '坂野 広平',
  },
  'admin': {
    password: 'k93145313',
    name: 'Admin',
  },
};

// 簡易トークン管理（本番ではJWT等を使用）
const tokens = {};

function generateToken(email) {
  const token = crypto.randomBytes(32).toString('hex');
  tokens[token] = { email, created: Date.now() };
  return token;
}

function validateToken(token) {
  const session = tokens[token];
  if (!session) return null;
  if (Date.now() - session.created > 24 * 60 * 60 * 1000) {
    delete tokens[token];
    return null;
  }
  return session;
}

function getTokenFromReq(req) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice(7);
  }
  return null;
}

module.exports = { USERS, tokens, generateToken, validateToken, getTokenFromReq };
