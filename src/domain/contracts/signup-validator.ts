import { SignupRequest } from '@/shared/types/SignupRequest'

export interface Validator {
  validate(request: SignupRequest): void
}
