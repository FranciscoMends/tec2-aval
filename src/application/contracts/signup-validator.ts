import { AccountData } from '@/application/types'

export interface SignUpValidator {
  validate(request: AccountData): void
}
