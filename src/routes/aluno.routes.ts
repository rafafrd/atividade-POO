import { Router } from "express";
import { AlunoController } from "../controllers/aluno.controller";

const alunoRoutes = Router();
const alunoController = new AlunoController();

// get
alunoRoutes.get("/", (req, res) => alunoController.selecionarTodos(req, res));
alunoRoutes.get("/:id", (req, res) => alunoController.selecionarPorId(req, res));
alunoRoutes.get("/nome", (req, res) => alunoController.selecionarPorNome(req, res));
alunoRoutes.get("/email", (req, res) => alunoController.selecionarPorEmail(req, res));

// post
alunoRoutes.post("/", (req, res) => alunoController.criar(req, res));

// put
alunoRoutes.put("/:id", (req, res) => alunoController.editar(req, res));

// delete
alunoRoutes.delete("/:id", (req, res) => alunoController.deletar(req, res));

export default alunoRoutes;