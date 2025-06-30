const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

// MySQL接続プール（共通化されていればそれを使ってOK）
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "knowme_db",
});

// PUT /api/users/:id
router.put("/:id", async (req, res) => {
    console.log("受信したデータ:", req.body);
  const userId = req.params.id;
  const { name, grade, lab, circle, instagram, x_account, github } = req.body;

  const circleStr = Array.isArray(circle) ? circle.join(",") : "";

  try {
    const sql = `
      UPDATE users SET
        name = ?, grade = ?, lab = ?, circle = ?, instagram = ?, x_account = ?, github = ?
      WHERE id = ?
    `;
    await pool.execute(sql, [name, grade, lab, circleStr, instagram, x_account, github, userId]);
    res.json({ message: "プロフィールを更新しました" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラー" });
  }
});

module.exports = router;
