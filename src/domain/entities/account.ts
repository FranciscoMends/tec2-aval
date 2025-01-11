export class Account {
  constructor(
    private readonly name: string,
    private readonly email: string,
    private readonly cpf: string,
    private readonly password: string,
    private readonly isPassenger: boolean,
    private readonly isDriver: boolean,
    private readonly carPlate?: string,
  ) {}

  public getName(): string {
    return this.name
  }

  public getEmail(): string {
    return this.email
  }

  public getCpf(): string {
    return this.cpf
  }

  public getPassword(): string {
    return this.password
  }

  public getIsPassenger(): boolean {
    return this.isPassenger
  }

  public getIsDriver(): boolean {
    return this.isDriver
  }

  public getCarPlate(): string {
    return this.carPlate || ''
  }
}
