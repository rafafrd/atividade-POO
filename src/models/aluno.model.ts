import { RowDataPacket } from "mysql2";

// Ipessoa (interface): mostrardados() -> abstract class Pessoa: -nome, -email, +Pessoa +MostrarDados() -> Aluno: -matricula, -curso, +mediaFinal, +MostrarDados(), +estaAprovado(), +inserir(), +alterar()

export interface Ipessoa {
  mostrarDados(): void;
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
  private _nome: string = ""; // deixando vazia para evitar erros de undefined, o nome é obrigatório, então não tem problema
  private _email: string;
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

  private _validarNome(value:string): void {
    if(!value || value.trim().length < 3) {
      throw new Error("Nome da pessoa deve ter pelo menos 3 caracteres")
    }
    if(value.trim().length > 45) {
      throw new Error("Nome da pessoa deve ter no máximo 45 caracteres")
    }
  }

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

  public mostrarDados(): string {
      return (`Aluno: ${this.Nome}, Email: ${this.Email}, Matrícula: ${this.Matricula}, Curso: ${this.Curso}, Média Final: ${this.MediaFinal}`);
    }

  public estaAprovado(): boolean {
    if(this._mediaFinal === undefined) {
      throw new Error("Média final não definida para o aluno");
    }
    return this._mediaFinal >= 6;
  }


  // Desing pattern => Factory Method
  public static criar(nome: string, email: string, matricula: string, curso: string): Aluno {
    return new Aluno(nome, email, matricula, curso);
  }

  public static editar(nome:string, email:string, matricula:string, curso:string, id:number, mediaFinal?: number) {
    const aluno = new Aluno(nome, email, matricula, curso, id);
    aluno.MediaFinal = mediaFinal;
    return aluno;
  }

  public static deletar(id:number): Aluno {
    const aluno = new Aluno("N/A", "N/A", "N/A", "N/A", id);
    return aluno;
  }
}