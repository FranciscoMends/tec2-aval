import { Account } from "@/domain/entities";

describe(Account.name, () => {
  it('should create an Account instance', () => {
    const account = new Account(
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

  it('should return correct values from getters', () => {
    const account = new Account(
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
  });

})
