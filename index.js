const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/simple-reddit', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('Error connecting to MongoDB:', err));

// Example Route
app.get('/', (req, res) => {
  res.send('Hello from Simple Reddit!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
// Subreddit schema
const subredditSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String
  });
  
  const Subreddit = mongoose.model('Subreddit', subredditSchema);
  
  // Post schema
  const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
    subreddit: { type: mongoose.Schema.Types.ObjectId, ref: 'Subreddit' },
    upvotes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  });
  
  const Post = mongoose.model('Post', postSchema);
  

  // Create a new subreddit
app.post('/subreddits', async (req, res) => {
    const { name, description } = req.body;
    const subreddit = new Subreddit({ name, description });
    try {
      await subreddit.save();
      res.status(201).send(subreddit);
    } catch (err) {
      res.status(400).send(err);
    }
  });
  
  // Create a new post in a subreddit
  app.post('/posts', async (req, res) => {
    const { title, content, subredditId } = req.body;
    const post = new Post({ title, content, subreddit: subredditId });
    try {
      await post.save();
      res.status(201).send(post);
    } catch (err) {
      res.status(400).send(err);
    }
  });
  
  // Get all posts in a subreddit, ordered by recency
  app.get('/subreddits/:subredditId/posts', async (req, res) => {
    const { subredditId } = req.params;
    try {
      const posts = await Post.find({ subreddit: subredditId }).sort({ createdAt: -1 });
      res.status(200).send(posts);
    } catch (err) {
      res.status(400).send(err);
    }
  });
  
  // Upvote a post
  app.post('/posts/:postId/upvote', async (req, res) => {
    const { postId } = req.params;
    try {
      const post = await Post.findById(postId);
      post.upvotes += 1;
      await post.save();
      res.status(200).send(post);
    } catch (err) {
      res.status(400).send(err);
    }
  });
  const { body, validationResult } = require('express-validator');

app.post('/subreddits', [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('description').not().isEmpty().withMessage('Description is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
});
