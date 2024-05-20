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

module.exports = booksTableSchema;
