import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { SacramentalTextCaseService } from './sacramental-text-case.service';
import { SacramentalUppercaseDirective } from './sacramental-uppercase.directive';

@Component({ imports: [ReactiveFormsModule, SacramentalUppercaseDirective], template: '<input pcrSacramentalUppercase [formControl]="control">' })
class HostComponent { readonly control = new FormControl(''); }

describe('SacramentalUppercaseDirective', () => {
    const state = { forzarMayusculas: vi.fn(() => true), ensureLoaded: vi.fn() };
    beforeEach(() => TestBed.configureTestingModule({ imports: [HostComponent], providers: [{ provide: SacramentalTextCaseService, useValue: state }] }));
    it('should convert typed text to uppercase when enabled', () => {
        const fixture = TestBed.createComponent(HostComponent); fixture.detectChanges();
        const input: HTMLInputElement = fixture.nativeElement.querySelector('input'); input.value = 'José pérez'; input.dispatchEvent(new Event('input')); fixture.detectChanges();
        expect(fixture.componentInstance.control.value).toBe('JOSÉ PÉREZ');
    });
});
