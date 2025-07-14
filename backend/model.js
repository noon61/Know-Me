const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // .envからJWT_SECRETを読み込む

const app = express();
app.use(cors());
app.use(express.json());

let connection; // グローバルDB接続

// DB接続初期化
async function initDb() {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'nodeuser',
    password: 'nodepass',
    database: 'Know-Me',
  });
}

initDb()
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => {
    console.error('DB connection failed', err);
    process.exit(1);
  });

/* ---------- API 定義 ---------- */

// 研究室一覧
app.get('/api/labs', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT id, name FROM labs');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// サークル一覧
app.get('/api/circles', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT id, name FROM circles');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// 科目一覧
app.get('/api/subjects', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT id, name, grade FROM subjects');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// 特定学生の詳細
app.get('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;
  console.log(`Fetching student with ID: ${studentId}`);

  try {
    // 学生基本情報＋研究室＋サークル
    const [studentRows] = await connection.execute(
      `SELECT students.*, 
              labs.name AS lab_name, 
              circles.name AS circle_name
       FROM students
       LEFT JOIN labs ON students.lab_id = labs.id
       LEFT JOIN circles ON students.circle_id = circles.id
       WHERE students.id = ?`,
      [studentId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // 科目情報を取得
    const [subjectRows] = await connection.execute(
      `SELECT subjects.id, subjects.name, subjects.grade
       FROM student_subjects
       JOIN subjects ON student_subjects.subject_id = subjects.id
       WHERE student_subjects.student_id = ?`,
      [studentId]
    );

    const studentData = studentRows[0];
    studentData.subjects = subjectRows;

    res.json(studentData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 学生検索
app.post('/api/search', async (req, res) => {
  const { labs, circles, subjects } = req.body;

  let conditions = [];
  let values = [];

  if (labs?.length > 0) {
    conditions.push(`lab_id IN (${labs.map(() => '?').join(',')})`);
    values.push(...labs);
  }

  if (circles?.length > 0) {
    conditions.push(`circle_id IN (${circles.map(() => '?').join(',')})`);
    values.push(...circles);
  }

  if (subjects?.length > 0) {
    conditions.push(`
      id IN (
        SELECT ss.student_id FROM student_subjects ss
        WHERE ss.subject_id IN (${subjects.map(() => '?').join(',')})
      )
    `);
    values.push(...subjects);
  }

  const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' OR ') : '';
  const query = `SELECT * FROM students ${whereClause}`;

  try {
    const [rows] = await connection.execute(query, values);
    res.json(rows);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ユーザー登録
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: '全ての項目を入力してください' });
  }

  try {
    const [existing] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'すでに登録されています' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await connection.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashed]
    );

    res.status(201).json({ message: '登録が完了しました' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
});

// ログイン
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'ユーザーが見つかりません' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'パスワードが違います' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラー' });
  }
});

// サーバー起動
app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
