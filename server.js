require('dotenv').config();
const app = require('./src/app');

// Em produção (Vercel) o runtime gerencia o servidor — apenas exportamos o app.
// Em desenvolvimento rodamos com listen() normalmente.
if (require.main === module) {
  const http = require('http');
  const port = process.env.PORT || 3000;
  http.createServer(app).listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Ambiente: ${process.env.NODE_ENV}`);
  });
}

module.exports = app;
