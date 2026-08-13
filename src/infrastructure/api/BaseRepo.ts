import { apiClient } from '@/infrastructure/api/apiClient';
import type { AxiosInstance } from 'axios';

export class BaseRepo {
  protected readonly inst: AxiosInstance = apiClient;
}
