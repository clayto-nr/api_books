const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../models/db');

const registerUser = (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Erro ao criptografar a senha:', err);
      return res.status(500).send('Erro ao registrar o usuário');
    }
    
    const createUserQuery = 'INSERT INTO users_table (username, email, password) VALUES (?, ?, ?)';
    connection.query(createUserQuery, [username, email, hashedPassword], (err) => {
      if (err) {
        console.error('Erro ao registrar o usuário:', err);
        return res.status(500).send('Erro ao registrar o usuário');
      }

      console.log('Usuário registrado com sucesso');
      res.status(200).send('Usuário registrado com sucesso');
    });
  });
};

const loginUser = (req, res) => {
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
};

const getMe = (req, res) => {
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
};

const getUsersWithBooks = (req, res) => {
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
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsersWithBooks
};
