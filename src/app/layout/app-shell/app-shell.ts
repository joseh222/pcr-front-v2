import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { ThemeService } from '../../core/theme/theme.service';

@Component({
    selector: 'pcr-app-shell',
    imports: [
        MatButtonModule,
        MatCardModule
    ],
    templateUrl: './app-shell.html',
    styleUrl: './app-shell.scss'
})
export class AppShell {
    protected readonly theme = inject(ThemeService);
}