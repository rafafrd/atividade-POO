import { Router } from "express";
import alunoRoutes from "./aluno.routes";
import professorRoutes from "./professor.routes";

const router = Router();

router.use("/alunos", alunoRoutes);
router.use("/professores", professorRoutes);

export default router;