export const AUTH_ROLE = {
    ADMIN: 'ADMIN',
    USER: 'USER'
} as const;

export type AuthRole = typeof AUTH_ROLE[keyof typeof AUTH_ROLE];