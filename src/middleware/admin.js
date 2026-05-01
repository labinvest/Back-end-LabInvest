const authMiddleware = require('./auth');

const adminMiddleware = (req, res, next) => {
  // Primeiro verifica autenticação
  authMiddleware(req, res, () => {
    // Depois verifica se é admin
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        sucesso: false,
        erro: 'Acesso negado. Apenas administradores podem acessar este recurso.'
      });
    }
    next();
  });
};

module.exports = adminMiddleware;
