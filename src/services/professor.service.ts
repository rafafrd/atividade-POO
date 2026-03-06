import { Professor } from "../models/professor.model";
import { ProfessorRepository } from "../repository/professor.repository";

export class ProfessorService {
  constructor(readonly _repository = new ProfessorRepository()) {}

  /**
   * Busca todos os professores no banco de dados via repositório.
   * @returns Promise com a lista de todos os professores.
   * @example
   * const professores = await service.selecionarTodos();
   * // professores => [{ id: 1, nome: "Maria", email: "maria@email.com", disciplina: "Matemática", cargaHoraria: 40 }]
   */
  async selecionarTodos() {
    return await this._repository.findAll();
  }
  /**
   * Busca um professor pelo seu ID no banco de dados.
   * @param id - ID único do professor.
   * @returns Promise com o professor encontrado ou null caso não exista.
   * @example
   * const professor = await service.selecionarPorId(1);
   * // professor => { id: 1, nome: "Maria", email: "maria@email.com", ... }
   */
  async selecionarPorId(id: number){
    return await this._repository.findById(id);
  }
  
  /**
   * Busca professores cujo nome contenha o texto informado.
   * @param nome - Texto a ser pesquisado no nome do professor.
   * @returns Promise com a lista de professores correspondentes.
   * @example
   * const professores = await service.selecionarPorNome("Maria");
   * // professores => [{ id: 1, nome: "Maria Silva", ... }]
   */
  async selecionarPorNome(nome: string) {
    return await this._repository.findByName(nome);
  }
  /**
   * Busca professores cujo email contenha o texto informado.
   * @param email - Texto a ser pesquisado no email do professor.
   * @returns Promise com a lista de professores correspondentes.
   * @example
   * const professores = await service.selecionarPorEmail("maria@email.com");
   * // professores => [{ id: 1, nome: "Maria", email: "maria@email.com", ... }]
   */
  async selecionarPorEmail(email: string) {
    return await this._repository.findByEmail(email);
  }

  /**
   * Instancia um Professor via factory method e o persiste no banco de dados.
   * @param nome - Nome completo do professor.
   * @param email - Email do professor.
   * @param disciplina - Disciplina ministrada pelo professor.
   * @param cargaHoraria - Carga horária semanal do professor.
   * @returns Promise com o objeto Professor criado.
   * @example
   * const professor = await service.criar("Maria", "maria@email.com", "Matemática", 40);
   * // professor.Nome => "Maria", professor.Disciplina => "Matemática"
   */
  async criar(nome:string, email:string, disciplina:string, cargaHoraria:number) {
    const professor = Professor.criar(nome, email, disciplina, cargaHoraria);
    
    
    await this._repository.create({
        nome: professor.Nome,
        email: professor.Email,
        disciplina: professor.Disciplina,
        cargaHoraria: professor.CargaHoraria
    });
    
    return professor; 
  }

  /**
   * Instancia um Professor editado via factory method e atualiza seus dados no banco.
   * @param nome - Novo nome do professor.
   * @param email - Novo email do professor.
   * @param id - ID do professor a ser atualizado.
   * @param disciplina - Nova disciplina do professor.
   * @param cargaHoraria - Nova carga horária do professor.
   * @returns Promise com o objeto Professor atualizado.
   * @example
   * const professor = await service.editar("Maria Nova", "maria@email.com", 1, "Física", 30);
   * // professor.Nome => "Maria Nova", professor.Disciplina => "Física"
   */
  async editar(nome:string, email:string, id:number, disciplina:string, cargaHoraria:number) {
    const professor = Professor.editar(nome, email, id, disciplina, cargaHoraria);
    
    await this._repository.update(id, {
        nome: professor.Nome,
        email: professor.Email,
        disciplina: professor.Disciplina,
        cargaHoraria: professor.CargaHoraria
    });
    
    return professor;
  }

  /**
   * Remove um professor do banco de dados pelo seu ID.
   * @param id - ID do professor a ser removido.
   * @returns Promise com o resultado da operação de deleção.
   * @example
   * await service.deletar(1);
   * // Remove o professor de ID 1 do banco de dados
   */
  async deletar(id:number) {
    return await this._repository.delete(id);
  }
}