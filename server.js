const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'records.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 記録一覧を取得するAPI
app.get('/api/records', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  res.json(data);
});

// 新しい記録を保存するAPI
app.post('/api/records', (req, res) => {
  const { minutes } = req.body;
  const records = fs.existsSync(DATA_FILE)
    ? JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
    : [];

  const newRecord = {
    date: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
    minutes: Number(minutes)
  };
  records.unshift(newRecord);
  fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2));
  res.json(records);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'otesei.html'));
});

app.listen(PORT, () => {
  console.log(`サーバー起動中: http://localhost:${PORT}`);
});
