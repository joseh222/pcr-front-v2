import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { SacramentalTextCaseService } from './sacramental-text-case.service';

@Directive({ selector: '[pcrSacramentalUppercase]', standalone: true })
export class SacramentalUppercaseDirective {
    private readonly element = inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef);
    private readonly ngControl = inject(NgControl, { self: true, optional: true });
    private readonly textCase = inject(SacramentalTextCaseService);

    constructor() { this.textCase.ensureLoaded(); }

    @HostListener('input')
    onInput(): void {
        if (!this.textCase.forzarMayusculas()) return;
        const native = this.element.nativeElement;
        const current = native.value ?? '';
        const upper = current.toLocaleUpperCase('es-PE');
        if (upper === current) return;
        const start = native.selectionStart; const end = native.selectionEnd;
        native.value = upper;
        this.ngControl?.control?.setValue(upper, { emitEvent: false });
        if (typeof start === 'number' && typeof end === 'number') queueMicrotask(() => { try { native.setSelectionRange(start, end); } catch { /* input type without selection support */ } });
    }
}
