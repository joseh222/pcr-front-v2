import { AuthenticatedUser } from './authenticated-user.model';

type JwtPayload = Record<string, unknown>;

const NAME_IDENTIFIER_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const NAME_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
const EMAIL_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

export function parseAuthenticatedUser(accessToken: string): AuthenticatedUser | null {
    const payload = parsePayload(accessToken);

    if (!payload) {
        return null;
    }

    const idUserValue = readString(payload, ['nameid', NAME_IDENTIFIER_CLAIM]);
    const username = readString(payload, ['unique_name', 'name', NAME_CLAIM]);
    const displayName = readString(payload, ['Nombre']) ?? username;
    const email = readString(payload, ['email', EMAIL_CLAIM]);
    const roleCode = readString(payload, ['role', ROLE_CLAIM]);
    const sessionId = readString(payload, ['sid']);
    const mustChangePassword = readBoolean(payload['must_change_password']);
    const expiresAtUnix = readNumber(payload['exp']);
    const idUser = Number(idUserValue);

    if (!Number.isInteger(idUser) || idUser <= 0 || !username || !displayName || !roleCode || !sessionId || mustChangePassword === null || expiresAtUnix === null) {
        return null;
    }

    return {
        idUser,
        username,
        displayName,
        email,
        roleCode,
        sessionId,
        mustChangePassword,
        expiresAtUnix
    };
}

export function isAccessTokenExpired(user: AuthenticatedUser, nowUnix = Math.floor(Date.now() / 1000)): boolean {
    return user.expiresAtUnix <= nowUnix;
}

function parsePayload(accessToken: string): JwtPayload | null {
    const parts = accessToken.split('.');

    if (parts.length !== 3 || !parts[1]) {
        return null;
    }

    try {
        const value: unknown = JSON.parse(decodeBase64Url(parts[1]));
        return isRecord(value) ? value : null;
    } catch {
        return null;
    }
}

function decodeBase64Url(value: string): string {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));

    return new TextDecoder().decode(bytes);
}

function readString(payload: JwtPayload, keys: readonly string[]): string | null {
    for (const key of keys) {
        const value = payload[key];

        if (typeof value === 'string' && value.trim()) {
            return value.trim();
        }
    }

    return null;
}

function readNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) {
        return Number(value);
    }

    return null;
}

function readBoolean(value: unknown): boolean | null {
    if (typeof value === 'boolean') {
        return value;
    }

    if (value === 'true') {
        return true;
    }

    if (value === 'false') {
        return false;
    }

    return null;
}

function isRecord(value: unknown): value is JwtPayload {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}