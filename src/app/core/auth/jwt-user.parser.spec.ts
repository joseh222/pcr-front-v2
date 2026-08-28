import { isAccessTokenExpired, parseAuthenticatedUser } from './jwt-user.parser';

describe('JWT user parser', () => {
    it('should parse the authenticated user from the access token', () => {
        const token = createToken({
            nameid: '7',
            unique_name: 'JHUAMAN',
            Nombre: 'José Huamán',
            email: 'jose@example.com',
            role: 'ADMIN',
            roles: ['ADMIN', 'SECRETARIA'],
            permission: ['USUARIO_VER', 'ROL_VER'],
            sid: '5e986957-6d4b-4717-9cb6-985eb433723d',
            must_change_password: 'false',
            exp: 4102444800
        });

        const user = parseAuthenticatedUser(token);

        expect(user).not.toBeNull();
        expect(user?.idUser).toBe(7);
        expect(user?.username).toBe('JHUAMAN');
        expect(user?.displayName).toBe('José Huamán');
        expect(user?.roleCode).toBe('ADMIN');
        expect(user?.roleCodes).toEqual(['ADMIN', 'SECRETARIA']);
        expect(user?.permissions).toEqual(['USUARIO_VER', 'ROL_VER']);
        expect(user?.mustChangePassword).toBe(false);
    });

    it('should detect an expired access token', () => {
        const token = createToken({
            nameid: '7',
            unique_name: 'JHUAMAN',
            Nombre: 'José Huamán',
            role: 'USER',
            sid: '5e986957-6d4b-4717-9cb6-985eb433723d',
            must_change_password: 'false',
            exp: 100
        });

        const user = parseAuthenticatedUser(token);

        expect(user).not.toBeNull();
        expect(isAccessTokenExpired(user!, 200)).toBe(true);
    });
});

function createToken(payload: Record<string, unknown>): string {
    return `${encodeBase64Url({ alg: 'HS256', typ: 'JWT' })}.${encodeBase64Url(payload)}.signature`;
}

function encodeBase64Url(value: unknown): string {
    const bytes = new TextEncoder().encode(JSON.stringify(value));
    let binary = '';

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}