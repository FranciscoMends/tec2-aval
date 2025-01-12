import { Validator } from '@/domain/contracts/signup-validator'
import { AccountData } from '@/shared/types/account'

export class ValidationService implements Validator {
  validate(request: AccountData): void {
    this.validateEmail(request.email)
    this.validateName(request.name)
    this.validatePassword(request.password)
    this.validateCpf(request.cpf)

    if (!request.isPassenger && !request.isDriver) {
      throw new Error('At least one role (Passenger or Driver) must be selected')
    }

    if (request.isDriver && (!request.carPlate || request.carPlate.trim() === '')) {
      throw new Error('Car plate is required for drivers')
    }
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email')
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim() === '') {
      throw new Error('Name is required')
    }
  }

  private validatePassword(password: string): void {
    if (!password || password.length < 8 || password.trim() === '') {
      throw new Error('Password must be at least 8 characters')
    }
  }

  private validateCpf(cpf: string): void {
    const cleanCpf = cpf.replace(/[^\d]/g, '')

    if (cleanCpf.length !== 11 || /^(\d)\1+$/.test(cleanCpf)) {
      throw new Error('Invalid CPF')
    }

    const calculateDigit = (cpfArray: number[], factor: number): number => {
      const total = cpfArray.slice(0, factor - 1).reduce((acc, digit, index) => acc + digit * (factor - index), 0)
      const remainder = total % 11
      return remainder < 2 ? 0 : 11 - remainder
    }

    const cpfArray = cleanCpf.split('').map(Number)
    const digit1 = calculateDigit(cpfArray, 10)
    const digit2 = calculateDigit(cpfArray, 11)

    if (digit1 !== cpfArray[9] || digit2 !== cpfArray[10]) {
      throw new Error('Invalid CPF')
    }
  }
}
