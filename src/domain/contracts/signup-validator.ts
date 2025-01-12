import { AccountData } from '@/shared/types'

export interface Validator {
  validate(request: AccountData): void
}
