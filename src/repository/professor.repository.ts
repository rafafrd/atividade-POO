import {db} from "../database/db.connection";
import { IProfessorRow } from "../models/professor.model";
import { ResultSetHeader } from "mysql2";

export class ProfessorRepository {
  async findAll(): Promise<IProfessorRow[]> {
    const [rows] = await db.query<IProfessorRow[]>("SELECT * FROM professores");
    return rows;
  }

  async findById(id: number): Promise<IProfessorRow | null> {
    const sql = "SELECT * FROM professores WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<IProfessorRow[]>(sql, values);
    return rows.length > 0 ? rows[0] : null;
  }

  async findByName(nome: string): Promise<IProfessorRow[]> {
    const sql = "SELECT * FROM professores WHERE nome LIKE ?;";
    const values = [`%${nome}%`];
    const [rows] = await db.execute<IProfessorRow[]>(sql, values);
    return rows;
  }

  async findByEmail(email: string): Promise<IProfessorRow[]> {
    const sql = "SELECT * FROM professores WHERE email LIKE ?;";
    const values = [`%${email}%`];
    const [rows] = await db.execute<IProfessorRow[]>(sql, values);
    return rows;
  }

  async create(professor: Omit<IProfessorRow, "id">): Promise<ResultSetHeader> {
    const sql = "INSERT INTO professores (nome, email, disciplina, cargaHoraria) VALUES (?, ?, ?, ?);";
    const values = [professor.nome, professor.email, professor.disciplina, professor.cargaHoraria];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async update(id: number, professor: Omit<IProfessorRow, "id">): Promise<ResultSetHeader> {
    const sql = "UPDATE professores SET nome = ?, email = ?, disciplina = ?, cargaHoraria = ? WHERE id = ?;";
    const values = [professor.nome, professor.email, professor.disciplina, professor.cargaHoraria, id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async delete(id: number): Promise<ResultSetHeader> {
    const sql = "DELETE FROM professores WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
}