const connection = require('../models/db');

const addComment = (req, res) => {
  const { bookId } = req.params;
  const { comment } = req.body;
  const userId = req.userId;

  if (!comment) {
    return res.status(400).send('Comentário é obrigatório');
  }

  const addCommentQuery = 'INSERT INTO comments (book_id, user_id, comment) VALUES (?, ?, ?)';
  connection.query(addCommentQuery, [bookId, userId, comment], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar comentário:', err);
      return res.status(500).send('Erro ao adicionar comentário');
    }

    if (result.affectedRows === 1) {
      console.log('Comentário adicionado com sucesso');
      res.status(200).send('Comentário adicionado com sucesso');
    } else {
      console.error('Erro ao adicionar comentário');
      res.status(500).send('Erro ao adicionar comentário');
    }
  });
};

const getCommentsByBookId = (req, res) => {
  const { bookId } = req.params;

  const getCommentsQuery = `
    SELECT c.id, c.comment, u.username 
    FROM comments c
    JOIN users_table u ON c.user_id = u.id
    WHERE c.book_id = ?
  `;

  connection.query(getCommentsQuery, [bookId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar comentários:', err);
      res.status(500).send('Erro ao buscar comentários');
    } else {
      res.status(200).json(results);
    }
  });
};

module.exports = {
  addComment,
  getCommentsByBookId
};
