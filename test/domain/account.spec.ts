import { Account } from "@/domain/entities";

describe(Account.name, () => {
  const createAccount = (
    name: string,
    email: string,
    cpf: string,
    password: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate?: string
  ) => new Account(name, email, cpf, password, isPassenger, isDriver, carPlate);

  describe('Instance Creation', () => {
    it('should create an Account instance', () => {
      const account = createAccount(
        'John Doe',
        'john.doe@example.com',
        '12345678900',
        'SecurePass123',
        true,
        true,
        'ABC-1234'
      );

      expect(account).toBeInstanceOf(Account);
    });
  });

  describe('Getter Methods', () => {
    it('should return correct values from getters', () => {
      const account = createAccount(
        'John Doe',
        'john.doe@example.com',
        '12345678900',
        'SecurePass123',
        true,
        true,
        'ABC-1234'
      );

      expect(account.getName()).toBe('John Doe');
      expect(account.getEmail()).toBe('john.doe@example.com');
      expect(account.getCpf()).toBe('12345678900');
      expect(account.getPassword()).toBe('SecurePass123');
      expect(account.getIsPassenger()).toBe(true);
      expect(account.getIsDriver()).toBe(true);
      expect(account.getCarPlate()).toBe('ABC-1234');
    });

    it('should return an empty car plate if none is provided', () => {
      const account = createAccount(
        'Jane Doe',
        'jane.doe@example.com',
        '98765432100',
        'SecurePass456',
        false,
        true
      );

      expect(account.getCarPlate()).toBe('');
    });
  });
});
