import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { LookupSelectorDialog } from './lookup-selector-dialog';

describe('LookupSelectorDialog', () => {
    let fixture: ComponentFixture<LookupSelectorDialog>;
    const close = vi.fn();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LookupSelectorDialog],
            providers: [
                { provide: MatDialogRef, useValue: { close } },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        title: 'Seleccionar producto',
                        icon: 'inventory_2',
                        searchLabel: 'Filtrar productos',
                        load: () => of([
                            { id: 1, title: 'P001 · Vela blanca', subtitle: 'VEL-001 · Velas', value: { idProducto: 1 } },
                            { id: 2, title: 'P002 · Biblia', subtitle: 'BIB-001 · Librería', value: { idProducto: 2 } }
                        ])
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LookupSelectorDialog);
        fixture.detectChanges();
    });

    it('should display all items initially', () => {
        const component = fixture.componentInstance as any;
        expect(component.results().length).toBe(2);
    });

    it('should filter locally and confirm selected item', () => {
        const component = fixture.componentInstance as any;
        component.searchControl.setValue('biblia');
        fixture.detectChanges();

        expect(component.results().length).toBe(1);
        expect(component.results()[0].id).toBe(2);

        component.select(component.results()[0]);
        component.confirm();

        expect(close).toHaveBeenCalledWith({ idProducto: 2 });
    });
});
