import { AccountData } from '@/shared/types/account'

export interface Validator {
  validate(request: AccountData): void
}
