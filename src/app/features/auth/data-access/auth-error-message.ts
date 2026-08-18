import { HttpErrorResponse } from '@angular/common/http';

export function getAuthErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
        return 'No fue posible iniciar sesión. Inténtalo nuevamente.';
    }

    if (error.status === 0) {
        return 'No se pudo conectar con el servidor.';
    }

    const backendMessage = readBackendMessage(error.error);

    if (error.status === 429) {
        const retryAfter = Number(error.headers.get('Retry-After'));

        if (Number.isFinite(retryAfter) && retryAfter > 0) {
            return `${backendMessage ?? 'Demasiadas solicitudes.'} Inténtalo nuevamente en ${Math.ceil(retryAfter)} segundos.`;
        }
    }

    if (backendMessage) {
        return backendMessage;
    }

    switch (error.status) {
        case 400:
            return 'Revisa los datos ingresados.';
        case 401:
            return 'Credenciales inválidas.';
        case 423:
            return 'La cuenta está temporalmente bloqueada.';
        case 429:
            return 'Demasiadas solicitudes. Inténtalo nuevamente más tarde.';
        default:
            return error.status >= 500
                ? 'El servidor no pudo procesar la solicitud.'
                : 'No fue posible iniciar sesión.';
    }
}

function readBackendMessage(value: unknown): string | null {
    if (!isRecord(value)) {
        return null;
    }

    const messages = value['messages'];

    if (Array.isArray(messages)) {
        const validMessages = messages.filter((message): message is string => typeof message === 'string' && !!message.trim());

        if (validMessages.length > 0) {
            return validMessages.join(' ');
        }
    }

    const message = value['message'];

    if (typeof message === 'string' && message.trim()) {
        return message.trim();
    }

    return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}