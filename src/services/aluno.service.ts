import { Aluno } from "../models/aluno.model";
import { AlunoRepository } from "../repository/aluno.repository";

export class AlunoService {
  constructor(readonly _repository = new AlunoRepository()) {}

  /**
   * Busca todos os alunos no banco de dados via repositório.
   * @returns Promise com a lista de todos os alunos.
   * @example
   * const alunos = await service.selecionarTodos();
   * // alunos => [{ id: 1, nome: "João", email: "joao@email.com", matricula: "2024001", curso: "ADS" }]
   */
  async selecionarTodos() {
    return await this._repository.findAll();
  }
  /**
   * Busca um aluno pelo seu ID no banco de dados.
   * @param id - ID único do aluno.
   * @returns Promise com o aluno encontrado ou null caso não exista.
   * @example
   * const aluno = await service.selecionarPorId(1);
   * // aluno => { id: 1, nome: "João", email: "joao@email.com", ... }
   */
  async selecionarPorId(id: number){
    return await this._repository.findById(id);
  }
  /**
   * Busca alunos cujo nome contenha o texto informado.
   * @param nome - Texto a ser pesquisado no nome do aluno.
   * @returns Promise com a lista de alunos correspondentes.
   * @example
   * const alunos = await service.selecionarPorNome("João");
   * // alunos => [{ id: 1, nome: "João Silva", ... }]
   */
  async selecionarPorNome(nome: string) {
    return await this._repository.findByName(nome);
  }
  /**
   * Busca alunos cujo email contenha o texto informado.
   * @param email - Texto a ser pesquisado no email do aluno.
   * @returns Promise com a lista de alunos correspondentes.
   * @example
   * const alunos = await service.selecionarPorEmail("joao@email.com");
   * // alunos => [{ id: 1, nome: "João", email: "joao@email.com", ... }]
   */
  async selecionarPorEmail(email: string) {
    return await this._repository.findByEmail(email);
  }
  /**
   * Instancia um Aluno via factory method e o persiste no banco de dados.
   * @param nome - Nome completo do aluno.
   * @param email - Email do aluno.
   * @param matricula - Matrícula do aluno.
   * @param curso - Curso do aluno.
   * @returns Promise com o objeto Aluno criado.
   * @example
   * const aluno = await service.criar("João", "joao@email.com", "2024001", "ADS");
   * // aluno.Nome => "João", aluno.Matricula => "2024001"
   */
  async criar(nome:string, email:string, matricula:string, curso:string) {
    const aluno = Aluno.criar(nome, email, matricula, curso);
    await this._repository.create({
        nome: aluno.Nome,
        email: aluno.Email,
        matricula: aluno.Matricula,
        curso: aluno.Curso,
        mediaFinal: aluno.MediaFinal ?? null // problema do sql, não recebe undefined, tem que ser null
    });
    return aluno;
  }
  /**
   * Instancia um Aluno editado via factory method e atualiza seus dados no banco.
   * @param nome - Novo nome do aluno.
   * @param email - Novo email do aluno.
   * @param matricula - Nova matrícula do aluno.
   * @param curso - Novo curso do aluno.
   * @param id - ID do aluno a ser atualizado.
   * @param mediaFinal - Nova média final do aluno (opcional).
   * @returns Promise com o objeto Aluno atualizado.
   * @example
   * const aluno = await service.editar("João Novo", "joao@email.com", "2024001", "ADS", 1, 8.5);
   * // aluno.Nome => "João Novo", aluno.MediaFinal => 8.5
   */
  // "UPDATE alunos SET nome = ?, email = ?, matricula = ?, curso = ?, mediaFinal = ? WHERE id = ?;";
  async editar(nome: string, email: string, matricula: string, curso: string, id: number, mediaFinal?: number) {
    const aluno = Aluno.editar(nome, email, matricula, curso, id, mediaFinal);
    await this._repository.update(id, { 
        nome: aluno.Nome, 
        email: aluno.Email, 
        matricula: aluno.Matricula, 
        curso: aluno.Curso, 
        mediaFinal: aluno.MediaFinal ?? null 
    });
    
    return aluno;
  }

  /**
   * Remove um aluno do banco de dados pelo seu ID.
   * @param id - ID do aluno a ser removido.
   * @returns Promise com o resultado da operação de deleção.
   * @example
   * await service.deletar(1);
   * // Remove o aluno de ID 1 do banco de dados
   */
  async deletar(id:number) {
    return await this._repository.delete(id);
  }
}