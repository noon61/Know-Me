const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const { getConnection } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 研究室一覧
app.get('/api/labs', async (req, res) => {
  try {
    const connection = getConnection();
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
    const connection = getConnection();
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
    const connection = getConnection();
    const [rows] = await connection.execute('SELECT id, name, grade FROM subjects');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

app.post('/api/addLab', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: '研究室名を入力してください' });
    }
    
    try {
        const connection = getConnection();
        await connection.execute('INSERT INTO labs (name) VALUES (?)', [name]);
        res.status(201).json({ message: '研究室が追加されました' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラー' });
    }
});

app.post('/api/addCircle', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'サークル名を入力してください' });
    }  
    try {
        const connection = getConnection();
        await connection.execute('INSERT INTO circles (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'サークルが追加されました'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラー' });
    }
});
// 特定学生の詳細
app.get('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;
  try {
    const connection = getConnection();
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
    conditions.push(`id IN (
      SELECT ss.student_id FROM student_subjects ss
      WHERE ss.subject_id IN (${subjects.map(() => '?').join(',')})
    )`);
    values.push(...subjects);
  }

  const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' OR ') : '';
  const query = `SELECT * FROM students ${whereClause}`;

  try {
    const connection = getConnection();
    const [rows] = await connection.execute(query, values);
    res.json(rows);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ユーザー登録
// ユーザー登録（users と students に同時登録）
// ユーザー登録（users と students に同時登録）
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: '全ての項目を入力してください' });
  }

  let connection; // ← スコープを try の外に出す

  try {
    connection = getConnection();

    // 既存ユーザーのチェック
    const [existing] = await connection.execute('SELECT * FROM students WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'すでに登録されています' });
    }

    const hashed = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashed);

    // トランザクション開始
    await connection.beginTransaction();

    // users に追加
    const [userResult] = await connection.execute(
  `INSERT INTO students
   (name, email, password_hash, grade, lab_id, circle_id)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [name, email, hashed, '未設定', 0, 0]
);

    
    // コミット
    await connection.commit();

    res.status(201).json({ message: '登録が完了しました' });
  } catch (err) {
    console.error(err);
    if (connection) {
      await connection.rollback();
    }
    res.status(500).json({ message: 'サーバーエラー' });
  }
});


// ログイン
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = getConnection();
    const [users] = await connection.execute('SELECT * FROM students WHERE email = ?', [email]);
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

app.post('/api/update', async (req, res) => {
    const { id, name,grade, lab_id, circle_id, subjects,instagram,x_account,github } = req.body;
    try {
        const connection = getConnection();

        // 学生情報の更新
        await connection.execute(
            'UPDATE students SET name = ?, grade =?, lab_id = ?, circle_id = ? WHERE id = ?',
            [name,grade, lab_id, circle_id, id]
        );

        // 既存の科目を削除
        await connection.execute('DELETE FROM student_subjects WHERE student_id = ?', [id]);

        // 新しい科目を追加
        if (subjects && subjects.length > 0) {
            const subjectValues = subjects.map(subject => [id, subject.id]);
            await connection.query(
                'INSERT INTO student_subjects (student_id, subject_id) VALUES ?',
                [subjectValues]
            );
        }

        res.json({ message: '更新が完了しました' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラー' });
    }

})


module.exports = app;
