import { Router } from "express";
import { ProfessorController } from "../controllers/professor.controller";

const professorRoutes = Router();
const professorController = new ProfessorController();

// get
professorRoutes.get("/", (req, res) => professorController.selecionarTodos(req, res));
professorRoutes.get("/nome", (req, res) => professorController.selecionarPorNome(req, res));
professorRoutes.get("/email", (req, res) => professorController.selecionarPorEmail(req, res));
professorRoutes.get("/:id", (req, res) => professorController.selecionarPorId(req, res));

// post
professorRoutes.post("/", (req, res) => professorController.criar(req, res));

// put
professorRoutes.put("/:id", (req, res) => professorController.editar(req, res));

// delete
professorRoutes.delete("/:id", (req, res) => professorController.deletar(req, res));

export default professorRoutes;