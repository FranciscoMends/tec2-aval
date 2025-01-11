import { Account } from '@/domain/entities'
import { AccountRepository } from '@/infra/repositories'

type SignupRequest = {
  name: string
  email: string
  cpf: string
  password: string
  isPassenger: boolean
  isDriver: boolean
  carPlate?: string
}

export class SignupUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  public async execute(request: SignupRequest): Promise<Account> {
    this.validateRequest(request)
    const accountExists = await this.accountRepository.findByEmail(request.email)

    if (accountExists) {
      throw new Error('Email is already in use')
    }

    const acount = new Account(
      request.name,
      request.email,
      request.cpf,
      request.password,
      request.isPassenger,
      request.isDriver,
      request.carPlate,
    )

    return this.accountRepository.save(acount)
  }

  private validateRequest(request: SignupRequest): void {
    this.validateEmail(request.email)
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email')
    }
  }
}
