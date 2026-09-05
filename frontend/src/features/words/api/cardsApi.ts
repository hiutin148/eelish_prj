import { apiClient } from '../../../services/axiosClient'
import type { Card } from '../types/types'

export async function getCards(): Promise<Card[]> {
  return apiClient<Card[]>('/cards')
}
