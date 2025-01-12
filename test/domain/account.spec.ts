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

})
