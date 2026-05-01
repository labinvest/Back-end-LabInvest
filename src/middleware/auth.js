const authService = require('../services/authService');

const authMiddleware = (req, res, next) => {
  // Tentar obter token do header ou da query (para debug)
  let token = null;
  let authHeader = req.headers.authorization;

  if (authHeader) {
    // Formato: "Bearer TOKEN"
    const [tipo, tokenFromHeader] = authHeader.split(' ');
    if (tipo === 'Bearer' && tokenFromHeader) {
      token = tokenFromHeader;
    }
  }

  // Fallback: tentar obter da query (apenas para DEBUG)
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ 
      sucesso: false,
      erro: 'Token não fornecido',
      instrucoes: {
        header: 'Adicione: Authorization: Bearer SEU_TOKEN',
        query: '?token=SEU_TOKEN (apenas para debug)',
        exemplo: 'curl -H "Authorization: Bearer abc123..." http://localhost:3000/api/admin/dashboard'
      }
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
      erro: 'Token inválido',
      detalhes: error.message,
      dica: 'Gere um novo token com: POST /api/debug/signup-admin'
    });
  }
};

module.exports = authMiddleware;
