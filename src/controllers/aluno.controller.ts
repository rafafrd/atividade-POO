import { Request, Response } from "express"; 
import { AlunoService } from "../services/aluno.service";

export class AlunoController {
  constructor(readonly _service = new AlunoService()) {}
  /**
   * 
   * @param req 
   * @param res 
   */
  async selecionarTodos(req: Request, res: Response) {
    try {
      const alunos = await this._service.selecionarTodos();
      res.status(200).json({"alunos": alunos});
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao selecionar alunos", "details": error instanceof Error ? error.message : String(error)});
    }
  }

  async selecionarPorId(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const aluno = await this._service.selecionarPorId(id);
      if (aluno) {
        res.status(200).json({"aluno": aluno});
      } else {
        res.status(404).json({"error": "Aluno não encontrado"});
      }
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao selecionar aluno", "details": error instanceof Error ? error.message : String(error)});
    }
  }

  async selecionarPorNome(req: Request, res: Response) {
    try {
      const {nome} = req.query;
      if (typeof nome !== "string") {
        return res.status(400).json({"error": "Nome deve ser um texto"});
      }
      const alunos = await this._service.selecionarPorNome(nome);
      res.status(200).json({"alunos": alunos});
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao selecionar alunos por nome", "details": error instanceof Error ? error.message : String(error)});
    }
  }

  async selecionarPorEmail(req: Request, res: Response) {
    try {
      const {email} = req.query;
      if (typeof email !== "string") {
        return res.status(400).json({"error": "Email deve ser um texto"});
      }
      const aluno = await this._service.selecionarPorEmail(email);
      if (aluno) {
        res.status(200).json({"aluno": aluno});
      } else {
        res.status(404).json({"error": "Aluno não encontrado"});
      }
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao selecionar aluno por email", "details": error instanceof Error ? error.message : String(error)});
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const {nome, email, matricula, curso} = req.body;
      if (!nome || !email || !matricula || !curso || typeof nome !== "string" || typeof email !== "string" || typeof matricula !== "string" || typeof curso !== "string") {
        return res.status(400).json({"error": "Dados inválidos para criação de aluno"});
      }
      const novoAluno = await this._service.criar(nome, email, matricula, curso);
      res.status(201).json({"aluno": novoAluno});
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao criar aluno", "details": error instanceof Error ? error.message : String(error)});
    }
  }

  async editar(req: Request, res: Response){
    // "UPDATE alunos SET nome = ?, email = ?, matricula = ?, curso = ?, mediaFinal = ? WHERE id = ?;";
    try {
      const id = Number(req.params.id); // where
      const {nome, email, matricula, curso, mediaFinal} = req.body; // set
      if (!nome || !email || !matricula || !curso || typeof nome !== "string" || typeof email !== "string" || typeof matricula !== "string" || typeof curso !== "string") {
        return res.status(400).json({"error": "Dados inválidos para edição de aluno"});
      }
      const alunoEditado = await this._service.editar(nome, email, matricula, curso, id, mediaFinal);
      res.status(200).json({"aluno": alunoEditado});
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao editar aluno", "details": error instanceof Error ? error.message : String(error)});
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await this._service.deletar(id);
      res.status(200).json({"message": "Aluno deletado com sucesso"});
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao deletar aluno", "details": error instanceof Error ? error.message : String(error)});
    }
  }
}