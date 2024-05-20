const express = require('express');
const { createBook, getAllBooks, getMyBooks, getBookById } = require('../controllers/bookController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, createBook);
router.get('/', getAllBooks);
router.get('/my-books', verifyToken, getMyBooks);
router.get('/:bookId', getBookById);

module.exports = router;
