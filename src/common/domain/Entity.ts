export interface IEntity {
  get id(): number;
  equals(obj: unknown): boolean;
}

export abstract class Entity implements IEntity {
  protected readonly _id: number;

  protected constructor(id?: number) {
    this._id = id || 0;
  }

  public get id(): number {
    return this._id;
  }

  public equals(obj: unknown): boolean {
    if (!obj) {
      return false;
    }

    if (this === obj) {
      return true;
    }

    if (!(obj instanceof Entity)) {
      return false;
    }

    if (this.constructor.name !== obj.constructor.name) {
      return false;
    }

    return this.id === obj.id;
  }
}
