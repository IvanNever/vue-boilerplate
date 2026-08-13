import { createContext, type Context } from '@/infrastructure/context';
import { AuthRepoImpl } from '@/auth/api/authRepoImpl';

export let authContext: Context;

export function initAuthContext() {
  authContext = createContext('auth');
  authContext.registry(AuthRepoImpl, 'AuthRepo');
}
