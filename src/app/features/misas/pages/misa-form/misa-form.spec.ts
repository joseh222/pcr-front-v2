import { TestBed } from '@angular/core/testing';
import {
    ActivatedRoute,
    convertToParamMap,
    provideRouter
} from '@angular/router';

import { MisaFormPage } from './misa-form';

describe('MisaFormPage', () => {

    it('should render create mode', async () => {
        await configureRoute({});

        const fixture =
            TestBed.createComponent(MisaFormPage);

        fixture.detectChanges();

        expect(
            fixture.nativeElement.textContent
        ).toContain('Nueva misa');

        expect(
            fixture.nativeElement.textContent
        ).toContain(
            'Registra una nueva misa e intenciones parroquiales.'
        );

        expect(
            fixture.nativeElement.querySelector(
                '[data-testid="misa-edit-id"]'
            )
        ).toBeNull();
    });

    it('should render edit mode with the misa id', async () => {
        await configureRoute({
            id: '25'
        });

        const fixture =
            TestBed.createComponent(MisaFormPage);

        fixture.detectChanges();

        expect(
            fixture.nativeElement.textContent
        ).toContain('Editar misa');

        expect(
            fixture.nativeElement.textContent
        ).toContain(
            'Edita la información de la misa seleccionada.'
        );

        expect(
            fixture.nativeElement.querySelector(
                '[data-testid="misa-edit-id"]'
            )?.textContent
        ).toContain('25');
    });

    async function configureRoute(
        params: Record<string, string>
    ): Promise<void> {
        TestBed.resetTestingModule();

        await TestBed.configureTestingModule({
            imports: [
                MisaFormPage
            ],
            providers: [
                provideRouter([]),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap:
                                convertToParamMap(params)
                        }
                    }
                }
            ]
        }).compileComponents();
    }
});