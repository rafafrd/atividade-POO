import { Aluno } from "../models/aluno.model";
import { AlunoRepository } from "../repository/aluno.repository";

export class AlunoService {
  constructor(readonly _repository = new AlunoRepository()) {}

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
  async criar(nome:string, email:string, matricula:string, curso:string) {
    const aluno = Aluno.criar(nome, email, matricula, curso);
    await this._repository.create(aluno);
  }
  // "UPDATE alunos SET nome = ?, email = ?, matricula = ?, curso = ?, mediaFinal = ? WHERE id = ?;";
  async editar(nome: string, email: string, matricula: string, curso: string, id: number, mediaFinal?: number) {
    const aluno = Aluno.editar(nome, email, matricula, curso, id, mediaFinal);
    await this._repository.update(id, { nome, email, matricula, curso, mediaFinal });
    return aluno;
  }
  async deletar(id:number) {
    return await this._repository.delete(id);
  }
}