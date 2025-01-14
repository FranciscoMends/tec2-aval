import { AccountData } from '@/shared/types'

export interface SignUpValidator {
  validate(request: AccountData): void
}
