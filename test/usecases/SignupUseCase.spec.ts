import { SignupUseCase } from "@/application/use-cases";
import { Account } from "@/domain/entities/account";
import { AccountRepository } from "@/infra/repositories";
import { mock, MockProxy } from 'jest-mock-extended'


describe('SignupUseCase', () => {
  let signupUseCase: SignupUseCase;
  let accountRepository: MockProxy<AccountRepository>;

  beforeEach(() => {
    accountRepository = mock<AccountRepository>();
    signupUseCase = new SignupUseCase(accountRepository);
  });

  it('should create a passenger account with valid data', async () => {
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

  it('should create a driver account with valid data', async () => {
    const driver = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      cpf: '072.099.700-37',
      password: 'SecurePass123',
      isPassenger: false,
      isDriver: true,
      carPlate: 'ABC-1234'
    };

    const createdAccount = new Account(
      driver.name,
      driver.email,
      driver.cpf,
      driver.password,
      driver.isPassenger,
      driver.isDriver,
      driver.carPlate
    )

    accountRepository.save.mockResolvedValue(createdAccount);
    const result = await signupUseCase.execute(driver);

    expect(result).toEqual(createdAccount);
    expect(accountRepository.save).toHaveBeenCalledWith(expect.objectContaining(driver));

  });

  it('shold allow creating an account with duplicate CPF but different email', async () => {
    const mockSave = jest.fn()
    const mockFindByEmail = jest.fn()

    accountRepository.save.mockImplementation(mockSave);
    accountRepository.findByEmail.mockImplementation(mockFindByEmail);

    mockFindByEmail.mockResolvedValueOnce(null)
    mockFindByEmail.mockResolvedValueOnce(null)

    const firstAccountData = {
      name: 'First User',
      email: 'first.user@example.com',
      cpf: '072.099.700-37',
      password: 'FirstPass123',
      isPassenger: true,
      isDriver: false,
    }

    mockSave.mockResolvedValueOnce(firstAccountData)

    const result1 = await signupUseCase.execute(firstAccountData);
    expect(result1).toEqual(expect.objectContaining(firstAccountData))

    expect(accountRepository.save).toHaveBeenCalledWith(expect.objectContaining(firstAccountData))

    const secondAccountData = {
      name: 'First User',
      email: 'second.user@example.com',
      cpf: '072.099.700-37',
      password: 'SecondPass123',
      isPassenger: true,
      isDriver: false,
    }

    mockSave.mockResolvedValueOnce(secondAccountData)

    const result2 = await signupUseCase.execute(secondAccountData);
    expect(result2).toEqual(expect.objectContaining(secondAccountData))

    expect(accountRepository.save).toHaveBeenCalledWith(expect.objectContaining(secondAccountData))

    expect(accountRepository.save).toHaveBeenCalledTimes(2)

    expect(accountRepository.findByEmail).toHaveBeenCalledWith('first.user@example.com')
    expect(accountRepository.findByEmail).toHaveBeenCalledWith('second.user@example.com')



  })

  it('should not allow creating an account with an already registered email', async () => {
    const existingAccount = new Account(
      'Existing User',
      'duplicate.email@example.com',
      '123.456.789-00',
      'ExistingPass123',
      true,
      false
    );

    const newAccountData = {
      name: 'New User',
      email: 'duplicate.email@example.com', 
      cpf: '987.654.321-00',
      password: 'NewPass123',
      isPassenger: true,
      isDriver: false,
    };

    accountRepository.findByEmail.mockResolvedValue(existingAccount);

    await expect(signupUseCase.execute(newAccountData)).rejects.toThrow('Email is already in use');
    expect(accountRepository.findByEmail).toHaveBeenCalledWith('duplicate.email@example.com');
    expect(accountRepository.save).not.toHaveBeenCalled();
  });

});