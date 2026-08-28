import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PersonaSearchItem } from '../../../personas/data-access/models/persona-api.models';
import { PersonaApiService } from '../../../personas/data-access/persona-api.service';
import { TemporaryPasswordDialog } from '../../components/temporary-password-dialog/temporary-password-dialog';
import { UsuarioRole } from '../../data-access/models/usuario-api.models';
import { UsuarioFormStore } from '../../data-access/models/usuario-form.store';

@Component({
    selector: 'pcr-usuario-form',
    imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule],
    providers: [UsuarioFormStore], templateUrl: './usuario-form.html', styleUrl: './usuario-form.scss'
})
export class UsuarioFormPage implements OnInit {
    protected readonly store = inject(UsuarioFormStore); private readonly route = inject(ActivatedRoute); private readonly router = inject(Router); private readonly fb = inject(FormBuilder); private readonly feedback = inject(FeedbackService); private readonly dialog = inject(MatDialog); private readonly personaApi = inject(PersonaApiService); private readonly authStore = inject(AuthStore); private readonly destroyRef = inject(DestroyRef);
    protected readonly idUser = signal<number | null>(null); protected readonly canAssignRoles = computed(() => this.authStore.hasPermission(PERMISSION_CODE.USER_ASSIGN_ROLES)); protected readonly personOptions = signal<readonly PersonaSearchItem[]>([]); protected readonly isEditMode = computed(() => this.idUser() !== null); protected readonly isSelf = computed(() => this.idUser() !== null && this.authStore.currentUser()?.idUser === this.idUser());
    protected readonly isProtectedAdmin = computed(() => !!this.store.detail()?.roles.some(role => role.isActive && role.grantsAllPermissions) && !this.authStore.grantsAllPermissions());
    protected readonly canSave = computed(() => !this.isProtectedAdmin() && (this.isEditMode() || this.canAssignRoles())); protected readonly pageTitle = computed(() => this.isEditMode() ? 'Editar usuario' : 'Nuevo usuario'); protected readonly pageDescription = computed(() => this.isEditMode() ? 'Actualiza sus datos, vínculo con persona y roles de acceso.' : 'Crea una cuenta de acceso y asigna uno o más roles del sistema.');
    readonly form = this.fb.group({ username: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(100), Validators.pattern(/^[A-Za-z0-9._-]+$/)]), nombreCompleto: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]), email: this.fb.nonNullable.control('', [Validators.email, Validators.maxLength(256)]), personaSearch: this.fb.nonNullable.control(''), idPersona: this.fb.control<number | null>(null), roles: this.fb.nonNullable.control<number[]>([], Validators.required) });

    private readonly syncDetail = effect(() => {
        const detail = this.store.detail(); if (!detail) return;
        this.form.patchValue({ username: detail.username, nombreCompleto: detail.nombreCompleto ?? '', email: detail.email ?? '', idPersona: detail.idPersona, roles: detail.roles.map(role => role.idRole), personaSearch: detail.personaNombreCompleto ?? detail.codPersona ?? '' }, { emitEvent: false });
        if (detail.idPersona) this.personOptions.update(items => items.some(item => item.idPersona === detail.idPersona) ? items : [{ idPersona: detail.idPersona!, codPersona: detail.codPersona, idTipoDocumento: detail.personaIdTipoDocumento, codigoTipoDocumento: null, numeroDocumento: detail.personaNumeroDocumento, nombreCompleto: detail.personaNombreCompleto, fechaNacimiento: null, telefono: detail.personaTelefono, email: detail.personaEmail, rolesPersona: null }, ...items]);
    });
    private readonly syncSaveError = effect(() => { const error = this.store.saveError(); if (!error) return; this.feedback.error(error); this.store.clearSaveError(); });
    private readonly syncRoleAccess = effect(() => { this.isEditMode(); this.isSelf(); this.isProtectedAdmin(); this.canAssignRoles(); this.syncFormAccess(); });
    private readonly syncSaveResult = effect(() => {
        const result = this.store.saveResult(); if (!result) return; const wasEdit = this.isEditMode(); this.store.clearSaveResult();
        if ('temporaryPassword' in result) {
            this.dialog.open(TemporaryPasswordDialog, { width: 'min(520px, calc(100vw - 2rem))', data: { title: 'Usuario creado', username: result.username, temporaryPassword: result.temporaryPassword, message: result.mensaje } }).afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => void this.router.navigate(['/seguridad/usuarios']));
            return;
        }
        void this.router.navigate(['/seguridad/usuarios']).then(() => this.feedback.success(result.mensaje || (wasEdit ? 'Usuario actualizado correctamente.' : 'Usuario guardado correctamente.')));
    });

    constructor() {
        this.form.controls.personaSearch.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), switchMap(value => { const search = value.trim(); return search.length >= 3 ? this.personaApi.search(search, 10).pipe(catchError(() => of([]))) : of([]); }), takeUntilDestroyed(this.destroyRef)).subscribe(items => this.setPersonOptions(items));
        this.form.controls.idPersona.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(id => this.applyPerson(id));
    }

    ngOnInit(): void {
        const rawId = this.route.snapshot.paramMap.get('id');
        if (rawId === null) { this.store.initialize(null); return; }
        const id = Number(rawId); if (!Number.isInteger(id) || id <= 0) { void this.router.navigate(['/seguridad/usuarios']); return; }
        this.idUser.set(id); this.syncFormAccess(); this.store.initialize(id);
    }

    protected save(): void {
        this.form.markAllAsTouched(); if (this.form.invalid || this.store.saving() || !this.canSave()) return;
        const value = this.form.getRawValue(); const common = { email: this.nullable(value.email)?.toLowerCase() ?? null, nombreCompleto: value.nombreCompleto.trim(), idPersona: value.idPersona, roles: [...new Set(value.roles)] };
        const id = this.idUser(); if (id === null) { this.store.create({ username: value.username.trim(), ...common }); return; }
        const rowVersion = this.store.detail()?.rowVersion; if (!rowVersion) { this.feedback.warning('Recarga el usuario antes de guardar los cambios.'); return; }
        this.store.update(id, { ...common, rowVersion });
    }
    protected selectPersonLabel(person: PersonaSearchItem): string { const identity = person.numeroDocumento ? ` · ${person.numeroDocumento}` : ''; return `${person.nombreCompleto || person.codPersona || 'Persona'}${identity}`; }
    protected roleDescription(role: UsuarioRole): string { return role.description?.trim() || role.name; }
    protected clearPerson(): void { this.form.patchValue({ idPersona: null, personaSearch: '' }); this.personOptions.set([]); }
    private setPersonOptions(items: readonly PersonaSearchItem[]): void { const selectedId = this.form.controls.idPersona.value; const selected = this.personOptions().find(item => item.idPersona === selectedId); this.personOptions.set(selected && !items.some(item => item.idPersona === selected.idPersona) ? [selected, ...items] : items); }
    private applyPerson(idPersona: number | null): void { const person = this.personOptions().find(item => item.idPersona === idPersona); if (!person) return; this.form.controls.personaSearch.setValue(person.nombreCompleto ?? person.codPersona ?? '', { emitEvent: false }); if (!this.form.controls.nombreCompleto.value.trim() && person.nombreCompleto) this.form.controls.nombreCompleto.setValue(person.nombreCompleto); if (!this.form.controls.email.value.trim() && person.email) this.form.controls.email.setValue(person.email); }
    private syncFormAccess(): void {
        const locked = this.isProtectedAdmin();
        if (locked) { this.form.controls.nombreCompleto.disable({ emitEvent: false }); this.form.controls.email.disable({ emitEvent: false }); this.form.controls.personaSearch.disable({ emitEvent: false }); this.form.controls.idPersona.disable({ emitEvent: false }); }
        else { this.form.controls.nombreCompleto.enable({ emitEvent: false }); this.form.controls.email.enable({ emitEvent: false }); this.form.controls.personaSearch.enable({ emitEvent: false }); this.form.controls.idPersona.enable({ emitEvent: false }); }
        if (locked || this.isSelf() || !this.canAssignRoles()) this.form.controls.roles.disable({ emitEvent: false }); else this.form.controls.roles.enable({ emitEvent: false });
    }
    private nullable(value: string): string | null { const normalized = value.trim(); return normalized || null; }
}
