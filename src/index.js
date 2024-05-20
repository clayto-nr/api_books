const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models/db');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.send('Servidor em execução! 1.0');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
