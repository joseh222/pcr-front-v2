import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
    private readonly snackBar = inject(MatSnackBar);

    success(message: string): void {
        this.open(message, '', {
            duration: 3500,
            politeness: 'polite'
        });
    }

    error(message: string): void {
        this.open(message, 'Cerrar', {
            politeness: 'assertive'
        });
    }

    warning(message: string): void {
        this.open(message, 'Cerrar', {
            politeness: 'polite'
        });
    }

    info(message: string): void {
        this.open(message, '', {
            duration: 4500,
            politeness: 'polite'
        });
    }

    private open(message: string, action: string, config: MatSnackBarConfig): void {
        const text = message.trim();

        if (!text) return;

        this.snackBar.open(text, action, {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            ...config
        });
    }
}