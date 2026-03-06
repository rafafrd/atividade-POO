import { RowDataPacket } from "mysql2";

// Ipessoa (interface): mostrardados() -> abstract class Pessoa: -nome, -email, +Pessoa +MostrarDados() -> Aluno: -matricula, -curso, +mediaFinal, +MostrarDados(), +estaAprovado(), +inserir(), +alterar()

export interface Ipessoa {
  mostrarDados(): string;
}

export interface IAlunoRow extends RowDataPacket { // RowDataPacket é necessário para o mysql2 reconhecer que essa interface é um resultado de uma query
  id: number;
  nome: string;
  email: string;
  matricula: string;
  curso: string;
  mediaFinal?: number;
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
   * this._validarNome("Jo"); // throw Error: "Nome da pessoa deve ter pelo menos 3 caracteres"
   * this._validarNome("João"); // ok
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
   * this._validarEmail("joao@email.com"); // ok
   */
  private _validarEmail(value:string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error("Email da pessoa inválido");
    }
  }
}

export class Aluno extends Pessoa {
  private _matricula: string;
  private _curso: string;
  private _mediaFinal?: number;

  constructor(nome: string, email: string, matricula: string, curso: string, id?: number) {
    super(nome, email, id);
    this._matricula = matricula;
    this._curso = curso;
  }

  // Getters
  public get Matricula(): string {
    return this._matricula;
  }
  public get Curso(): string {
    return this._curso;
  }
  public get MediaFinal(): number | undefined {
    return this._mediaFinal;
  }

  // Setters
  public set Matricula(value: string) {
    this._matricula = value;
  }
  public set Curso(value: string) {
    this._curso = value;
  }
  public set MediaFinal(value: number | undefined) {
    if(value !== undefined && (value < 0 || value > 10)) {
      throw new Error("Média final deve ser entre 0 e 10");
    }
    this._mediaFinal = value;
  }

  /**
   * Retorna uma string formatada com todos os dados do aluno.
   * @returns String com nome, email, matrícula, curso e média final do aluno.
   * @example
   * aluno.mostrarDados();
   * // => "Aluno: João, Email: joao@email.com, Matrícula: 2024001, Curso: ADS, Média Final: 8"
   */
  public mostrarDados(): string {
      return (`Aluno: ${this.Nome}, Email: ${this.Email}, Matrícula: ${this.Matricula}, Curso: ${this.Curso}, Média Final: ${this.MediaFinal}`);
    }

  /**
   * Verifica se o aluno está aprovado com base na média final (mínimo 6).
   * @returns `true` se a média final for >= 6, `false` caso contrário.
   * @throws Error se a média final não estiver definida.
   * @example
   * aluno.MediaFinal = 7;
   * aluno.estaAprovado(); // => true
   *
   * aluno.MediaFinal = 4;
   * aluno.estaAprovado(); // => false
   */
  public estaAprovado(): boolean {
    if(this._mediaFinal === undefined) {
      throw new Error("Média final não definida para o aluno");
    }
    return this._mediaFinal >= 6;
  }


  // Desing pattern => Factory Method
  /**
   * Factory Method: cria uma nova instância de Aluno sem ID (para inserção no banco).
   * @param nome - Nome do aluno.
   * @param email - Email do aluno.
   * @param matricula - Matrícula do aluno.
   * @param curso - Curso do aluno.
   * @returns Nova instância de Aluno validada.
   * @example
   * const aluno = Aluno.criar("João", "joao@email.com", "2024001", "ADS");
   * // aluno.Nome => "João", aluno.Curso => "ADS"
   */
  public static criar(nome: string, email: string, matricula: string, curso: string, mediaFinal?: number): Aluno {
    const aluno = new Aluno(nome, email, matricula, curso);
    aluno.MediaFinal = mediaFinal;
    return aluno;
  }

  /**
   * Factory Method: cria uma instância de Aluno com ID para atualização no banco.
   * @param nome - Novo nome do aluno.
   * @param email - Novo email do aluno.
   * @param matricula - Nova matrícula do aluno.
   * @param curso - Novo curso do aluno.
   * @param id - ID do aluno a ser editado.
   * @param mediaFinal - Nova média final do aluno (opcional).
   * @returns Instância de Aluno com os dados atualizados.
   * @example
   * const aluno = Aluno.editar("João Novo", "joao@email.com", "2024001", "ADS", 1, 8.5);
   * // aluno.Id => 1, aluno.MediaFinal => 8.5
   */
  public static editar(nome:string, email:string, matricula:string, curso:string, id:number, mediaFinal?: number) {
    const aluno = new Aluno(nome, email, matricula, curso, id);
    aluno.MediaFinal = mediaFinal;
    return aluno;
  }

  /**
   * Factory Method: cria uma instância mínima de Aluno contendo apenas o ID, para deleção no banco.
   * @param id - ID do aluno a ser deletado.
   * @returns Instância de Aluno com dados fictícios e apenas o ID definido.
   * @example
   * const aluno = Aluno.deletar(1);
   * // aluno.Id => 1
   */
  public static deletar(id:number): Aluno {
    const aluno = new Aluno("N/A", "N/A", "N/A", "N/A", id);
    return aluno;
  }
}