import { describe, expect, it } from 'vitest';
import { ValueObject } from './ValueObject';

class Money extends ValueObject {
  constructor(
    private amount: number,
    private currency: string
  ) {
    super();
  }

  protected getEqualityComponents(): Array<unknown> {
    return [this.amount, this.currency];
  }
}

class Address extends ValueObject {
  constructor(
    private city: string,
    private zip: string
  ) {
    super();
  }

  protected getEqualityComponents(): Array<unknown> {
    return [this.city, this.zip];
  }
}

class Wallet extends ValueObject {
  constructor(private money: Money) {
    super();
  }

  protected getEqualityComponents(): Array<unknown> {
    return [this.money];
  }
}

class Tags extends ValueObject {
  constructor(private tags: string[]) {
    super();
  }

  protected getEqualityComponents(): Array<unknown> {
    return [this.tags];
  }
}

describe('ValueObject', () => {
  it('returns false when compared to null or undefined', () => {
    expect(new Money(1, 'USD').equals(null)).toBe(false);
    expect(new Money(1, 'USD').equals(undefined)).toBe(false);
  });

  it('returns true for the same instance', () => {
    const money = new Money(1, 'USD');
    expect(money.equals(money)).toBe(true);
  });

  it('returns true for structurally equal instances', () => {
    expect(new Money(10, 'USD').equals(new Money(10, 'USD'))).toBe(true);
  });

  it('returns false when a component differs', () => {
    expect(new Money(10, 'USD').equals(new Money(10, 'EUR'))).toBe(false);
  });

  it('returns false when compared to a different ValueObject subclass', () => {
    expect(new Money(10, 'USD').equals(new Address('NYC', '10001'))).toBe(
      false
    );
  });

  it('returns false when compared to a non-ValueObject value', () => {
    expect(new Money(10, 'USD').equals({ amount: 10, currency: 'USD' })).toBe(
      false
    );
  });

  it('compares nested ValueObject components by value', () => {
    expect(
      new Wallet(new Money(1, 'USD')).equals(new Wallet(new Money(1, 'USD')))
    ).toBe(true);
    expect(
      new Wallet(new Money(1, 'USD')).equals(new Wallet(new Money(2, 'USD')))
    ).toBe(false);
  });

  it('compares array components element-wise', () => {
    expect(new Tags(['a', 'b']).equals(new Tags(['a', 'b']))).toBe(true);
    expect(new Tags(['a', 'b']).equals(new Tags(['a', 'c']))).toBe(false);
  });
});
