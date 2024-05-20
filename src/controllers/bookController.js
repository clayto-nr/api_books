const connection = require('../models/db');

const createBook = (req, res) => {
  const { name, description } = req.body;
  const userId = req.userId;

  const createBookQuery = 'INSERT INTO books (name, description, user_id) VALUES (?, ?, ?)';
  connection.query(createBookQuery, [name, description, userId], (err, result) => {
    if (err) {
      console.error('Erro ao criar livro:', err);
      return res.status(500).send('Erro ao criar livro');
    }

    if (result.affectedRows === 1) {
      const newBookId = result.insertId;
      const getNewBookQuery = 'SELECT * FROM books WHERE id = ?';
      connection.query(getNewBookQuery, [newBookId], (err, bookResult) => {
        if (err) {
          console.error('Erro ao buscar o novo livro criado:', err);
          return res.status(500).send('Erro ao buscar o novo livro criado');
        }
        const newBook = bookResult[0];
        res.status(200).json(newBook);
      });
    } else {
      console.error('Erro ao criar livro');
      res.status(500).send('Erro ao criar livro');
    }
  });
};

const getAllBooks = (req, res) => {
  const getAllBooksQuery = 'SELECT * FROM books';
  connection.query(getAllBooksQuery, (err, results) => {
    if (err) {
      console.error('Erro ao buscar livros:', err);
      res.status(500).send('Erro ao buscar livros');
    } else {
      res.status(200).json(results);
    }
  });
};

const getMyBooks = (req, res) => {
  const userId = req.userId;

  const getMyBooksQuery = 'SELECT * FROM books WHERE user_id = ?';
  connection.query(getMyBooksQuery, [userId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar livros do usuário:', err);
      res.status(500).send('Erro ao buscar livros do usuário');
    } else {
      res.status(200).json(results);
    }
  });
};

const getBookById = (req, res) => {
  const bookId = req.params.bookId;
  const getBookQuery = 'SELECT * FROM books WHERE id = ?';
  const updateViewsQuery = 'UPDATE books SET views = views + 1 WHERE id = ?';

  connection.beginTransaction(err => {
    if (err) {
      console.error('Erro ao iniciar a transação:', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }

    connection.query(getBookQuery, [bookId], (err, result) => {
      if (err) {
        console.error('Erro ao buscar livro:', err);
        connection.rollback(() => {
          res.status(500).send('Erro ao buscar livro');
        });
        return;
      }

      if (result.length === 0) {
        connection.rollback(() => {
          res.status(404).send('Livro não encontrado');
        });
        return;
      }

      const book = result[0];

      connection.query(updateViewsQuery, [bookId], (err) => {
        if (err) {
          console.error('Erro ao atualizar visualizações do livro:', err);
          connection.rollback(() => {
            res.status(500).send('Erro ao atualizar visualizações do livro');
          });
          return;
        }

        connection.commit(err => {
          if (err) {
            console.error('Erro ao confirmar a transação:', err);
            connection.rollback(() => {
              res.status(500).send('Erro interno do servidor');
            });
            return;
          }

          res.status(200).json({
            ...book,
            views: book.views + 1
          });
        });
      });
    });
  });
};

module.exports = {
  createBook,
  getAllBooks,
  getMyBooks,
  getBookById
};
