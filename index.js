const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const secretKey = 'sua_chave_secreta';

const connection = mysql.createConnection({
  
  
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

app.use(bodyParser.json());

app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
  
    // Verificar se o email já está em uso
    connection.query('SELECT * FROM users_table WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Error checking email:', err);
        res.status(500).send('Error checking email');
      } else {
        if (results.length > 0) {
          // Se o email já estiver em uso, envie uma resposta indicando isso
          console.log('Email already in use');
          res.status(400).send('Email already in use');
        } else {
          // Se o email estiver disponível, proceda com o registro do usuário
          connection.query('INSERT INTO users_table (username, password, email) VALUES (?, ?, ?)', [username, password, email], (err, result) => {
            if (err) {
              console.error('Error registering user:', err);
              res.status(500).send('Error registering user');
            } else {
              console.log('User registered successfully');
              res.status(200).send('User registered successfully');
            }
          });
        }
      }
    });
  });
  

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  connection.query('SELECT * FROM users_table WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      console.error('Error logging in:', err);
      res.status(500).send('Error logging in');
    } else {
      if (results.length > 0) {
        const userId = results[0].id;
        const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
      } else {
        console.log('Invalid username or password');
        res.status(401).send('Invalid username or password');
      }
    }
  });
});

app.get('/my-books', verifyToken, (req, res) => {
  const userId = req.userId;
  connection.query('SELECT * FROM books WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching books:', err);
      res.status(500).send('Error fetching books');
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/my-books/:userId', (req, res) => {
    const userId = req.params.userId;
    connection.query('SELECT * FROM books WHERE user_id = ?', [userId], (err, results) => {
      if (err) {
        console.error('Error fetching books:', err);
        res.status(500).send('Error fetching books');
      } else {
        res.status(200).json(results);
      }
    });
  });
  
  

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access denied. No token provided.');

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token.');

    req.userId = decoded.userId;
    next();
  });
}

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
