const express = require('express');
const { createBook, getAllBooks, getMyBooks, getBookById } = require('../controllers/bookController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/books', verifyToken, createBook);
router.get('/books', getAllBooks);
router.get('/my-books', verifyToken, getMyBooks);
router.get('/:bookId', getBookById);

module.exports = router;
