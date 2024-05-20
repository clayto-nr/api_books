const express = require('express');
const { registerUser, loginUser, getMe, getUsersWithBooks, getBooksByUserId, usersSearch } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getMe);
router.get('/users', usersSearch);
router.get('/user/:userId/books', getBooksByUserId);

module.exports = router;
