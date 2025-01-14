import { Account } from '@/domain/entities/account'

export interface LoadAccountRepository {
  findByEmail(email: string): Promise<Account | undefined>
}

export interface SaveAccountRepository {
  save(account: Account): Promise<Account>
}

export interface AccountRepository extends LoadAccountRepository, SaveAccountRepository {}
