const mysql = require('mysql');
require('dotenv').config();
const userTableSchema = require('../schemes/userScheme');
const booksTableSchema = require('../schemes/bookScheme');
const commentsTableSchema = require('../schemes/commentScheme');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados');
  createTables();
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

  connection.query(commentsTableSchema, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela de comentários:', err);
    } else {
      console.log('Tabela de comentários criada com sucesso');
    }
  });
};

module.exports = connection;
