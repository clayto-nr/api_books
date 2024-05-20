const jwt = require('jsonwebtoken');

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

module.exports = {
  verifyToken
};
