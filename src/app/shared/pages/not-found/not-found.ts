import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'pcr-not-found',
    imports: [
        RouterLink,
        MatButtonModule,
        MatCardModule
    ],
    templateUrl: './not-found.html',
    styleUrl: './not-found.scss'
})
export class NotFound { }