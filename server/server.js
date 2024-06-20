const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser'); 


// Require the Comment model
require('./models/comments');

// import routes
const answerRoutes = require("./routes/answerRoutes");
const questionRoutes = require("./routes/questionRoutes");
const tagsRoutes = require("./routes/tagsRoutes");
const userRoutes = require("./routes/userRoutes")

const commentRoutes = require('./routes/commentRoute');





// server port
const PORT = 8000;

// start express 
const app = express();

// Log all incoming POST requests
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('POST request:', req.path);
    console.log('Body:', req.body);
  }
  next();
});

// setup cors to take 
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));


app.use(express.json()); 

app.use(cookieParser());


// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/fake_so", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));


// Define routes
app.use('/answers', answerRoutes);
app.use('/questions', questionRoutes);
app.use('/tags', tagsRoutes);
app.use('/users', userRoutes);
app.use('/comments', commentRoutes);

// Set more explicit CORS headers for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});





// Start listening 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

``
