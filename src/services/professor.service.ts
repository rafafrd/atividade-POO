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
  
  async selecionarPorNome(nome: string) {
    return await this._repository.findByName(nome);
  }
  async selecionarPorEmail(email: string) {
    return await this._repository.findByEmail(email);
  }

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

  async deletar(id:number) {
    return await this._repository.delete(id);
  }
}