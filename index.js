const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('./db'); 
const { userTableSchema, booksTableSchema } = require('./esquema');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

const createTables = () => {
  connection.query(userTableSchema, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela de usuários:', err);
    } else {
      console.log('Tabela de usuários criada com sucesso');
    }
  });

  connection.query(booksTableSchema, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela de livros:', err);
    } else {
      console.log('Tabela de livros criada com sucesso');
    }
  });
};

createTables();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Servidor em execução! 1.0');
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Erro ao criptografar a senha:', err);
      res.status(500).send('Erro ao registrar o usuário');
    } else {
      const createUserQuery = 'INSERT INTO users_table (username, email, password) VALUES (?, ?, ?)';
      connection.query(createUserQuery, [username, email, hashedPassword], (err) => {
        if (err) {
          console.error('Erro ao registrar o usuário:', err);
          res.status(500).send('Erro ao registrar o usuário');
        } else {
          console.log('Usuário registrado com sucesso');
          res.status(200).send('Usuário registrado com sucesso');
        }
      });
    }
  });
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).send('Acesso negado. Token não fornecido.');

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).send('Acesso negado. Token não fornecido corretamente.');

  jwt.verify(token, 'seu_segredo', (err, decoded) => {
    if (err) {
      console.error('Erro ao verificar o token:', err);
      return res.status(401).send('Token inválido.');
    }
    req.userId = decoded.userId;
    next();
  });
};

app.get('/me', verifyToken, (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).send('Usuário não autenticado.');

  const getUserQuery = 'SELECT id, username, email FROM users_table WHERE id = ?';
  connection.query(getUserQuery, [userId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados do usuário:', err);
      return res.status(500).send('Erro ao buscar dados do usuário');
    }

    if (results.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    const userData = results[0];
    res.status(200).json(userData);
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const getUserQuery = 'SELECT * FROM users_table WHERE email = ?';
  connection.query(getUserQuery, [email], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).send('Erro ao fazer login');
    }
    if (results.length === 0) {
      return res.status(401).send('Usuário não encontrado');
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error('Erro ao comparar senhas:', err);
        return res.status(500).send('Erro ao fazer login');
      }
      if (!result) {
        return res.status(401).send('Credenciais inválidas');
      }
      
      const token = jwt.sign({ userId: user.id }, 'seu_segredo', { expiresIn: '1h' });

      res.status(200).json({ userId: user.id, token });
    });
  });
});

app.get('/books', (req, res) => {
  const getBooksQuery = 'SELECT * FROM books';
  connection.query(getBooksQuery, (err, results) => {
    if (err) {
      console.error('Erro ao buscar livros:', err);
      res.status(500).send('Erro ao buscar livros');
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/books/:bookId', (req, res) => {
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
});


app.put('/books/:bookId/views', (req, res) => {
  const bookId = req.params.bookId;

  const updateViewsQuery = 'UPDATE books SET views = views + 1 WHERE id = ?';

  connection.query(updateViewsQuery, [bookId], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar as visualizações do livro:', err);
      res.status(500).send('Erro ao atualizar as visualizações do livro');
    } else {
      if (result.affectedRows === 1) {
        console.log('Visualizações do livro atualizadas com sucesso');
        res.status(200).send('Visualizações do livro atualizadas com sucesso');
      } else {
        console.error('Erro ao atualizar as visualizações do livro');
        res.status(500).send('Erro ao atualizar as visualizações do livro');
      }
    }
  });
});

app.post('/books/:bookId/comments', verifyToken, (req, res) => {
  const { bookId } = req.params;
  const { userId, comment } = req.body;

  if (!userId || !comment) {
    return res.status(400).send('ID do usuário e comentário são obrigatórios');
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
});

app.get('/my-books/:userId', verifyToken, (req, res) => {
  const userId = req.params.userId;
  const getMyBooksQuery = 'SELECT * FROM books WHERE user_id = ?';
  connection.query(getMyBooksQuery, [userId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar livros do usuário:', err);
      res.status(500).send('Erro ao buscar livros do usuário');
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/users', (req, res) => {
  const getUsersQuery = 'SELECT id, username, email FROM users_table';
  connection.query(getUsersQuery, (err, users) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      res.status(500).send('Erro ao buscar usuários');
    } else {
      const usersWithBooks = [];
      const getBooksQuery = 'SELECT * FROM books WHERE user_id = ?';
      let count = 0;

      users.forEach(user => {
        connection.query(getBooksQuery, [user.id], (err, books) => {
          if (err) {
            console.error(`Erro ao buscar livros do usuário ${user.id}:`, err);
            res.status(500).send(`Erro ao buscar livros do usuário ${user.id}`);
          } else {
            const userWithBooks = {
              id: user.id,
              username: user.username,
              email: user.email,
              books: books
            };
            usersWithBooks.push(userWithBooks);
            count++;

            if (count === users.length) {
              res.status(200).json(usersWithBooks);
            }
          }
        });
      });
    }
  });
});

app.get('/books/:bookId/comments', (req, res) => {
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
});

app.post('/books', verifyToken, (req, res) => {
  const { name, description, user_id } = req.body;

  const createBookQuery = 'INSERT INTO books (name, description, user_id) VALUES (?, ?, ?)';
  connection.query(createBookQuery, [name, description, user_id], (err, result) => {
    if (err) {
      console.error('Erro ao criar livro:', err);
      return res.status(500).send('Erro ao criar livro');
    } 
    
    if (result.affectedRows === 1) {
      console.log('Livro criado com sucesso');
      res.status(200).send('Livro criado com sucesso');
    } else {
      console.error('Erro ao criar livro');
      res.status(500).send('Erro ao criar livro');
    }
  });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
