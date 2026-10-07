import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SKIP_AUTH } from '../../../core/auth/auth-http-context';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { AccountApiService } from './account-api.service';

describe('AccountApiService', () => {
    let service: AccountApiService;
    let httpTesting: HttpTestingController;

    const runtimeConfigMock = {
        config: {
            apiBaseUrl: 'https://localhost:7002/api'
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AccountApiService,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: RuntimeConfigService, useValue: runtimeConfigMock }
            ]
        });

        service = TestBed.inject(AccountApiService);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should send the password change request to Cuenta/change-password', () => {
        const requestBody = {
            currentPassword: 'Temporal123!',
            newPassword: 'NuevaPassword123!',
            confirmPassword: 'NuevaPassword123!'
        };

        service.changePassword(requestBody).subscribe();

        const request = httpTesting.expectOne('https://localhost:7002/api/Cuenta/change-password');

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(requestBody);
        expect(request.request.context.get(SKIP_AUTH)).toBe(false);

        request.flush({
            mensaje: 'Contraseña actualizada correctamente.',
            requiresNewLogin: true
        });
    });
});