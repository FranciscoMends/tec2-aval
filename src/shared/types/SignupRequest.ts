export type SignupRequest = {
  name: string
  email: string
  cpf: string
  password: string
  isPassenger: boolean
  isDriver: boolean
  carPlate?: string
}
