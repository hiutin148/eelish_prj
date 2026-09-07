import { apiClient } from '../../../services/axiosClient'
import type { Card } from '../types/types'

interface ApiResponse<T> {
  data: T;
}

interface PageResponse<T> {
  content: T[];
}

export async function getCards(): Promise<Card[]> {
  const response = await apiClient.get<ApiResponse<PageResponse<Card>>>('/cards')
  return response.data.data.content
}
