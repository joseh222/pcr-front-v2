import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

import { AuthStore } from '../../data-access/auth.store';

@Component({
    selector: 'pcr-change-password',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './change-password.html',
    styleUrl: './change-password.scss'
})
export class ChangePasswordPage {
    private readonly formBuilder = inject(FormBuilder).nonNullable;
    private readonly router = inject(Router);

    protected readonly authStore = inject(AuthStore);
    protected readonly showPasswords = signal(false);
    protected readonly isSubmitting = signal(false);
    protected readonly errorMessage = signal<string | null>(null);

    protected readonly form = this.formBuilder.group({
        currentPassword: ['', [Validators.required, Validators.maxLength(256)]],
        newPassword: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(64)]],
        confirmPassword: ['', [Validators.required, Validators.maxLength(64)]]
    }, {
        validators: passwordChangeValidator
    });

    protected togglePasswordVisibility(): void {
        this.showPasswords.update(value => !value);
    }

    protected async submit(): Promise<void> {
        if (this.form.invalid || this.isSubmitting()) {
            this.form.markAllAsTouched();
            return;
        }

        this.errorMessage.set(null);
        this.isSubmitting.set(true);

        try {
            const response = await this.authStore.changePassword(this.form.getRawValue());

            if (response.requiresNewLogin) {
                await this.router.navigateByUrl('/login', {
                    replaceUrl: true,
                    state: {
                        passwordChanged: true,
                        message: response.mensaje
                    }
                });
                return;
            }

            await this.router.navigateByUrl('/', { replaceUrl: true });
        } catch (error) {
            this.errorMessage.set(getPasswordChangeErrorMessage(error));
        } finally {
            this.isSubmitting.set(false);
        }
    }
}

function passwordChangeValidator(control: AbstractControl): ValidationErrors | null {
    const currentPassword = control.get('currentPassword')?.value;
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    const errors: ValidationErrors = {};

    if (currentPassword && newPassword && currentPassword === newPassword) {
        errors['samePassword'] = true;
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        errors['passwordMismatch'] = true;
    }

    return Object.keys(errors).length ? errors : null;
}

function getPasswordChangeErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
        return 'No fue posible cambiar la contraseña. Inténtalo nuevamente.';
    }

    if (error.status === 0) {
        return 'No se pudo conectar con el servidor.';
    }

    const messages = error.error?.messages;

    if (Array.isArray(messages)) {
        const validMessages = messages.filter((message): message is string =>
            typeof message === 'string' && !!message.trim()
        );

        if (validMessages.length) {
            return validMessages.join(' ');
        }
    }

    if (typeof error.error?.message === 'string' && error.error.message.trim()) {
        return error.error.message.trim();
    }

    if (error.status === 401) {
        return 'La sesión ya no es válida. Inicia sesión nuevamente.';
    }

    return error.status >= 500
        ? 'El servidor no pudo procesar el cambio de contraseña.'
        : 'No fue posible cambiar la contraseña.';
}