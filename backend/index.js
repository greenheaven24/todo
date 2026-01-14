const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* GET all todos */
app.get("/todos", async (req, res) => {
  const result = await pool.query("SELECT * FROM todos ORDER BY id");
  res.json(result.rows);
});

/* ADD a todo */
app.post("/todos", async (req, res) => {
  const { title } = req.body;

  const result = await pool.query(
    "INSERT INTO todos (title) VALUES ($1) RETURNING *",
    [title]
  );

  res.json(result.rows[0]);
});

/* UPDATE a todo */
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const result = await pool.query(
    "UPDATE todos SET title = $1 WHERE id = $2 RETURNING *",
    [title, id]
  );

  res.json(result.rows[0]);
});

/* DELETE a todo */
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM todos WHERE id = $1", [id]);

  res.json({ message: "Todo deleted" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
