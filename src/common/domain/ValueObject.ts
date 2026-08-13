export abstract class ValueObject {
  protected abstract getEqualityComponents(): Array<unknown>;

  public equals(obj: unknown): boolean {
    if (!obj) {
      return false;
    }

    if (this === obj) {
      return true;
    }

    if (!(obj instanceof ValueObject)) {
      return false;
    }

    if (this.constructor.name !== obj.constructor.name) {
      return false;
    }

    return this.equalsComponents(
      this.getEqualityComponents(),
      obj.getEqualityComponents()
    );
  }

  private equalsComponents(
    components1: Array<unknown>,
    components2: Array<unknown>
  ): boolean {
    return components1.every((component: unknown, index: number): boolean => {
      return this.equalsComponent(component, components2[index]);
    });
  }

  private equalsComponent(component1: unknown, component2: unknown): boolean {
    if (component1 === component2) {
      return true;
    }

    if (!component1 || !component2) {
      return false;
    }

    if (Array.isArray(component1) && Array.isArray(component2)) {
      return this.equalsComponents(component1, component2);
    }

    if (component1 instanceof ValueObject && component2 instanceof ValueObject) {
      return component1.equals(component2);
    }

    return false;
  }
}
