import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable, catchError, of } from 'rxjs';

export interface LookupSelectorItem<T = unknown> {
    readonly id: string | number;
    readonly title: string;
    readonly subtitle?: string | null;
    readonly detail?: string | null;
    readonly badge?: string | null;
    readonly disabled?: boolean;
    readonly disabledReason?: string | null;
    readonly value: T;
}

export interface LookupSelectorDialogData<T = unknown> {
    readonly title: string;
    readonly icon: string;
    readonly searchLabel: string;
    readonly placeholder?: string;
    readonly hint?: string;
    readonly emptyText?: string;
    readonly load: () => Observable<readonly LookupSelectorItem<T>[]>;
    readonly filterText?: (item: LookupSelectorItem<T>) => string;
}

@Component({
    selector: 'pcr-lookup-selector-dialog',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule
    ],
    templateUrl: './lookup-selector-dialog.html',
    styleUrl: './lookup-selector-dialog.scss'
})
export class LookupSelectorDialog implements OnInit {
    protected readonly data = inject<LookupSelectorDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<LookupSelectorDialog, unknown>);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly searchControl = new FormControl('', { nonNullable: true });
    protected readonly allItems = signal<readonly LookupSelectorItem[]>([]);
    protected readonly results = signal<readonly LookupSelectorItem[]>([]);
    protected readonly selected = signal<LookupSelectorItem | null>(null);
    protected readonly loading = signal(false);
    protected readonly error = signal<string | null>(null);

    ngOnInit(): void {
        this.loadAll();

        this.searchControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(value => this.applyFilter(value));
    }

    protected select(item: LookupSelectorItem): void {
        if (item.disabled) return;
        this.selected.set(item);
    }

    protected confirm(): void {
        const item = this.selected();
        if (!item || item.disabled) return;
        this.dialogRef.close(item.value);
    }

    protected totalCount(): number {
        return this.allItems().length;
    }

    private loadAll(): void {
        this.loading.set(true);
        this.error.set(null);

        this.data.load()
            .pipe(
                catchError(() => {
                    this.error.set('No se pudieron cargar las opciones disponibles.');
                    return of([] as readonly LookupSelectorItem[]);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(items => {
                this.allItems.set(items);
                this.loading.set(false);
                this.applyFilter(this.searchControl.value);
            });
    }

    private applyFilter(rawValue: string): void {
        this.selected.set(null);

        const term = this.normalize(rawValue);
        const source = this.allItems();

        if (!term) {
            this.results.set(source);
            return;
        }

        this.results.set(source.filter(item => {
            const customText = this.data.filterText?.(item);
            const haystack = customText ?? [
                item.title,
                item.subtitle ?? '',
                item.detail ?? '',
                item.badge ?? ''
            ].join(' ');

            return this.normalize(haystack).includes(term);
        }));
    }

    private normalize(value: string): string {
        return value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase()
            .trim();
    }
}
