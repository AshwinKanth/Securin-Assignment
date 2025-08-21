const express = require('express');
const router = express.Router();
const db = require('./db');
const fs = require('fs');
const path = require('path');


router.post('/recipes/import', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'US_recipes.json');
  let recipes;
  try {
    recipes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return res.status(500).json({ error: 'Failed to read US_recipes.json' });
  }
  if (!Array.isArray(recipes) || recipes.length === 0) {
    return res.status(400).json({ message: 'No recipes to import' });
  }

  const values = recipes.map(r => [
    r.title || null,
    r.ingredients ? (typeof r.ingredients === 'object' ? JSON.stringify(r.ingredients) : r.ingredients) : null,
    r.instructions || null,
    r.cuisine || null,
    r.category || null,
    r.rating != null ? r.rating : null,
    r.prep_time != null ? r.prep_time : null,
    r.cook_time != null ? r.cook_time : null,
    r.total_time != null ? r.total_time : null,
    r.serves || null,
    JSON.stringify(r.nutrients || {})
  ]);

  const sql = "INSERT INTO recipes (title, ingredients, instructions, cuisine, category, rating, prep_time, cook_time, total_time, serves, nutrients) VALUES ?";
  db.query(sql, [values], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Recipes imported', inserted: result.affectedRows });
  });
});


router.get('/api/recipes', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const offset = (page - 1) * limit;

  const countSql = "SELECT COUNT(*) AS total FROM recipes";
  db.query(countSql, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = countResult[0].total;
    const sql = "SELECT * FROM recipes ORDER BY rating DESC LIMIT ? OFFSET ?";
    db.query(sql, [limit, offset], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ page, limit, total, data: results });
    });
  });
});

router.get('/api/recipes/:id', (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM recipes WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(results[0]);
  });
});

// Search endpoint (supports calories, title, cuisine, total_time, rating)
router.get('/api/recipes/search', (req, res) => {
  const { calories, title, cuisine, total_time, rating, page, limit } = req.query;
  const pageNum = parseInt(page) || 1;
  const lim = Math.min(parseInt(limit) || 10, 100);
  const offset = (pageNum - 1) * lim;

  let where = [];
  let params = [];

  if (title) { where.push("title LIKE ?"); params.push('%'+title+'%'); }
  if (cuisine) { where.push("cuisine = ?"); params.push(cuisine); }

  // rating like ">=4.5" or "4.5"
  if (rating) {
    const m = rating.toString().match(/(>=|<=|=|>|<)?\s*(\d+(?:\.\d+)?)/);
    if (m) { where.push("rating " + (m[1] || '=') + " ?"); params.push(parseFloat(m[2])); }
  }

  // total_time like "<=120" etc
  if (total_time) {
    const m = total_time.toString().match(/(>=|<=|=|>|<)?\s*(\d+)/);
    if (m) { where.push("total_time " + (m[1] || '=') + " ?"); params.push(parseInt(m[2])); }
  }

  // calories are inside nutrients JSON column -> use JSON_EXTRACT for MySQL
  if (calories) {
    const m = calories.toString().match(/(>=|<=|=|>|<)?\s*(\d+)/);
    if (m) {
      const op = m[1] || '=';
      const val = parseInt(m[2]);
      where.push(`JSON_EXTRACT(nutrients, '$.calories') ${op} ?`);
      params.push(val);
    }
  }

  const whereSql = where.length ? (" WHERE " + where.join(" AND ")) : "";
  const countSql = "SELECT COUNT(*) AS total FROM recipes" + whereSql;
  db.query(countSql, params, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = countResult[0].total;
    const sql = "SELECT * FROM recipes" + whereSql + " ORDER BY rating DESC LIMIT ? OFFSET ?";
    db.query(sql, params.concat([lim, offset]), (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ page: pageNum, limit: lim, total, data: results });
    });
  });
});

module.exports = router;
