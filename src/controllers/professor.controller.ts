import { Request, Response } from "express"; 
import { ProfessorService } from "../services/professor.service";

export class ProfessorController {
  constructor(readonly _service = new ProfessorService()) {}

  async selecionarTodos(req: Request, res: Response) {
    try {
      const professores = await this._service.selecionarTodos();
      res.status(200).json({"professores": professores});
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao selecionar professores", "details": error instanceof Error ? error.message : String(error)});
    }
  }

  async selecionarPorId(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const professor = await this._service.selecionarPorId(id);
      if (professor) {
        res.status(200).json({"professor": professor});
      } else {
        res.status(404).json({"error": "Professor não encontrado"});
      }
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao selecionar professor", "details": error instanceof Error ? error.message : String(error)});
    }
  }

  async selecionarPorNome(req: Request, res: Response) {
    try {
      const {nome} = req.query;
      if (typeof nome !== "string") {
        return res.status(400).json({"error": "Nome deve ser um texto"});
      }
      const professores = await this._service.selecionarPorNome(nome);
      res.status(200).json({"professores": professores});
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao selecionar professores por nome", "details": error instanceof Error ? error.message : String(error)});
    }
  }

  async selecionarPorEmail(req: Request, res: Response) {
    try {
      const {email} = req.query;
      if (typeof email !== "string") {
        return res.status(400).json({"error": "Email deve ser um texto"});
      }
      const professor = await this._service.selecionarPorEmail(email);
      if (professor) {
        res.status(200).json({"professor": professor});
      } else {
        res.status(404).json({"error": "Professor não encontrado"});
      }
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao selecionar professor por email", "details": error instanceof Error ? error.message : String(error)});
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const {nome, email, disciplina, cargaHoraria} = req.body;
      
      // Validação reforçada: checando se cargaHoraria é undefined pois ela pode ser 0
      if (!nome || !email || !disciplina || cargaHoraria === undefined || 
          typeof nome !== "string" || typeof email !== "string" || 
          typeof disciplina !== "string" || typeof cargaHoraria !== "number") {
        return res.status(400).json({"error": "Dados inválidos para criação de professor"});
      }
      
      const novoProfessor = await this._service.criar(nome, email, disciplina, cargaHoraria);
      res.status(201).json({"professor": novoProfessor});
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao criar professor", "details": error instanceof Error ? error.message : String(error)});
    }
  }

  async editar(req: Request, res: Response){
    try {
      const id = Number(req.params.id); 
      const {nome, email, disciplina, cargaHoraria} = req.body;
      
      if (!nome || !email || !disciplina || cargaHoraria === undefined || 
          typeof nome !== "string" || typeof email !== "string" || 
          typeof disciplina !== "string" || typeof cargaHoraria !== "number") {
        return res.status(400).json({"error": "Dados inválidos para edição de professor"});
      }
      
      const professorEditado = await this._service.editar(nome, email, id, disciplina, cargaHoraria);
      res.status(200).json({"professor": professorEditado});
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao editar professor", "details": error instanceof Error ? error.message : String(error)});
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await this._service.deletar(id);
      res.status(200).json({"message": "Professor deletado com sucesso"});
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao deletar professor", "details": error instanceof Error ? error.message : String(error)});
    }
  }
}