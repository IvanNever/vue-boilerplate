import { ApiCoreImpl } from '@/infrastructure/api/ApiCore'

export type Constructor<T> = new (...args: unknown[]) => T

export interface Context {
  registry<T extends Constructor<object>>(Service: T, key: string): void
  registryOverwrite<T extends Constructor<object>>(Service: T, key: string): void
  registryPublic<T extends Constructor<object>>(Service: T, key: string): void

  get<T>(key: string): T
  getPublic<T>(key: string): T
}

class ContextImpl {
  private readonly name: string
  private readonly context: Record<string, unknown> = {}
  private public?: Context

  constructor(name: string) {
    this.name = name
  }

  public setPublicContext(context: Context) {
    this.public = context
  }

  public isExist(key: string) {
    return key in this.context
  }

  public registry<T extends Constructor<object>>(Service: T, key: string) {
    if (!this.isExist(key)) {
      this.context[key] = new Service()
    } else {
      throw Error(`context '${this.name}' error: key: ${key} already exists`)
    }
  }

  public registryOverwrite<T extends Constructor<object>>(Service: T, key: string) {
    this.context[key] = new Service()
  }

  public registryPublic<T extends Constructor<object>>(Service: T, key: string) {
    if (!this.public) {
      throw Error(`context '${this.name}' error: public context is not exists`)
    }
    this.public?.registry(Service, key)
  }

  public get<T>(key: string): T {
    return this.context[key] as T
  }

  public getPublic<T>(key: string): T {
    if (!this.public) {
      throw Error(`context '${this.name}' error: public context is not exists`)
    }
    return this.public?.get(key)
  }
}

export let publicContext: Context

export function initPublicContext() {
  publicContext = new ContextImpl('public')
  publicContext.registry(ApiCoreImpl, 'ApiCore')
}

export function createContext(name: string): Context {
  const ctx: ContextImpl = new ContextImpl(name)
  ctx.setPublicContext(publicContext)
  return ctx
}
