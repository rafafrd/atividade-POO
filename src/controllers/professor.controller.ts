import { Request, Response } from "express"; 
import { ProfessorService } from "../services/professor.service";

export class ProfessorController {
  constructor(readonly _service = new ProfessorService()) {}

  /**
   * Retorna todos os professores cadastrados no banco de dados.
   * @param req - Requisição HTTP sem parâmetros obrigatórios.
   * @param res - Resposta HTTP com a lista de professores.
   * @example
   * // GET /professores
   * // Retorno 200: { "professores": [{ id: 1, nome: "Maria", email: "maria@email.com", disciplina: "Matemática", cargaHoraria: 40 }] }
   */
  async selecionarTodos(req: Request, res: Response) {
    try {
      const professores = await this._service.selecionarTodos();
      res.status(200).json({"professores": professores});
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao selecionar professores", "details": error instanceof Error ? error.message : String(error)});
    }
  }

  /**
   * Retorna um professor específico de acordo com o ID informado.
   * @param req - Requisição HTTP com `id` como parâmetro de rota.
   * @param res - Resposta HTTP com o professor encontrado (200) ou erro 404 caso não exista.
   * @example
   * // GET /professores/1
   * // Retorno 200: { "professor": { id: 1, nome: "Maria", email: "maria@email.com", disciplina: "Matemática", cargaHoraria: 40 } }
   * // Retorno 404: { "error": "Professor não encontrado" }
   */
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

  /**
   * Retorna professores cujo nome contenha o texto informado via query parameter.
   * @param req - Requisição HTTP com `nome` como query parameter (string obrigatória).
   * @param res - Resposta HTTP com a lista de professores correspondentes (200) ou erro 400 se inválido.
   * @example
   * // GET /professores/nome?nome=Maria
   * // Retorno 200: { "professores": [{ id: 1, nome: "Maria Silva", ... }] }
   * // Retorno 400: { "error": "Nome deve ser um texto" }
   */
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

  /**
   * Retorna um professor cujo email corresponda ao texto informado via query parameter.
   * @param req - Requisição HTTP com `email` como query parameter (string obrigatória).
   * @param res - Resposta HTTP com o professor encontrado (200), erro 404 se não existir, ou 400 se inválido.
   * @example
   * // GET /professores/email?email=maria@email.com
   * // Retorno 200: { "professor": { id: 1, nome: "Maria", email: "maria@email.com", ... } }
   * // Retorno 404: { "error": "Professor não encontrado" }
   */
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

  /**
   * Cria e persiste um novo professor no banco de dados.
   * @param req - Requisição HTTP com `nome`, `email`, `disciplina` (strings) e `cargaHoraria` (number) no body.
   * @param res - Resposta HTTP com o professor criado (201) ou erro de validação (400).
   * @example
   * // POST /professores
   * // Body: { "nome": "Maria", "email": "maria@email.com", "disciplina": "Matemática", "cargaHoraria": 40 }
   * // Retorno 201: { "professor": { nome: "Maria", email: "maria@email.com", disciplina: "Matemática", cargaHoraria: 40 } }
   * // Retorno 400: { "error": "Dados inválidos para criação de professor" }
   */
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

  /**
   * Atualiza os dados de um professor existente no banco de dados.
   * @param req - Requisição HTTP com `id` nos params e `nome`, `email`, `disciplina` (strings) e `cargaHoraria` (number) no body.
   * @param res - Resposta HTTP com o professor atualizado (200) ou erro de validação (400).
   * @example
   * // PUT /professores/1
   * // Body: { "nome": "Maria Atualizada", "email": "maria@email.com", "disciplina": "Física", "cargaHoraria": 30 }
   * // Retorno 200: { "professor": { nome: "Maria Atualizada", ... } }
   * // Retorno 400: { "error": "Dados inválidos para edição de professor" }
   */
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

  /**
   * Remove um professor do banco de dados pelo seu ID.
   * @param req - Requisição HTTP com `id` como parâmetro de rota.
   * @param res - Resposta HTTP com mensagem de sucesso (200) ou erro (500).
   * @example
   * // DELETE /professores/1
   * // Retorno 200: { "message": "Professor deletado com sucesso" }
   */
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