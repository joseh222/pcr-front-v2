import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { ThemeService } from '../../../../core/theme/theme.service';
import { getAuthErrorMessage } from '../../data-access/auth-error-message';
import { AuthStore } from '../../data-access/auth.store';

@Component({
    selector: 'pcr-login',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class LoginPage {
    private readonly formBuilder = inject(FormBuilder).nonNullable;
    private readonly router = inject(Router);

    protected readonly authStore = inject(AuthStore);
    protected readonly theme = inject(ThemeService);
    protected readonly runtimeConfig = inject(RuntimeConfigService).config;
    protected readonly showPassword = signal(false);
    protected readonly errorMessage = signal<string | null>(null);

    protected readonly form = this.formBuilder.group({
        username: ['', [Validators.required, Validators.maxLength(100)]],
        password: ['', [Validators.required, Validators.maxLength(256)]]
    });

    protected togglePasswordVisibility(): void {
        this.showPassword.update(value => !value);
    }

    protected async submit(): Promise<void> {
        if (this.form.invalid || this.authStore.isAuthenticating()) {
            this.form.markAllAsTouched();
            return;
        }

        this.errorMessage.set(null);

        const { username, password } = this.form.getRawValue();

        try {
            await this.authStore.login({
                username: username.trim(),
                password,
                deviceId: null,
                deviceLabel: this.runtimeConfig.applicationName
            });

            if (this.authStore.mustChangePassword()) {
                await this.router.navigateByUrl('/change-password', { replaceUrl: true });
                return;
            }

            await this.router.navigateByUrl('/', { replaceUrl: true });
        } catch (error) {
            this.errorMessage.set(getAuthErrorMessage(error));
        }
    }
}