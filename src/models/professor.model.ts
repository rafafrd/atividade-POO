// Ipessoa (interface): mostrardados() -> abstract class Pessoa: -nome, -email, +Pessoa +MostrarDados() -> Professor: -disciplina, -cargaHoraria, +Professor, +MostrarDados(), +inserir(), +alterar()

import { RowDataPacket } from "mysql2";

export interface Ipessoa{
  mostrarDados(): string;
}

export interface IProfessorRow extends RowDataPacket {
  id: number;
  nome: string;
  email: string;
  disciplina: string;
  cargaHoraria: number;
}

abstract class Pessoa {
  readonly _id?: number;
  protected _nome: string = ""; // deixando vazia para evitar erros de undefined, o nome é obrigatório, então não tem problema
  protected _email: string;
  readonly _dataCad?: Date;

  constructor(nome: string, email: string, id?: number) {
    this._nome = nome;
    this._email = email;
    this._id = id;
  }

  // Getters
  public get Id(): number | undefined {
    return this._id;
  }

  public get Nome(): string {
    return this._nome;
  }
  public get Email(): string {
    return this._email;
  }

  public get DataCad(): Date | undefined {
    return this._dataCad;
  }

  // Setters
  public set Nome(value: string) {
    this._validarNome(value);
    this._nome = value;
  }

    public set Email(value: string) {
    this._validarEmail(value);
    this._email = value;
  }

  /**
   * Valida o nome informado, garantindo que tenha entre 3 e 45 caracteres.
   * @param value - Nome a ser validado.
   * @throws Error se o nome tiver menos de 3 ou mais de 45 caracteres.
   * @example
   * this._validarNome("Ma"); // throw Error: "Nome da pessoa deve ter pelo menos 3 caracteres"
   * this._validarNome("Maria"); // ok
   */
  private _validarNome(value:string): void {
    if(!value || value.trim().length < 3) {
      throw new Error("Nome da pessoa deve ter pelo menos 3 caracteres")
    }
    if(value.trim().length > 45) {
      throw new Error("Nome da pessoa deve ter no máximo 45 caracteres")
    }
  }

  /**
   * Valida o email informado, garantindo que esteja em formato válido.
   * @param value - Email a ser validado.
   * @throws Error se o email não estiver no formato correto (usuario@dominio.ext).
   * @example
   * this._validarEmail("email-invalido"); // throw Error: "Email da pessoa inválido"
   * this._validarEmail("maria@email.com"); // ok
   */
  private _validarEmail(value:string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error("Email da pessoa inválido");
    }
  }
}

export class Professor extends Pessoa {
  private _disciplina: string
  private _cargaHoraria: number;

  constructor(nome: string, email: string, disciplina: string, cargaHoraria: number, id?: number) {
    super(nome, email, id);
    this._disciplina = disciplina;
    this._cargaHoraria = cargaHoraria;
  }

  // Getters
  public get Disciplina(): string {
    return this._disciplina;
  }

  public get CargaHoraria(): number {
    return this._cargaHoraria;
  }

  // Setters
  public set Disciplina(value: string) {
    this._disciplina = value;
  }

  public set CargaHoraria(value: number) {
  if(value < 0) {
    throw new Error("Carga horária não pode ser negativa");
  }
  this._cargaHoraria = value;
  }

  /**
   * Retorna uma string formatada com todos os dados do professor.
   * @returns String com nome, email, disciplina e carga horária do professor.
   * @example
   * professor.mostrarDados();
   * // => "Professor: Maria, Email: maria@email.com, Disciplina: Matemática, Carga Horária: 40"
   */
  public mostrarDados(): string {
    return (`Professor: ${this.Nome}, Email: ${this.Email}, Disciplina: ${this.Disciplina}, Carga Horária: ${this.CargaHoraria}`);
  }

  // Desing pattern => Factory Method
  /**
   * Factory Method: cria uma nova instância de Professor sem ID (para inserção no banco).
   * @param nome - Nome do professor.
   * @param email - Email do professor.
   * @param disciplina - Disciplina ministrada.
   * @param cargaHoraria - Carga horária semanal.
   * @returns Nova instância de Professor validada.
   * @example
   * const professor = Professor.criar("Maria", "maria@email.com", "Matemática", 40);
   * // professor.Nome => "Maria", professor.Disciplina => "Matemática"
   */
  public static criar(nome: string, email: string, disciplina: string, cargaHoraria: number): Professor {
    return new Professor(nome, email, disciplina, cargaHoraria);
  }

  /**
   * Factory Method: cria uma instância de Professor com ID para atualização no banco.
   * @param nome - Novo nome do professor.
   * @param email - Novo email do professor.
   * @param id - ID do professor a ser editado.
   * @param disciplina - Nova disciplina do professor.
   * @param cargaHoraria - Nova carga horária do professor.
   * @returns Instância de Professor com os dados atualizados.
   * @example
   * const professor = Professor.editar("Maria Nova", "maria@email.com", 1, "Física", 30);
   * // professor.Id => 1, professor.Disciplina => "Física"
   */
  public static editar(nome:string, email:string, id:number, disciplina:string, cargaHoraria:number): Professor {
    return new Professor(nome, email, disciplina, cargaHoraria, id);
  }

  /**
   * Factory Method: cria uma instância mínima de Professor contendo apenas o ID, para deleção no banco.
   * @param id - ID do professor a ser deletado.
   * @returns Instância de Professor com dados fictícios e apenas o ID definido.
   * @example
   * const professor = Professor.deletar(1);
   * // professor.Id => 1
   */
  public static deletar(id:number): Professor {
    const professor = new Professor("N/A", "N/A", "N/A", 0, id);
    return professor;
  }
}