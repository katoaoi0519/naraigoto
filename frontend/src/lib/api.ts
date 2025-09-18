import { API_CONFIG, API_ENDPOINTS } from './config';
import { authenticatedFetch } from './auth';
import { getErrorMessage } from './utils';

/**
 * APIクライアント
 */

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function baseFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData.code
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(getErrorMessage(error), 500);
  }
}

async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  try {
    const response = await authenticatedFetch(url, {
      ...options,
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData.code
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(getErrorMessage(error), 500);
  }
}

// 教室API
export const schoolsApi = {
  async list(params?: {
    page?: number;
    limit?: number;
    area?: string;
    category?: string;
    keyword?: string;
    sort?: string;
  }): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.area) searchParams.append('area', params.area);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.keyword) searchParams.append('keyword', params.keyword);
    if (params?.sort) searchParams.append('sort', params.sort);

    const query = searchParams.toString();
    const endpoint = `${API_ENDPOINTS.SCHOOLS.LIST}${query ? `?${query}` : ''}`;
    
    return baseFetch(endpoint);
  },

  async getById(id: string): Promise<ApiResponse<any>> {
    return baseFetch(API_ENDPOINTS.SCHOOLS.DETAIL(id));
  },

  async like(id: string): Promise<ApiResponse<void>> {
    return authFetch(API_ENDPOINTS.SCHOOLS.LIKE(id), { method: 'POST' });
  },

  async unlike(id: string): Promise<ApiResponse<void>> {
    return authFetch(API_ENDPOINTS.SCHOOLS.LIKE(id), { method: 'DELETE' });
  },
};

// 予約API
export const bookingsApi = {
  async create(data: {
    scheduleId: string;
    userId: string;
    consumedTickets: number;
  }): Promise<ApiResponse<any>> {
    return authFetch(API_ENDPOINTS.BOOKINGS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async cancel(id: string): Promise<ApiResponse<void>> {
    return authFetch(API_ENDPOINTS.BOOKINGS.CANCEL(id), { method: 'POST' });
  },
};

// ユーザーAPI
export const userApi = {
  async getProfile(): Promise<ApiResponse<any>> {
    return authFetch(API_ENDPOINTS.USER.PROFILE);
  },

  async getTickets(): Promise<ApiResponse<any>> {
    return authFetch(API_ENDPOINTS.USER.TICKETS);
  },
};