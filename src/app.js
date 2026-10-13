import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import obrasRoutes from "./routes/obras.routes.js";
import avaliacoesRoutes from "./routes/avaliacoes.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/obras", obrasRoutes);
app.use("/avaliacoes", avaliacoesRoutes);
app.use(errorHandler);

export default app;