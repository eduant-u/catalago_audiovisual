export default function isAdmin(req, res, next) {
  if (req.usuario.papel !== "ADMIN") {
    return res.status(403).json({
      erro: "Acesso permitido apenas para administradores",
    });
  }

  next();
}