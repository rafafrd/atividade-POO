import {db} from "../database/db.connection";
import { IAlunoRow } from "../models/aluno.model";
import { ResultSetHeader } from "mysql2";

export class AlunoRepository {
  /**
   * Busca todos os registros da tabela `alunos` no banco de dados.
   * @returns Promise com a lista de todos os alunos como IAlunoRow[].
   * @example
   * const alunos = await repository.findAll();
   * // alunos => [{ id: 1, nome: "João", email: "joao@email.com", matricula: "2024001", curso: "ADS", mediaFinal: 8 }]
   */
  async findAll(): Promise<IAlunoRow[]> {
    const [rows] = await db.query<IAlunoRow[]>("SELECT * FROM alunos");
    return rows;
  }
  /**
   * Busca um aluno pelo ID na tabela `alunos`.
   * @param id - ID único do aluno.
   * @returns Promise com o aluno encontrado (IAlunoRow) ou null caso não exista.
   * @example
   * const aluno = await repository.findById(1);
   * // aluno => { id: 1, nome: "João", email: "joao@email.com", ... }
   * // aluno => null (se não encontrado)
   */
  async findById(id: number): Promise<IAlunoRow | null> {
    const sql = "SELECT * FROM alunos WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<IAlunoRow[]>(sql, values);
    return rows.length > 0 ? rows[0] : null;
  }
  /**
   * Busca alunos cujo nome seja similar ao texto informado (usando LIKE).
   * @param nome - Texto parcial para busca no campo nome.
   * @returns Promise com a lista de alunos correspondentes.
   * @example
   * const alunos = await repository.findByName("João");
   * // SQL: WHERE nome LIKE '%João%'
   * // alunos => [{ id: 1, nome: "João Silva", ... }]
   */
  async findByName(nome: string): Promise<IAlunoRow[]> {
    const sql = "SELECT * FROM alunos WHERE nome LIKE ?;";
    const values = [`%${nome}%`];
    const [rows] = await db.execute<IAlunoRow[]>(sql, values);
    return rows;
  }
  /**
   * Busca alunos cujo email seja similar ao texto informado (usando LIKE).
   * @param email - Texto parcial para busca no campo email.
   * @returns Promise com a lista de alunos correspondentes.
   * @example
   * const alunos = await repository.findByEmail("joao@email.com");
   * // SQL: WHERE email LIKE '%joao@email.com%'
   * // alunos => [{ id: 1, nome: "João", email: "joao@email.com", ... }]
   */
  async findByEmail(email: string): Promise<IAlunoRow[]> {
    const sql = "SELECT * FROM alunos WHERE email LIKE ?;";
    const values = [`%${email}%`];
    const [rows] = await db.execute<IAlunoRow[]>(sql, values);
    return rows;
  }
  /**
   * Insere um novo aluno na tabela `alunos` do banco de dados.
   * @param aluno - Objeto com os dados do aluno (sem o campo `id`).
   * @returns Promise com o ResultSetHeader contendo o ID gerado e linhas afetadas.
   * @example
   * const result = await repository.create({ nome: "João", email: "joao@email.com", matricula: "2024001", curso: "ADS", mediaFinal: null });
   * // result.insertId => 1, result.affectedRows => 1
   */
  async create(aluno: Omit<IAlunoRow, "id">): Promise<ResultSetHeader> {
    const sql = "INSERT INTO alunos (nome, email, matricula, curso, mediaFinal) VALUES (?, ?, ?, ?, ?);";
    const values = [aluno.nome, aluno.email, aluno.matricula, aluno.curso, aluno.mediaFinal];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
  /**
   * Atualiza os dados de um aluno existente na tabela `alunos`.
   * @param id - ID do aluno a ser atualizado.
   * @param aluno - Objeto com os novos dados do aluno (sem o campo `id`).
   * @returns Promise com o ResultSetHeader contendo as linhas afetadas.
   * @example
   * const result = await repository.update(1, { nome: "João Novo", email: "joao@email.com", matricula: "2024001", curso: "ADS", mediaFinal: 8.5 });
   * // result.affectedRows => 1
   */
  async update(id: number, aluno: Omit<IAlunoRow, "id">): Promise<ResultSetHeader> {
    const sql = "UPDATE alunos SET nome = ?, email = ?, matricula = ?, curso = ?, mediaFinal = ? WHERE id = ?;";
    const values = [aluno.nome, aluno.email, aluno.matricula, aluno.curso, aluno.mediaFinal, id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
  /**
   * Remove um aluno da tabela `alunos` pelo seu ID.
   * @param id - ID do aluno a ser removido.
   * @returns Promise com o ResultSetHeader contendo as linhas afetadas.
   * @example
   * const result = await repository.delete(1);
   * // result.affectedRows => 1
   */
  async delete(id: number): Promise<ResultSetHeader> {
    const sql = "DELETE FROM alunos WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
}