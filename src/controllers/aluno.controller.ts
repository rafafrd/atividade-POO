import { Request, Response } from "express"; 
import { AlunoService } from "../services/aluno.service";

export class AlunoController {
  constructor(readonly _service = new AlunoService()) {}
  /**
   * Retorna todos os alunos cadastrados no banco de dados.
   * @param req - Requisição HTTP sem parâmetros obrigatórios.
   * @param res - Resposta HTTP com a lista de alunos.
   * @example
   * // GET /alunos
   * // Retorno 200: { "alunos": [{ id: 1, nome: "João", email: "joao@email.com", matricula: "2024001", curso: "ADS", mediaFinal: 8 }] }
   */
  async selecionarTodos(req: Request, res: Response) {
    try {
      const alunos = await this._service.selecionarTodos();
      res.status(200).json({"alunos": alunos});
    } catch (error: unknown) {
      res.status(500).json({"error": "Erro ao selecionar alunos", "details": error instanceof Error ? error.message : String(error)});
    }
  }

  /**
   * Retorna um aluno específico de acordo com o ID informado.
   * @param req - Requisição HTTP com `id` como parâmetro de rota.
   * @param res - Resposta HTTP com o aluno encontrado (200) ou erro 404 caso não exista.
   * @example
   * // GET /alunos/1
   * // Retorno 200: { "aluno": { id: 1, nome: "João", email: "joao@email.com", matricula: "2024001", curso: "ADS" } }
   * // Retorno 404: { "error": "Aluno não encontrado" }
   */
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

  /**
   * Retorna alunos cujo nome contenha o texto informado via query parameter.
   * @param req - Requisição HTTP com `nome` como query parameter (string obrigatória).
   * @param res - Resposta HTTP com a lista de alunos correspondentes (200) ou erro 400 se inválido.
   * @example
   * // GET /alunos/nome?nome=João
   * // Retorno 200: { "alunos": [{ id: 1, nome: "João Silva", ... }] }
   * // Retorno 400: { "error": "Nome deve ser um texto" }
   */
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

  /**
   * Retorna um aluno cujo email corresponda ao texto informado via query parameter.
   * @param req - Requisição HTTP com `email` como query parameter (string obrigatória).
   * @param res - Resposta HTTP com o aluno encontrado (200), erro 404 se não existir, ou 400 se inválido.
   * @example
   * // GET /alunos/email?email=joao@email.com
   * // Retorno 200: { "aluno": { id: 1, nome: "João", email: "joao@email.com", ... } }
   * // Retorno 404: { "error": "Aluno não encontrado" }
   */
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

  /**
   * Cria e persiste um novo aluno no banco de dados.
   * @param req - Requisição HTTP com `nome`, `email`, `matricula` e `curso` (todos strings) no body.
   * @param res - Resposta HTTP com o aluno criado (201) ou erro de validação (400).
   * @example
   * // POST /alunos
   * // Body: { "nome": "João", "email": "joao@email.com", "matricula": "2024001", "curso": "ADS" }
   * // Retorno 201: { "aluno": { nome: "João", email: "joao@email.com", matricula: "2024001", curso: "ADS" } }
   * // Retorno 400: { "error": "Dados inválidos para criação de aluno" }
   */
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

  /**
   * Atualiza os dados de um aluno existente no banco de dados.
   * @param req - Requisição HTTP com `id` nos params e `nome`, `email`, `matricula`, `curso` (strings) e `mediaFinal` (opcional, number) no body.
   * @param res - Resposta HTTP com o aluno atualizado (200) ou erro de validação (400).
   * @example
   * // PUT /alunos/1
   * // Body: { "nome": "João Atualizado", "email": "joao@email.com", "matricula": "2024001", "curso": "ADS", "mediaFinal": 8.5 }
   * // Retorno 200: { "aluno": { nome: "João Atualizado", email: "joao@email.com", ... } }
   * // Retorno 400: { "error": "Dados inválidos para edição de aluno" }
   */
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

  /**
   * Remove um aluno do banco de dados pelo seu ID.
   * @param req - Requisição HTTP com `id` como parâmetro de rota.
   * @param res - Resposta HTTP com mensagem de sucesso (200) ou erro (500).
   * @example
   * // DELETE /alunos/1
   * // Retorno 200: { "message": "Aluno deletado com sucesso" }
   */
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