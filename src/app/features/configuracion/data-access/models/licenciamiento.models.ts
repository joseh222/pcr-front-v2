export interface ModuloLicenciaEstado {
    codigo: string;
    nombre: string;
    descripcion: string | null;
    esCore: boolean;
    habilitado: boolean;
    dependencias: readonly string[];
}

export interface LicenciamientoEstado {
    productCode: string;
    installationId: string;
    installationCode: string;
    parishName: string | null;
    estado: string;
    licenciamientoConfigurado: boolean;
    licenciaValida: boolean;
    licenseId: string | null;
    customerName: string | null;
    licenseType: string | null;
    keyId: string | null;
    issuedAtUtc: string | null;
    expiresAtUtc: string | null;
    activatedAtUtc: string | null;
    activatedBy: string | null;
    mensaje: string | null;
    modulos: readonly ModuloLicenciaEstado[];
}

export interface SolicitudLicenciaModulo {
    code: string;
    name: string;
    description: string | null;
    isCore: boolean;
    dependencies: readonly string[];
}

export interface SolicitudLicenciaDocument {
    schemaVersion: number;
    productCode: string;
    installationId: string;
    installationCode: string;
    parishName: string;
    appVersion: string;
    generatedAtUtc: string;
    modules: readonly SolicitudLicenciaModulo[];
}

export interface LicenciaActivarResponse {
    exito: boolean;
    codigo: string;
    mensaje: string;
    estado: LicenciamientoEstado;
}

export interface LicenciaHistorial {
    licenseId: string;
    customerName: string;
    licenseType: string;
    keyId: string;
    issuedAtUtc: string;
    expiresAtUtc: string | null;
    estado: string;
    activatedAtUtc: string;
    activatedBy: string;
    modulos: readonly string[];
}
