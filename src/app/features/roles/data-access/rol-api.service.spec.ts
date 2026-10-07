import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { RolApiService } from './rol-api.service';

describe('RolApiService', () => {
    let service: RolApiService; let http: HttpTestingController; const apiUrl = 'https://localhost:7002/api/Roles';
    beforeEach(() => { TestBed.configureTestingModule({ providers: [RolApiService, provideHttpClient(), provideHttpClientTesting(), { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl: 'https://localhost:7002/api' } } }] }); service = TestBed.inject(RolApiService); http = TestBed.inject(HttpTestingController); });
    afterEach(() => http.verify());

    it('should request all roles and permission catalog', () => {
        service.getRoles(false).subscribe(); let request = http.expectOne(req => req.url === apiUrl); expect(request.request.method).toBe('GET'); expect(request.request.params.get('onlyActive')).toBe('false'); request.flush([]);
        service.getPermissions().subscribe(); request = http.expectOne(`${apiUrl}/permissions`); expect(request.request.method).toBe('GET'); request.flush([]);
    });

    it('should request role detail and matrix', () => {
        service.getById(4).subscribe(); let request = http.expectOne(`${apiUrl}/4`); expect(request.request.method).toBe('GET'); request.flush({});
        service.getRolePermissions(4).subscribe(); request = http.expectOne(`${apiUrl}/4/permissions`); expect(request.request.method).toBe('GET'); request.flush([]);
    });

    it('should call role write endpoints', () => {
        service.create({ code: 'SECRETARIA', name: 'Secretaría', description: null }).subscribe(); let request = http.expectOne(apiUrl); expect(request.request.method).toBe('POST'); request.flush({ idRole: 4, code: 'SECRETARIA', name: 'Secretaría', rowVersion: 'A', mensaje: 'OK' });
        service.update(4, { name: 'Secretaría Parroquial', description: null, rowVersion: 'A' }).subscribe(); request = http.expectOne(`${apiUrl}/4`); expect(request.request.method).toBe('PUT'); request.flush({ idRole: 4, rowVersion: 'B', mensaje: 'OK' });
        service.updatePermissions(4, [1,2], 'B').subscribe(); request = http.expectOne(`${apiUrl}/4/permissions`); expect(request.request.method).toBe('PUT'); expect(request.request.body).toEqual({ permisos: [1,2], rowVersion: 'B' }); request.flush({ idRole: 4, permissionCount: 2, rowVersion: 'C', mensaje: 'OK' });
        service.changeStatus(4, false, 'C').subscribe(); request = http.expectOne(`${apiUrl}/4/status`); expect(request.request.method).toBe('PATCH'); expect(request.request.body).toEqual({ isActive: false, rowVersion: 'C' }); request.flush({ idRole: 4, isActive: false, affectedUsers: 0, rowVersion: 'D', mensaje: 'OK' });
    });
});
