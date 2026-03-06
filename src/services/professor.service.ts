import { Professor } from "../models/professor.model";
import { ProfessorRepository } from "../repository/professor.repository";

export class ProfessorService {
  constructor(readonly _repository = new ProfessorRepository()) {}

  async selecionarTodos() {
    return await this._repository.findAll();
  }
  async selecionarPorId(id: number){
    return await this._repository.findById(id);
  }
  async criar(nome:string, email:string, disciplina:string, cargaHoraria:number) {
    const professor = Professor.criar(nome, email, disciplina, cargaHoraria);
    await this._repository.create(professor);
  }
  async editar(nome:string, email:string, id:number, disciplina:string, cargaHoraria:number) {
    const professor = Professor.editar(nome, email, id, disciplina, cargaHoraria);
    await this._repository.update(id, professor);
  }
  async deletar(id:number) {
    return await this._repository.delete(id);
  }
}