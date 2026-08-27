import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { UsuarioApiService } from './usuario-api.service';

describe('UsuarioApiService', () => {
    let service: UsuarioApiService;
    let http: HttpTestingController;
    const apiUrl = 'https://localhost:7002/api/Usuarios';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UsuarioApiService, provideHttpClient(), provideHttpClientTesting(),
                { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl: 'https://localhost:7002/api' } } }
            ]
        });
        service = TestBed.inject(UsuarioApiService); http = TestBed.inject(HttpTestingController);
    });
    afterEach(() => http.verify());

    it('should request assignable roles', () => {
        service.getRoles().subscribe();
        const request = http.expectOne('https://localhost:7002/api/Roles');
        expect(request.request.method).toBe('GET'); request.flush([]);
    });

    it('should request users with filters', () => {
        service.getList({ search: ' ADMIN ', idRole: 2, isActive: false, pageNumber: 2, pageSize: 20 }).subscribe();
        const request = http.expectOne(req => req.url === apiUrl);
        expect(request.request.method).toBe('GET');
        expect(request.request.params.get('search')).toBe('ADMIN');
        expect(request.request.params.get('idRole')).toBe('2');
        expect(request.request.params.get('isActive')).toBe('false');
        expect(request.request.params.get('pageNumber')).toBe('2');
        request.flush({ items: [], pageNumber: 2, pageSize: 20, totalRecords: 0, totalPages: 0 });
    });

    it('should create and update users with multiple roles', () => {
        const create = { username: 'jose', email: null, nombreCompleto: 'Jose Huaman', idPersona: 7, roles: [2, 5] };
        service.create(create).subscribe();
        const post = http.expectOne(apiUrl); expect(post.request.method).toBe('POST'); expect(post.request.body).toEqual(create);
        post.flush({ idUser: 10, username: 'jose', temporaryPassword: 'Temp123!', mustChangePassword: true, rowVersion: 'rv', mensaje: 'OK' });

        const update = { email: 'jose@pcr.pe', nombreCompleto: 'Jose Huaman', idPersona: 7, roles: [5], rowVersion: 'rv' };
        service.update(10, update).subscribe();
        const put = http.expectOne(`${apiUrl}/10`); expect(put.request.method).toBe('PUT'); expect(put.request.body).toEqual(update);
        put.flush({ idUser: 10, rowVersion: 'rv2', roleChanged: true, sessionsRevoked: 1, mensaje: 'OK' });
    });

    it('should call administrative actions', () => {
        service.changeStatus(10, false, 'rv').subscribe();
        let request = http.expectOne(`${apiUrl}/10/status`); expect(request.request.method).toBe('PATCH'); expect(request.request.body).toEqual({ isActive: false, rowVersion: 'rv' });
        request.flush({ idUser: 10, isActive: false, rowVersion: 'rv2', sessionsRevoked: 1, mensaje: 'OK' });

        service.resetPassword(10).subscribe();
        request = http.expectOne(`${apiUrl}/10/reset-password`); expect(request.request.method).toBe('POST'); request.flush({ idUser: 10, username: 'jose', temporaryPassword: 'Temp123!', mustChangePassword: true, mensaje: 'OK' });

        service.revokeSession(10).subscribe();
        request = http.expectOne(`${apiUrl}/10/revoke-session`); expect(request.request.method).toBe('POST'); request.flush({ idUser: 10, username: 'jose', sessionsRevoked: 1, mensaje: 'OK' });
    });
});
