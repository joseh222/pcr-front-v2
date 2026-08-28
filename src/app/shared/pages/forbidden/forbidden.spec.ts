import { TestBed } from '@angular/core/testing';
import { ForbiddenPage } from './forbidden';

describe('ForbiddenPage', () => {
    it('should render access denied state', async () => {
        await TestBed.configureTestingModule({ imports: [ForbiddenPage] }).compileComponents();
        const fixture = TestBed.createComponent(ForbiddenPage); fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[data-testid="forbidden-page"]')).toBeTruthy();
        expect(fixture.nativeElement.textContent).toContain('Acceso restringido');
    });
});
