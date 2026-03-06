import {db} from "../database/db.connection";
import { IAlunoRow } from "../models/aluno.model";
import { ResultSetHeader } from "mysql2";

export class AlunoRepository {
  async findAll(): Promise<IAlunoRow[]> {
    const [rows] = await db.query<IAlunoRow[]>("SELECT * FROM alunos");
    return rows;
  }
  async findById(id: number): Promise<IAlunoRow | null> {
    const sql = "SELECT * FROM alunos WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<IAlunoRow[]>(sql, values);
    return rows.length > 0 ? rows[0] : null;
  }
  async findByName(nome: string): Promise<IAlunoRow[]> {
    const sql = "SELECT * FROM alunos WHERE nome LIKE ?;";
    const values = [`%${nome}%`];
    const [rows] = await db.execute<IAlunoRow[]>(sql, values);
    return rows;
  }
  async findByEmail(email: string): Promise<IAlunoRow[]> {
    const sql = "SELECT * FROM alunos WHERE email LIKE ?;";
    const values = [`%${email}%`];
    const [rows] = await db.execute<IAlunoRow[]>(sql, values);
    return rows;
  }
  async create(aluno: Omit<IAlunoRow, "id">): Promise<ResultSetHeader> {
    const sql = "INSERT INTO alunos (nome, email, matricula, curso, mediaFinal) VALUES (?, ?, ?, ?, ?);";
    const values = [aluno.nome, aluno.email, aluno.matricula, aluno.curso, aluno.mediaFinal];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
  async update(id: number, aluno: Omit<IAlunoRow, "id">): Promise<ResultSetHeader> {
    const sql = "UPDATE alunos SET nome = ?, email = ?, matricula = ?, curso = ?, mediaFinal = ? WHERE id = ?;";
    const values = [aluno.nome, aluno.email, aluno.matricula, aluno.curso, aluno.mediaFinal, id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
  async delete(id: number): Promise<ResultSetHeader> {
    const sql = "DELETE FROM alunos WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
}