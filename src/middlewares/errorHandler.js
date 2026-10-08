export default function errorHandler(erro, req, res, next) {
  console.error(erro);

  const status = erro.status || 500;

  return res.status(status).json({
    erro: erro.message || "Erro interno do servidor",
  });
}