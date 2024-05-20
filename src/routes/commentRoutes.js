const express = require('express');
const { addComment, getCommentsByBookId } = require('../controllers/commentController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:bookId', verifyToken, addComment);
router.get('/:bookId', getCommentsByBookId);

module.exports = router;

