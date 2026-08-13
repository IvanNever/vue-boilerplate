import { describe, expect, it } from 'vitest';
import { Entity } from './Entity';

class TestEntity extends Entity {
  constructor(id?: number) {
    super(id);
  }
}

class OtherEntity extends Entity {
  constructor(id?: number) {
    super(id);
  }
}

describe('Entity', () => {
  it('defaults id to 0 when not provided', () => {
    expect(new TestEntity().id).toBe(0);
  });

  it('exposes the provided id', () => {
    expect(new TestEntity(5).id).toBe(5);
  });

  describe('equals', () => {
    it('returns false when compared to null or undefined', () => {
      const entity = new TestEntity(1);
      expect(entity.equals(null)).toBe(false);
      expect(entity.equals(undefined)).toBe(false);
    });

    it('returns true for the same instance', () => {
      const entity = new TestEntity(1);
      expect(entity.equals(entity)).toBe(true);
    });

    it('returns true for different instances of the same subclass with the same id', () => {
      expect(new TestEntity(1).equals(new TestEntity(1))).toBe(true);
    });

    it('returns false when ids differ', () => {
      expect(new TestEntity(1).equals(new TestEntity(2))).toBe(false);
    });

    it('returns false when compared to a different Entity subclass', () => {
      expect(new TestEntity(1).equals(new OtherEntity(1))).toBe(false);
    });

    it('returns false when compared to a non-Entity value', () => {
      expect(new TestEntity(1).equals({ id: 1 })).toBe(false);
      expect(new TestEntity(1).equals('not-an-entity')).toBe(false);
    });
  });
});
