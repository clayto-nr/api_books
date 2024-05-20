const express = require('express');
const { addComment, getCommentsByBookId } = require('../controllers/commentController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:bookId/comments', verifyToken, addComment);
router.get('/:bookId/comments', getCommentsByBookId);

module.exports = router;
