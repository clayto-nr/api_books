// schema.js

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'reabdeveloper.cnc2uo2c2n1k.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '2vbboakuKu.',
    database: 'reabdeveloperr',
    port: 3306
  });

// Esquema para criar as tabelas
const createTables = () => {
  connection.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      return;
    }
    console.log('Conectado ao banco de dados');

    const createUserTableQuery = `
      CREATE TABLE IF NOT EXISTS users_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `;

    const createBooksTableQuery = `
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        user_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users_table(id)
      )
    `;

    // Executa as queries para criar as tabelas
    connection.query(createUserTableQuery, (err) => {
      if (err) {
        console.error('Erro ao criar a tabela de usuários:', err);
      } else {
        console.log('Tabela de usuários criada com sucesso');
      }
    });

    connection.query(createBooksTableQuery, (err) => {
      if (err) {
        console.error('Erro ao criar a tabela de livros:', err);
      } else {
        console.log('Tabela de livros criada com sucesso');
      }
    });
  });
};

module.exports = createTables;
