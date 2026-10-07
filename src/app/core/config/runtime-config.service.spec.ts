import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RuntimeConfigService } from './runtime-config.service';

describe('RuntimeConfigService', () => {
    let service: RuntimeConfigService;
    let httpTesting: HttpTestingController;

    const validConfig = {
        apiBaseUrl: 'https://localhost:7002/api/',
        applicationName: 'PCR Front V2',
        environmentName: 'DEV',
        locale: 'es-PE',
        currency: 'pen',
        defaultPageSize: 10,
        featureFlags: {}
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RuntimeConfigService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(RuntimeConfigService);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should load and normalize the runtime configuration', async () => {
        const loadPromise = service.load();
        const request = httpTesting.expectOne('config/app-config.json');

        expect(request.request.method).toBe('GET');

        request.flush(validConfig);
        await loadPromise;

        expect(service.config.apiBaseUrl).toBe('https://localhost:7002/api');
        expect(service.config.environmentName).toBe('DEV');
        expect(service.config.currency).toBe('PEN');
        expect(service.config.defaultPageSize).toBe(10);
    });

    it('should throw when configuration is accessed before loading', () => {
        expect(() => service.config).toThrowError('Runtime configuration has not been loaded.');
    });

    it('should reject an invalid runtime configuration', async () => {
        const loadPromise = service.load();
        const request = httpTesting.expectOne('config/app-config.json');

        request.flush({
            ...validConfig,
            defaultPageSize: 0
        });

        await expect(loadPromise).rejects.toThrow('Runtime configuration "defaultPageSize" must be a positive integer.');
    });
});