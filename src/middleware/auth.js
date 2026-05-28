const authService = require('../services/authService');
const prisma = require('../lib/prisma');

const authMiddleware = async (req, res, next) => {
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

    const usuario = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true,
        ativo: true,
        perfil: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Usuário inválido ou inativo'
      });
    }

    req.userId = usuario.id;
    req.userRole = usuario.role;
    req.userPerfilId = usuario.perfil?.id || null;
    next();
  } catch (error) {
    return res.status(401).json({
      sucesso: false,
      erro: 'Token inválido'
    });
  }
};

module.exports = authMiddleware;
