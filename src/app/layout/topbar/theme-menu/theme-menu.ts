import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ThemePreference } from '../../../core/theme/theme.model';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
    selector: 'pcr-theme-menu',
    imports: [MatButtonModule, MatIconModule, MatMenuModule],
    templateUrl: './theme-menu.html',
    styleUrl: './theme-menu.scss'
})
export class ThemeMenu {
    protected readonly themeService = inject(ThemeService);

    protected setTheme(preference: ThemePreference): void {
        this.themeService.setPreference(preference);
    }
}