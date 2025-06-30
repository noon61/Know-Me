const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const authRoutes = require("./auth");
const usersRoutes = require("./users"); // 追加

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes); // 追加

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
