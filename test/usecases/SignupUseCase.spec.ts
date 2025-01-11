import { SignupUseCase } from "@/application/use-cases/signup-use-case";
import { Account } from "@/domain/entities/account";
import { AccountRepository } from "@/infra/repositories";
import { mock, MockProxy } from 'jest-mock-extended'


describe('SignupUseCase', () => {
  it('should create a passenger account with valid data', async () => {

    let accountRepository: MockProxy<AccountRepository>
    let signupUseCase: SignupUseCase;

    accountRepository = mock<AccountRepository>();
    signupUseCase = new SignupUseCase(accountRepository);

    const passager = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      cpf: '072.099.700-37',
      password: 'SecurePass123',
      isPassenger: true,
      isDriver: false,
    };

    const createdAccount = new Account(
      passager.name,
      passager.email,
      passager.cpf,
      passager.password,
      passager.isPassenger,
      passager.isDriver
    )

    accountRepository.save.mockResolvedValue(createdAccount);
    const result = await signupUseCase.execute(passager);

    expect(result).toEqual(createdAccount);
    expect(accountRepository.save).toHaveBeenCalledWith(expect.objectContaining(passager));

  });
});