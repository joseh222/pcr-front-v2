import { routes } from '../../app.routes';
import { permissionGuard } from '../../core/auth/guards/permission.guard';
import { PERMISSION_CODE } from '../../core/auth/permission-code.model';

describe('Persona RBAC routes', () => {
    const children = routes.find(route => route.path === '')?.children ?? [];
    const route = (path: string) => children.find(item => item.path === path);

    it('should protect list and detail with PERSONA_VER', () => {
        for (const path of ['personas', 'personas/:id']) { expect(route(path)?.canActivate).toContain(permissionGuard); expect(route(path)?.data?.['permissions']).toEqual([PERMISSION_CODE.PERSON_VIEW]); }
    });

    it('should require view plus the corresponding write permission', () => {
        expect(route('personas/nueva')?.data?.['permissions']).toEqual([PERMISSION_CODE.PERSON_VIEW, PERMISSION_CODE.PERSON_CREATE]);
        expect(route('personas/:id/editar')?.data?.['permissions']).toEqual([PERMISSION_CODE.PERSON_VIEW, PERMISSION_CODE.PERSON_EDIT]);
    });
});
