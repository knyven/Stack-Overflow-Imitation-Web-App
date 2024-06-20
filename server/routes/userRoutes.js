const express = require('express');
const router = express.Router();

// Import controllers
const { registerUser } = require("../controllers/registerUser");
const { loginUser } = require("../controllers/loginUser");

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

module.exports = router;
