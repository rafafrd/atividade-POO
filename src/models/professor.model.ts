// Ipessoa (interface): mostrardados() -> abstract class Pessoa: -nome, -email, +Pessoa +MostrarDados() -> Professor: -disciplina, -cargaHoraria, +Professor, +MostrarDados(), +inserir(), +alterar()

import { RowDataPacket } from "mysql2";

export interface Ipessoa{
  mostrarDados(): void;
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

  public mostrarDados(): string {
    return (`Professor: ${this.Nome}, Email: ${this.Email}, Disciplina: ${this.Disciplina}, Carga Horária: ${this.CargaHoraria}`);
  }

  // Desing pattern => Factory Method
  public static criar(nome: string, email: string, disciplina: string, cargaHoraria: number): Professor {
    return new Professor(nome, email, disciplina, cargaHoraria);
  }

  public static editar(nome:string, email:string, id:number, disciplina:string, cargaHoraria:number): Professor {
    return new Professor(nome, email, disciplina, cargaHoraria, id);
  }

  public static deletar(id:number): Professor {
    const professor = new Professor("N/A", "N/A", "N/A", 0, id);
    return professor;
  }
}