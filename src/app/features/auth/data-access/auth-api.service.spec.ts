import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { AuthApiService } from './auth-api.service';
import { SKIP_AUTH } from '../../../core/auth/auth-http-context';
describe('AuthApiService', () => {
    let service: AuthApiService;
    let httpTesting: HttpTestingController;

    const runtimeConfigMock = {
        config: {
            apiBaseUrl: 'https://localhost:7002/api'
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthApiService,
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: RuntimeConfigService,
                    useValue: runtimeConfigMock
                }
            ]
        });

        service = TestBed.inject(AuthApiService);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should send the login request to Seguridad/Login', () => {
        const requestBody = {
            username: 'ADMIN',
            password: 'Password123!',
            deviceId: null,
            deviceLabel: 'PCR Front V2'
        };

        service.login(requestBody).subscribe();

        const request = httpTesting.expectOne('https://localhost:7002/api/Seguridad/Login');

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(requestBody);
        expect(request.request.context.get(SKIP_AUTH)).toBe(true);

        request.flush({
            succeeded: true,
            error: null,
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
            sessionId: '5e986957-6d4b-4717-9cb6-985eb433723d',
            mustChangePassword: false
        });
    });

    it('should send the refresh token to Seguridad/RefreshSession', () => {
        service.refreshSession({ refreshToken: 'refresh-token' }).subscribe();

        const request = httpTesting.expectOne('https://localhost:7002/api/Seguridad/RefreshSession');

        expect(request.request.method).toBe('POST');
        expect(request.request.context.get(SKIP_AUTH)).toBe(true);
        expect(request.request.body).toEqual({
            refreshToken: 'refresh-token'
        });

        request.flush({
            succeeded: true,
            error: null,
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
            sessionId: '5e986957-6d4b-4717-9cb6-985eb433723d',
            mustChangePassword: false
        });
    });

    it('should get current access from Seguridad/Access', () => {
        service.access().subscribe();
        const request = httpTesting.expectOne('https://localhost:7002/api/Seguridad/Access');
        expect(request.request.method).toBe('GET');
        expect(request.request.context.get(SKIP_AUTH)).toBe(false);
        request.flush({ idUser: 1, roles: [], permissions: [] });
    });

    it('should send the logout request to Seguridad/Logout', () => {
        service.logout().subscribe();

        const request = httpTesting.expectOne('https://localhost:7002/api/Seguridad/Logout');

        expect(request.request.method).toBe('POST');
        expect(request.request.context.get(SKIP_AUTH)).toBe(false);

        request.flush({
            exito: true,
            codigo: 'SESSION_REVOKED',
            mensaje: 'Sesión cerrada correctamente.'
        });
    });
});