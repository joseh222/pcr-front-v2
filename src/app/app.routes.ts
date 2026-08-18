import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        title: 'PCR Front V2',
        loadComponent: () => import('./layout/app-shell/app-shell').then(module => module.AppShell)
    },
    {
        path: '**',
        title: 'Página no encontrada | PCR Front V2',
        loadComponent: () => import('./shared/pages/not-found/not-found').then(module => module.NotFound)
    }
];