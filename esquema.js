const userTableSchema = `
CREATE TABLE IF NOT EXISTS users_table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
)
`;

const booksTableSchema = `
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  user_id INT NOT NULL,
  views INT NOT NULL DEFAULT 0, -- Adicionando a coluna 'views'
  FOREIGN KEY (user_id) REFERENCES users_table(id)
)
`;

const commentsTableSchema = `
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  user_id INT NOT NULL,
  username VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (user_id) REFERENCES users_table(id)
)
`;

module.exports = {
  userTableSchema,
  booksTableSchema,
  commentsTableSchema
};
