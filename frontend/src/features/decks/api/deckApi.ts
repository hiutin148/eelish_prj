import type { Deck } from "../types/types";
import { apiClient } from "../../../services/axiosClient";
import type { ApiResponse, PageResponse } from "../../../shared_types/types";

export async function getDecks(page = 1, size = 10): Promise<ApiResponse<PageResponse<Deck>>> {
    const response = await apiClient.get<ApiResponse<PageResponse<Deck>>>('/api/decks', {
        params: { page, size },
    });
    return response.data;
}

export async function importSource(file: File): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<string>>('/upload/decks', formData);
    return response.data;
}
