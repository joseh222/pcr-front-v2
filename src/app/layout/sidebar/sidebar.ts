import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'pcr-sidebar',
    imports: [MatIconModule],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss'
})
export class Sidebar {
    readonly open = input(false);
    readonly collapsed = input(false);
}
