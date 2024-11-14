// backend/server.js
const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

// backend/server.js (Express)
app.get('/api/posts', (req, res) => {
    // Retrieve posts from database or mock data
    res.json(posts);
  });
  const cors = require('cors');
app.use(cors());
