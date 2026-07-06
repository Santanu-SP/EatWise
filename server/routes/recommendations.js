const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DB_PATH = path.join(__dirname, '../data/users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'eatwise-secret-key-2024';
const RECIPES_PATH = path.join(__dirname, '../../client/src/data/recipes.js');

// Simple recipe data inline for server use
const RECIPES = [
  { id: 1, category: 'lunch', tags: ['Vegetarian', 'High-Protein', 'Gluten-Free'], rating: 4.8 },
  { id: 2, category: 'smoothie', tags: ['Vegan', 'Gluten-Free', 'Dairy-Free'], rating: 4.6 },
  { id: 3, category: 'soup', tags: ['Vegan', 'Gluten-Free', 'High-Protein'], rating: 4.7 },
  { id: 4, category: 'breakfast', tags: ['Vegetarian', 'High-Protein', 'Gluten-Free'], rating: 4.5 },
  { id: 5, category: 'dinner', tags: ['Gluten-Free', 'High-Protein', 'Low-Carb', 'Keto'], rating: 4.9 },
  { id: 6, category: 'breakfast', tags: ['Vegan', 'High-Protein', 'Dairy-Free'], rating: 4.6 },
  { id: 7, category: 'lunch', tags: ['Vegetarian', 'High-Protein', 'Gluten-Free'], rating: 4.7 },
  { id: 8, category: 'dinner', tags: ['Vegan', 'Gluten-Free', 'Low-Carb', 'Keto'], rating: 4.4 },
  { id: 9, category: 'breakfast', tags: ['Vegan', 'Gluten-Free', 'Dairy-Free'], rating: 4.8 },
  { id: 10, category: 'dinner', tags: ['Vegan', 'Gluten-Free', 'High-Protein'], rating: 4.6 },
];

const getUsers = () => {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
};

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
};

router.get('/', auth, (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { viewedCategories = [], likedRecipes = [], dietaryPrefs = [] } = user;
  const limit = parseInt(req.query.limit) || 10;

  let scored = RECIPES.map(recipe => {
    let score = recipe.rating * 10;
    if (viewedCategories.includes(recipe.category)) score += 30;
    if (likedRecipes.length > 0) {
      const likedRec = RECIPES.filter(r => likedRecipes.includes(r.id));
      const likedTags = likedRec.flatMap(r => r.tags);
      score += recipe.tags.filter(t => likedTags.includes(t)).length * 15;
    }
    score += recipe.tags.filter(t => dietaryPrefs.includes(t)).length * 20;
    if (likedRecipes.includes(recipe.id)) score -= 50;
    score += Math.random() * 5;
    return { ...recipe, score };
  });

  const recommendations = scored.sort((a, b) => b.score - a.score).slice(0, limit).map(r => r.id);
  res.json({ recommendedIds: recommendations });
});

module.exports = router;
