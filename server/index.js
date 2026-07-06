const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const recommendRoutes = require('./routes/recommendations');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/recommendations', recommendRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'EatWise API' }));

app.listen(PORT, () => {
  console.log(`🌿 EatWise API running at http://localhost:${PORT}`);
});
