import {db} from "../database/db.connection";
import { IProfessorRow } from "../models/professor.model";
import { ResultSetHeader } from "mysql2";

export class ProfessorRepository {
  /**
   * Busca todos os registros da tabela `professores` no banco de dados.
   * @returns Promise com a lista de todos os professores como IProfessorRow[].
   * @example
   * const professores = await repository.findAll();
   * // professores => [{ id: 1, nome: "Maria", email: "maria@email.com", disciplina: "Matemática", cargaHoraria: 40 }]
   */
  async findAll(): Promise<IProfessorRow[]> {
    const [rows] = await db.query<IProfessorRow[]>("SELECT * FROM professores");
    return rows;
  }

  /**
   * Busca um professor pelo ID na tabela `professores`.
   * @param id - ID único do professor.
   * @returns Promise com o professor encontrado (IProfessorRow) ou null caso não exista.
   * @example
   * const professor = await repository.findById(1);
   * // professor => { id: 1, nome: "Maria", email: "maria@email.com", ... }
   * // professor => null (se não encontrado)
   */
  async findById(id: number): Promise<IProfessorRow | null> {
    const sql = "SELECT * FROM professores WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<IProfessorRow[]>(sql, values);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Busca professores cujo nome seja similar ao texto informado (usando LIKE).
   * @param nome - Texto parcial para busca no campo nome.
   * @returns Promise com a lista de professores correspondentes.
   * @example
   * const professores = await repository.findByName("Maria");
   * // SQL: WHERE nome LIKE '%Maria%'
   * // professores => [{ id: 1, nome: "Maria Silva", ... }]
   */
  async findByName(nome: string): Promise<IProfessorRow[]> {
    const sql = "SELECT * FROM professores WHERE nome LIKE ?;";
    const values = [`%${nome}%`];
    const [rows] = await db.execute<IProfessorRow[]>(sql, values);
    return rows;
  }

  /**
   * Busca professores cujo email seja similar ao texto informado (usando LIKE).
   * @param email - Texto parcial para busca no campo email.
   * @returns Promise com a lista de professores correspondentes.
   * @example
   * const professores = await repository.findByEmail("maria@email.com");
   * // SQL: WHERE email LIKE '%maria@email.com%'
   * // professores => [{ id: 1, nome: "Maria", email: "maria@email.com", ... }]
   */
  async findByEmail(email: string): Promise<IProfessorRow[]> {
    const sql = "SELECT * FROM professores WHERE email LIKE ?;";
    const values = [`%${email}%`];
    const [rows] = await db.execute<IProfessorRow[]>(sql, values);
    return rows;
  }

  /**
   * Insere um novo professor na tabela `professores` do banco de dados.
   * @param professor - Objeto com os dados do professor (sem o campo `id`).
   * @returns Promise com o ResultSetHeader contendo o ID gerado e linhas afetadas.
   * @example
   * const result = await repository.create({ nome: "Maria", email: "maria@email.com", disciplina: "Matemática", cargaHoraria: 40 });
   * // result.insertId => 1, result.affectedRows => 1
   */
  async create(professor: Omit<IProfessorRow, "id">): Promise<ResultSetHeader> {
    const sql = "INSERT INTO professores (nome, email, disciplina, cargaHoraria) VALUES (?, ?, ?, ?);";
    const values = [professor.nome, professor.email, professor.disciplina, professor.cargaHoraria];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  /**
   * Atualiza os dados de um professor existente na tabela `professores`.
   * @param id - ID do professor a ser atualizado.
   * @param professor - Objeto com os novos dados do professor (sem o campo `id`).
   * @returns Promise com o ResultSetHeader contendo as linhas afetadas.
   * @example
   * const result = await repository.update(1, { nome: "Maria Nova", email: "maria@email.com", disciplina: "Física", cargaHoraria: 30 });
   * // result.affectedRows => 1
   */
  async update(id: number, professor: Omit<IProfessorRow, "id">): Promise<ResultSetHeader> {
    const sql = "UPDATE professores SET nome = ?, email = ?, disciplina = ?, cargaHoraria = ? WHERE id = ?;";
    const values = [professor.nome, professor.email, professor.disciplina, professor.cargaHoraria, id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  /**
   * Remove um professor da tabela `professores` pelo seu ID.
   * @param id - ID do professor a ser removido.
   * @returns Promise com o ResultSetHeader contendo as linhas afetadas.
   * @example
   * const result = await repository.delete(1);
   * // result.affectedRows => 1
   */
  async delete(id: number): Promise<ResultSetHeader> {
    const sql = "DELETE FROM professores WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
}