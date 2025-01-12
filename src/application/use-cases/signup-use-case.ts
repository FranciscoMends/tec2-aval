import { Validator } from '@/domain/contracts'
import { Account } from '@/domain/entities'
import { AccountRepository } from '@/infra/repositories'
import { AccountData } from '@/shared/types/account'

export class SignupUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly validator: Validator,
  ) { }

  public async execute(request: AccountData): Promise<Account> {
    this.validator.validate(request)
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
}
