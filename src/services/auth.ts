import { clearToken, setToken } from '@/lib/token-store';
import type { LoginInput, RegisterInput } from '@/validators/auth';

import { api } from './api';
import type { User } from './users';

export interface AuthSession {
    user: User;
    accessToken: string;
}

/**
 * Auth endpoints. These own the token side effect deliberately — if callers
 * had to remember `setToken` after every login, one of them eventually won't.
 */
export const authService = {
    async login(input: LoginInput): Promise<AuthSession> {
        const session = await api.post<AuthSession>('/auth/login', input);
        setToken(session.accessToken);
        return session;
    },

    async register(input: RegisterInput): Promise<AuthSession> {
        const session = await api.post<AuthSession>('/auth/register', input);
        setToken(session.accessToken);
        return session;
    },

    async logout(): Promise<void> {
        try {
            await api.post<void>('/auth/logout');
        } finally {
            /* Clear locally even if the server call fails — the user asked to
               sign out, and a failed request shouldn't leave them signed in. */
            clearToken();
        }
    },

    getSession(): Promise<AuthSession> {
        return api.get<AuthSession>('/auth/session');
    },

    requestPasswordReset(email: string): Promise<void> {
        return api.post<void>('/auth/forgot-password', { email });
    },
};
