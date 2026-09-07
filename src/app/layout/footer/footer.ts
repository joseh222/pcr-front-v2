import { Component, inject } from '@angular/core';
import { ConfiguracionParroquiaIdentidadStore } from '../../features/configuracion/data-access/configuracion-parroquia-identidad.store';

@Component({
    selector: 'pcr-footer',
    templateUrl: './footer.html',
    styleUrl: './footer.scss'
})
export class Footer { protected readonly identidadStore = inject(ConfiguracionParroquiaIdentidadStore); }