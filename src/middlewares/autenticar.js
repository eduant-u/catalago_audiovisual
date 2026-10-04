import jwt from "jsonwebtoken";

export default function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      erro: "Token não informado",
    });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({
      erro: "Token inválido",
    });
  }

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = {
      id: dados.id,
      papel: dados.papel,
    };

    next();
  } catch {
    return res.status(401).json({
      erro: "Token inválido ou expirado",
    });
  }
}