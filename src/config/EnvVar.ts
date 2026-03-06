import 'dotenv/config';
import { EnvKey } from './enum/EnvKey';

export class EnvVar {
  /**
   * A classe EnvVar é um utilitário para acessar as variáveis de ambiente definidas no arquivo .env.
   * Ela fornece métodos estáticos para obter os valores das variáveis de ambiente como string, número ou booleano, garantindo que as variáveis estejam definidas e sejam do tipo esperado.
   * Se uma variável de ambiente não estiver definida ou não for do tipo esperado, a classe lança um erro apropriado.
   */
  private constructor() {}; // vazio pois a classe é apenas um container de métodos estáticos
  public static getString(chave: EnvKey): string {
  const valor = process.env[chave];
  if (!valor) {
    throw new Error(`A variável de ambiente ${chave} não está definida no .env.`);
  }
  return valor;
  }

  public static getNumber(chave: EnvKey): number {
  const valor = this.getString(chave);
  const valorConvertido = Number(valor);
  if (Number.isNaN(valorConvertido)) { // numbem no isnan é mais específico para verificar se a conversão resultou em um número válido, enquanto isNaN pode retornar true para valores que não são números, mas também para strings vazias ou outros tipos de dados.
    throw new TypeError(`A variável de ambiente ${chave} não está definida no .env como número válido.`); //typeError é mais específico para esse tipo de erro, pois o valor existe, mas não é um número válido
  }
    return valorConvertido;
  }

  public static getBoolean(chave: EnvKey): boolean {
    const valor = this.getString(chave).toLocaleLowerCase();
    return ['true', '1', 'yes', 'on'].includes(valor); //considerando true, 1, yes e on como verdadeiros, e qualquer outro valor como falso 
  }
  // Métodos estáticos para acessar as variáveis de ambiente específicas do projeto, utilizando os métodos genéricos acima
  public static get SERVER_PORT(): number {
    return this.getNumber(EnvKey.SERVER_PORT);
  }
  public static get DB_HOST(): string {
    return this.getString(EnvKey.DB_HOST);
  }
  public static get DB_PORT(): number {
    return this.getNumber(EnvKey.DB_PORT);
  }
  public static get DB_USER(): string {
    return this.getString(EnvKey.DB_USER);
  }
  public static get DB_PASSWORD(): string {
    return this.getString(EnvKey.DB_PASSWORD);
  }
  public static get DB_NAME(): string {
    return this.getString(EnvKey.DB_NAME);
  }
}