import type { Deck } from "../types/types";
import { apiClient } from "../../../services/axiosClient";
import type { ApiResponse, PageResponse } from "../../../shared_types/types";

export async function getDecks(page = 1, size = 10): Promise<ApiResponse<PageResponse<Deck>>> {
    const response = await apiClient.get<ApiResponse<PageResponse<Deck>>>('/decks', {
        params: { page, size },
    });
    return response.data;
}
