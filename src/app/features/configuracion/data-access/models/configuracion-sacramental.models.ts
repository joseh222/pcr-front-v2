export interface ConfiguracionSacramental {
    readonly forzarMayusculas: boolean;
    readonly updatedUtc: string | null;
    readonly updatedBy: string | null;
    readonly rowVersion: string;
}

export interface ConfiguracionSacramentalUpdateRequest {
    readonly forzarMayusculas: boolean;
    readonly rowVersion: string;
}
