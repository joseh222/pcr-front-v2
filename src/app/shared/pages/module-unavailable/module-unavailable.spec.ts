import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { AuthStore } from '../../../features/auth/data-access/auth.store';
import { ModuleUnavailablePage } from './module-unavailable';

describe('ModuleUnavailablePage', () => {
    it('shows the missing licensed module', async () => {
        await TestBed.configureTestingModule({
            imports: [ModuleUnavailablePage],
            providers: [
                provideRouter([]),
                { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({ module: 'COMPRAS' }) } } },
                { provide: AuthStore, useValue: { hasPermission: () => true } }
            ]
        }).compileComponents();
        const fixture = TestBed.createComponent(ModuleUnavailablePage);
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('COMPRAS');
        expect(fixture.nativeElement.textContent).toContain('Módulo no habilitado');
    });
});
