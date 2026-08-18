import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { AuthStore } from '../../data-access/auth.store';
import { ChangePasswordPage } from './change-password';

describe('ChangePasswordPage', () => {
    let fixture: ComponentFixture<ChangePasswordPage>;

    const authStoreMock = {
        changePassword: vi.fn()
    };

    const routerMock = {
        navigateByUrl: vi.fn()
    };

    beforeEach(async () => {
        authStoreMock.changePassword.mockReset();
        routerMock.navigateByUrl.mockReset();
        routerMock.navigateByUrl.mockResolvedValue(true);

        await TestBed.configureTestingModule({
            imports: [ChangePasswordPage],
            providers: [
                { provide: AuthStore, useValue: authStoreMock },
                { provide: Router, useValue: routerMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ChangePasswordPage);
        fixture.detectChanges();
    });

    it('should not submit when the form is invalid', async () => {
        submitForm();

        await fixture.whenStable();
        fixture.detectChanges();

        expect(authStoreMock.changePassword).not.toHaveBeenCalled();
        expect(fixture.nativeElement.textContent).toContain('La contraseña actual es obligatoria.');
        expect(fixture.nativeElement.textContent).toContain('La nueva contraseña es obligatoria.');
        expect(fixture.nativeElement.textContent).toContain('Debes confirmar la nueva contraseña.');
    });

    it('should reject passwords that do not match', async () => {
        setInput('current-password', 'Temporal123!');
        setInput('new-password', 'NuevaPassword123!');
        setInput('confirm-password', 'OtraPassword123!');

        submitForm();

        await fixture.whenStable();
        fixture.detectChanges();

        expect(authStoreMock.changePassword).not.toHaveBeenCalled();
        expect(fixture.nativeElement.textContent).toContain(
            'La nueva contraseña y su confirmación no coinciden.'
        );
    });

    it('should reject the current password as the new password', async () => {
        setInput('current-password', 'Temporal123!');
        setInput('new-password', 'Temporal123!');
        setInput('confirm-password', 'Temporal123!');

        submitForm();

        await fixture.whenStable();
        fixture.detectChanges();

        expect(authStoreMock.changePassword).not.toHaveBeenCalled();
        expect(fixture.nativeElement.textContent).toContain(
            'La nueva contraseña debe ser diferente de la contraseña actual.'
        );
    });

    it('should change the password and navigate to login when a new login is required', async () => {
        authStoreMock.changePassword.mockResolvedValue({
            mensaje: 'Contraseña actualizada correctamente.',
            requiresNewLogin: true
        });

        setInput('current-password', 'Temporal123!');
        setInput('new-password', 'NuevaPassword123!');
        setInput('confirm-password', 'NuevaPassword123!');

        submitForm();

        await fixture.whenStable();

        expect(authStoreMock.changePassword).toHaveBeenCalledWith({
            currentPassword: 'Temporal123!',
            newPassword: 'NuevaPassword123!',
            confirmPassword: 'NuevaPassword123!'
        });

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login', {
            replaceUrl: true,
            state: {
                passwordChanged: true,
                message: 'Contraseña actualizada correctamente.'
            }
        });
    });

    it('should display the backend error', async () => {
        authStoreMock.changePassword.mockRejectedValue(new HttpErrorResponse({
            status: 400,
            error: {
                success: false,
                code: 400,
                messages: ['La contraseña actual no es correcta.']
            }
        }));

        setInput('current-password', 'Incorrecta123!');
        setInput('new-password', 'NuevaPassword123!');
        setInput('confirm-password', 'NuevaPassword123!');

        submitForm();

        await fixture.whenStable();
        fixture.detectChanges();

        const error = fixture.nativeElement.querySelector(
            '[data-testid="change-password-error"]'
        );

        expect(error?.textContent).toContain('La contraseña actual no es correcta.');
        expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
    });

    function setInput(testId: string, value: string): void {
        const input = fixture.nativeElement.querySelector(
            `[data-testid="${testId}"]`
        ) as HTMLInputElement;

        input.value = value;
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
    }

    function submitForm(): void {
        const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

        form.dispatchEvent(new Event('submit', {
            bubbles: true,
            cancelable: true
        }));
    }
});