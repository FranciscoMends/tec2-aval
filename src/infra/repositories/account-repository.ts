import { Account } from '@/domain/entities/account'

export interface AccountRepository {
  save(account: Account): Promise<Account>
  findByEmail(email: string): Promise<Account | null>
}
