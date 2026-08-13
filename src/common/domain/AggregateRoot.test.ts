import { describe, expect, it } from 'vitest';
import { AggregateRoot } from './AggregateRoot';

class TestAggregate extends AggregateRoot {
  constructor(id?: number) {
    super(id);
  }
}

describe('AggregateRoot', () => {
  it('behaves as an Entity: exposes id and identity-based equality', () => {
    expect(new TestAggregate(3).id).toBe(3);
    expect(new TestAggregate(3).equals(new TestAggregate(3))).toBe(true);
    expect(new TestAggregate(3).equals(new TestAggregate(4))).toBe(false);
  });
});
