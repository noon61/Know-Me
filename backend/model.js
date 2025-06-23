const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let connection;  // グローバル変数で宣言

async function initDb() {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'nodeuser',
    password: 'nodepass',
    database: 'Know-Me',
  });
}

initDb().then(() => {
  console.log('DB connected');
}).catch(err => {
  console.error('DB connection failed', err);
  process.exit(1);
});

// labs一覧取得
app.get('/api/labs', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT id, name FROM labs');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// circles一覧取得
app.get('/api/circles', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT id, name FROM circles');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

app.get('/api/subjects', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT id, name,grade FROM subjects');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
}
);

// subjects一覧取得
app.get('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;
  console.log(`Fetching student with ID: ${studentId}`);

  try {
    // 学生情報＋研究室名＋サークル名を取得
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

    // 履修している科目を取得
    const [subjectRows] = await connection.execute(
      `SELECT subjects.id, subjects.name, subjects.grade
       FROM student_subjects
       JOIN subjects ON student_subjects.subject_id = subjects.id
       WHERE student_subjects.student_id = ?`,
      [studentId]
    );

    // 学生情報にsubjects配列を追加して返す
    const studentData = studentRows[0];
    
    studentData.subjects = subjectRows;
    console.log('Student data:', studentData);

    res.json(studentData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});






app.post('/api/search', async (req, res) => {
  const { labs, circles, subjects } = req.body;

  let conditions = [];
  let values = [];

  if (labs.length > 0) {
    conditions.push(`lab_id IN (${labs.map(() => '?').join(',')})`);
    values.push(...labs);
  }

  if (circles.length > 0) {
    conditions.push(`circle_id IN (${circles.map(() => '?').join(',')})`);
    values.push(...circles);
  }

  if (subjects.length > 0) {
    conditions.push(`id IN (
      SELECT ss.student_id FROM student_subjects ss WHERE ss.subject_id IN (${subjects.map(() => '?').join(',')})
    )`);
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



app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
