import { SignupUseCase } from "@/application/use-cases";
import { ValidationService } from "@/application/services";
import { Account } from "@/domain/entities/account";
import { AccountData } from "@/shared/types";
import { mock, MockProxy } from 'jest-mock-extended'
import { AccountRepository } from "@/application/contracts";


describe(SignupUseCase.name, () => {
  let signupUseCase: SignupUseCase;
  let accountRepository: MockProxy<AccountRepository>;

  beforeEach(() => {
    const validationService = new ValidationService();
    accountRepository = mock<AccountRepository>();
    signupUseCase = new SignupUseCase(accountRepository, validationService);
  });

  const createAccountData = (overrides: Partial<AccountData> = {}): AccountData => ({
    name: "Default User",
    email: "default.user@example.com",
    cpf: "072.099.700-37",
    password: "SecurePass123",
    isPassenger: true,
    isDriver: false,
    carPlate: undefined,
    ...overrides,
  });

  it('should create a passenger account with valid data', async () => {
    const passengerData = createAccountData({ isPassenger: true, isDriver: false });

    const createdAccount = new Account(
      passengerData.name,
      passengerData.email,
      passengerData.cpf,
      passengerData.password,
      passengerData.isPassenger,
      passengerData.isDriver
    )

    accountRepository.save.mockResolvedValue(createdAccount);
    const result = await signupUseCase.execute(passengerData);

    expect(result).toEqual(createdAccount);
    expect(accountRepository.save).toHaveBeenCalledWith(expect.objectContaining(passengerData));

  });

  it('should create a driver account with valid data', async () => {
    const driverData = createAccountData({ isPassenger: false, isDriver: true, carPlate: "ABC-1234" });

    const createdAccount = new Account(
      driverData.name,
      driverData.email,
      driverData.cpf,
      driverData.password,
      driverData.isPassenger,
      driverData.isDriver,
      driverData.carPlate
    )

    accountRepository.save.mockResolvedValue(createdAccount);
    const result = await signupUseCase.execute(driverData);

    expect(result).toEqual(createdAccount);
    expect(accountRepository.save).toHaveBeenCalledWith(expect.objectContaining(driverData));

  });

  it('shold allow creating an account with duplicate CPF but different email', async () => {
    const mockSave = jest.fn()
    const mockFindByEmail = jest.fn()

    accountRepository.save.mockImplementation(mockSave);
    accountRepository.findByEmail.mockImplementation(mockFindByEmail);

    mockFindByEmail.mockResolvedValueOnce(null)
    mockFindByEmail.mockResolvedValueOnce(null)

    const firstAccountData = createAccountData({ email: "first.user@example.com" });
    mockSave.mockResolvedValueOnce(firstAccountData)
    const result1 = await signupUseCase.execute(firstAccountData);
    expect(result1).toEqual(expect.objectContaining(firstAccountData))

    expect(accountRepository.save).toHaveBeenCalledWith(expect.objectContaining(firstAccountData))

    const secondAccountData = createAccountData({ email: "second.user@example.com" });
    mockSave.mockResolvedValueOnce(secondAccountData)
    const result2 = await signupUseCase.execute(secondAccountData);
    expect(result2).toEqual(expect.objectContaining(secondAccountData))

    expect(accountRepository.save).toHaveBeenCalledWith(expect.objectContaining(secondAccountData))
    expect(accountRepository.save).toHaveBeenCalledTimes(2)
    expect(accountRepository.findByEmail).toHaveBeenCalledWith('first.user@example.com')
    expect(accountRepository.findByEmail).toHaveBeenCalledWith('second.user@example.com')
  })

  it('should not allow creating an account with an already registered email', async () => {
    const existingAccountData = createAccountData({ email: "duplicate.email@example.com" });
    const existingAccount = new Account(
      existingAccountData.name,
      existingAccountData.email,
      existingAccountData.cpf,
      existingAccountData.password,
      existingAccountData.isPassenger,
      existingAccountData.isDriver)

    const newAccountData = createAccountData({ email: "duplicate.email@example.com" });

    accountRepository.findByEmail.mockResolvedValue(existingAccount);

    await expect(signupUseCase.execute(newAccountData)).rejects.toThrow('Email is already in use');
    expect(accountRepository.findByEmail).toHaveBeenCalledWith('duplicate.email@example.com');
    expect(accountRepository.save).not.toHaveBeenCalled();
  });

  const invalidDataSets = [
    {
      description: 'missing name',
      data: createAccountData({ name: '' }),
      errorMessage: 'Name is required',
    },
    {
      description: 'Invalid Email',
      data: createAccountData({ email: 'invalid-email' }),
      errorMessage: 'Invalid email',
    },
    {
      description: 'missing email',
      data: createAccountData({ email: '' }),
      errorMessage: 'Invalid email',
    },
    {
      description: 'missing CPF',
      data: createAccountData({ cpf: '' }),
      errorMessage: 'Invalid CPF',
    },
    {
      description: 'invalid CPF',
      data: createAccountData({ cpf: '123.456.678-99' }),
      errorMessage: 'Invalid CPF',
    },
    {
      description: 'missing password',
      data: createAccountData({ password: '' }),
      errorMessage: 'Password must be at least 8 characters',
    },
    {
      description: 'missing car plate when driver',
      data: createAccountData({ isPassenger: false, isDriver: true, carPlate: '' }),
      errorMessage: 'Car plate is required for drivers',
    },
    {
      description: 'no role selected',
      data: createAccountData({ isPassenger: false, isDriver: false }),
      errorMessage: 'At least one role (Passenger or Driver) must be selected',
    },
    {
      description: 'when passenger  has a car plate.',
      data: createAccountData({ isPassenger: true, isDriver: false, carPlate: 'ABC-1234' }),
      errorMessage: 'Car plate is not required for passengers',
    }
  ];

  invalidDataSets.forEach(({ description, data, errorMessage }) => {
    it(`should not allow creating an account when ${description}`, async () => {
      await expect(signupUseCase.execute(data)).rejects.toThrow(errorMessage);

      expect(accountRepository.findByEmail).not.toHaveBeenCalled();
      expect(accountRepository.save).not.toHaveBeenCalled();
    });
  });

});