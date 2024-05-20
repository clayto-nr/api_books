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

module.exports = commentsTableSchema;
