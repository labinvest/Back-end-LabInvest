const authMiddleware = require('./auth');

const adminMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.userRole !== 'ADMIN') {
      return res.status(403).json({
        sucesso: false,
        erro: 'Acesso negado. Apenas administradores podem acessar este recurso.',
      });
    }
    next();
  });
};

module.exports = adminMiddleware;
