export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
  errorCode: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}