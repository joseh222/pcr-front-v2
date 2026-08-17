import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { RuntimeConfig } from './runtime-config.model';

@Injectable({
    providedIn: 'root'
})
export class RuntimeConfigService {
    private readonly http = inject(HttpClient);
    private readonly configUrl = 'config/app-config.json';
    private configValue: RuntimeConfig | null = null;

    get config(): RuntimeConfig {
        if (!this.configValue) {
            throw new Error('Runtime configuration has not been loaded.');
        }

        return this.configValue;
    }

    async load(): Promise<void> {
        const rawConfig = await firstValueFrom(this.http.get<unknown>(this.configUrl));
        this.configValue = this.validate(rawConfig);
    }

    private validate(value: unknown): RuntimeConfig {
        if (!this.isRecord(value)) {
            throw new Error('Invalid runtime configuration.');
        }

        const apiBaseUrl = this.requireString(value, 'apiBaseUrl').replace(/\/+$/, '');
        const applicationName = this.requireString(value, 'applicationName');
        const environmentName = this.requireString(value, 'environmentName');
        const locale = this.requireString(value, 'locale');
        const currency = this.requireString(value, 'currency').toUpperCase();
        const defaultPageSize = value['defaultPageSize'];
        const featureFlags = this.readFeatureFlags(value['featureFlags']);

        if (typeof defaultPageSize !== 'number' || !Number.isInteger(defaultPageSize) || defaultPageSize <= 0) {
            throw new Error('Runtime configuration "defaultPageSize" must be a positive integer.');
        }

        return {
            apiBaseUrl,
            applicationName,
            environmentName,
            locale,
            currency,
            defaultPageSize,
            featureFlags
        };
    }

    private requireString(record: Record<string, unknown>, key: string): string {
        const value = record[key];

        if (typeof value !== 'string' || !value.trim()) {
            throw new Error(`Runtime configuration "${key}" must be a non-empty string.`);
        }

        return value.trim();
    }

    private readFeatureFlags(value: unknown): Readonly<Record<string, boolean>> {
        if (!this.isRecord(value)) {
            throw new Error('Runtime configuration "featureFlags" must be an object.');
        }

        const flags: Record<string, boolean> = {};

        for (const [key, flag] of Object.entries(value)) {
            if (typeof flag !== 'boolean') {
                throw new Error(`Feature flag "${key}" must be boolean.`);
            }

            flags[key] = flag;
        }

        return flags;
    }

    private isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }
}