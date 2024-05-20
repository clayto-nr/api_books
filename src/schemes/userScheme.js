const userTableSchema = `
CREATE TABLE IF NOT EXISTS users_table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
)
`;

module.exports = userTableSchema;
