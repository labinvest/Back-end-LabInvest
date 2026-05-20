const authService = require('../services/authService');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      sucesso: false,
      erro: 'Token não fornecido'
    });
  }

  const [tipo, token] = authHeader.split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({
      sucesso: false,
      erro: 'Formato do token inválido'
    });
  }

  try {
    const decoded = authService.validarToken(token);
    req.userId = decoded.id;
    req.userRole = decoded.role || 'user';
    next();
  } catch (error) {
    return res.status(401).json({
      sucesso: false,
      erro: 'Token inválido'
    });
  }
};

module.exports = authMiddleware;
