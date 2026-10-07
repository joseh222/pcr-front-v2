import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        title: 'Iniciar sesión | PCR Front V2',
        loadComponent: () => import('./pages/login/login').then(module => module.LoginPage)
    }
];