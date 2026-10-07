import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PersonaDetailStore } from '../../data-access/models/persona-detail.store';
import { PersonaStatusService } from '../../data-access/persona-status.service';
import { PersonaDetailPage } from './persona-detail';

describe('PersonaDetailPage', () => {
    const detail = signal<any>({ idPersona: 5, codPersona: 'PER2026-000005', idTipoDocumento: 1, codigoTipoDocumento: 'DNI', nombreTipoDocumento: 'DNI', numeroDocumento: '12345678', nombreCompleto: 'JUAN PEREZ', fechaNacimiento: '1990-01-01', telefono: '999999999', email: 'juan@pcr.pe', direccion: 'Pueblo Nuevo', isActive: true, createdUtc: '2026-08-20T00:00:00Z', updatedUtc: null, roles: [{ idRolPersona: 7, codigo: 'AGENTE_PASTORAL', nombre: 'Agente pastoral', descripcion: null }], rowVersion: 'A' });
    const granted = new Set<string>(); const authStoreMock = { hasPermission: vi.fn((permission: string) => granted.has(permission)) }; const statusMock = { change: vi.fn(() => ({ subscribe: (cb: (value: boolean) => void) => cb(true) })) };
    const storeMock = { detail: detail.asReadonly(), loading: signal(false).asReadonly(), error: signal<string | null>(null).asReadonly(), load: vi.fn() };

    beforeEach(() => {
        granted.clear(); authStoreMock.hasPermission.mockClear(); storeMock.load.mockClear(); statusMock.change.mockClear();
        TestBed.configureTestingModule({ imports: [PersonaDetailPage], providers: [provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '5' }) } } }, { provide: PersonaStatusService, useValue: statusMock }, { provide: AuthStore, useValue: authStoreMock }] });
        TestBed.overrideComponent(PersonaDetailPage, { set: { providers: [{ provide: PersonaDetailStore, useValue: storeMock }] } });
    });

    it('should load person and hide write actions without permissions', () => {
        const fixture = TestBed.createComponent(PersonaDetailPage); fixture.detectChanges(); expect(storeMock.load).toHaveBeenCalledWith(5); expect(fixture.nativeElement.textContent).toContain('JUAN PEREZ'); expect(fixture.nativeElement.textContent).not.toContain('Editar'); expect(fixture.nativeElement.textContent).not.toContain('Desactivar');
    });

    it('should show edit and status actions with permissions', () => {
        granted.add('PERSONA_EDITAR'); granted.add('PERSONA_ESTADO'); const fixture = TestBed.createComponent(PersonaDetailPage); fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('Editar'); expect(fixture.nativeElement.textContent).toContain('Desactivar');
    });
});
