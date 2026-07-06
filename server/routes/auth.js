const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DB_PATH = path.join(__dirname, '../data/users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'eatwise-secret-key-2024';

const getUsers = () => {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
};

const saveUsers = (users) => {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
};

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/register', async (req, res) => {
  const { name, email, password, dietaryPrefs = [] } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(),
    name, email: email.toLowerCase(),
    password: hashed,
    dietaryPrefs,
    viewedRecipes: [], likedRecipes: [], viewedCategories: [],
    joinedAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...safeUser } = user;
  res.status(201).json({ token, user: safeUser });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email === email?.toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

router.get('/me', auth, (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

router.patch('/activity', auth, (req, res) => {
  const { recipeId, category, action } = req.body;
  const users = getUsers();
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });

  const user = users[idx];
  if (action === 'view') {
    if (!user.viewedRecipes.includes(recipeId)) user.viewedRecipes.unshift(recipeId);
    if (!user.viewedCategories.includes(category)) user.viewedCategories.unshift(category);
  } else if (action === 'like') {
    const li = user.likedRecipes.indexOf(recipeId);
    if (li === -1) user.likedRecipes.unshift(recipeId);
    else user.likedRecipes.splice(li, 1);
  }
  users[idx] = user;
  saveUsers(users);
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

module.exports = router;
