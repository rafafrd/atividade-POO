import { Router } from "express";
import alunoRoutes from "./aluno.routes";

const router = Router();

router.use("/", alunoRoutes);

export default router;
