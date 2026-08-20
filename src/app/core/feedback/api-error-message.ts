import { HttpErrorResponse } from '@angular/common/http';

export function getApiErrorMessage(error: unknown, fallback = 'No se pudo completar la operación.'): string {
    if (!(error instanceof HttpErrorResponse)) return fallback;

    if (error.status === 0) return 'No se pudo conectar con el servidor.';

    const backendMessage = readBackendMessage(error.error);

    if (backendMessage) return backendMessage;

    return error.status >= 500
        ? 'El servidor no pudo procesar la solicitud.'
        : fallback;
}

function readBackendMessage(value: unknown): string | null {
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (!isRecord(value)) return null;

    const messages = value['messages'];

    if (Array.isArray(messages)) {
        const validMessages = messages.filter((message): message is string =>
            typeof message === 'string' && !!message.trim()
        );

        if (validMessages.length > 0) return validMessages.join(' ');
    }

    const detail = value['detail'];

    if (typeof detail === 'string' && detail.trim()) return detail.trim();

    const message = value['message'];

    if (typeof message === 'string' && message.trim()) return message.trim();

    const errors = value['errors'];

    if (isRecord(errors)) {
        const validationMessages = Object.values(errors)
            .flatMap(item => Array.isArray(item) ? item : [])
            .filter((item): item is string => typeof item === 'string' && !!item.trim());

        if (validationMessages.length > 0) return validationMessages.join(' ');
    }

    return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}