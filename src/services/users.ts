import type { ListParams, PaginatedResponse } from '@/types';

import { api, apiClient } from './api';

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: 'admin' | 'member';
    createdAt: string;
}

export type UpdateUserInput = Partial<Pick<User, 'name' | 'email' | 'avatarUrl'>>;

export const usersService = {
    /**
     * Paginated, so it reads the envelope directly rather than going through
     * `api.get` — the `meta` block would be discarded by the unwrapper.
     */
    async list(params?: ListParams): Promise<PaginatedResponse<User>> {
        const response = await apiClient.get<PaginatedResponse<User>>('/users', { params });
        return response.data;
    },

    getById(id: string): Promise<User> {
        return api.get<User>(`/users/${id}`);
    },

    update(id: string, input: UpdateUserInput): Promise<User> {
        return api.patch<User>(`/users/${id}`, input);
    },

    remove(id: string): Promise<void> {
        return api.delete(`/users/${id}`);
    },
};
