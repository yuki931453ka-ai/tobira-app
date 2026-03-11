const Anthropic = require('@anthropic-ai/sdk');
const { GUIDE_CONTEXT } = require('./_shared');

const anthropic = new Anthropic.default({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { formData } = req.body;

  const prompt = `あなたは社会福祉法人の採用担当者が高く評価する応募書類を作成する専門家です。
以下の申込者情報と参考資料をもとに、「社会福祉法人 小平市社会福祉協議会 嘱託職員募集申込書」のドラフトを作成してください。

${GUIDE_CONTEXT}

【申込者が入力した情報】
${JSON.stringify(formData, null, 2)}

以下の形式でドラフトを作成してください：

## 申込書ドラフト

### 基本情報
氏名、生年月日、住所、連絡先を整理

### 学歴
時系列で整理

### 資格
社会福祉士を最上段に

### 志望の動機
参考資料のポイントを踏まえた説得力のある志望動機（3〜5文）

### 趣味・特技
地域活動との関連性を意識

### スポーツ・文化活動・ボランティア等の経験

### 興味関心をもって取り組んでいること

### 自覚している性格
相談職にふさわしい特性を具体的に

### 本人希望記入欄

### 職務経歴書
直近から遡って整理。経験業務の内容は具体的に。

### 課題式作文（750〜1,200字）
題目：「障がい者・児の相談業務及び一般事務」に対する基本的な姿勢について
推奨構成（導入→経験→社協・ひびきへの考え方→まとめ）に従って作成。

重要：
- 申込者の実際の経験を尊重し、虚偽の情報は追加しない
- 参考資料のキーワードを自然に織り込む
- 未入力項目は「【要記入】」と表示`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ draft: message.content[0].text });
  } catch (error) {
    console.error('Generate draft error:', error);
    res.status(500).json({ error: 'ドラフト生成エラー: ' + error.message });
  }
};
