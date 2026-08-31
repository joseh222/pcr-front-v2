import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { MisaApiService } from './misa-api.service';
import {
    MisaCreateRequest,
    MisaUpdateRequest
} from './models/misa-write.models';

describe('MisaApiService', () => {
    let service: MisaApiService;
    let httpTesting: HttpTestingController;
    const apiBaseUrl = 'https://localhost:7002/api';
    const apiUrl = 'https://localhost:7002/api/Misa';

    const runtimeConfigMock = {
        config: {
            apiBaseUrl: 'https://localhost:7002/api'
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MisaApiService,
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: RuntimeConfigService,
                    useValue: runtimeConfigMock
                }
            ]
        });

        service = TestBed.inject(MisaApiService);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should request the paginated misa list with filters', () => {
        service.getList({
            fechaInicio: '2026-08-01',
            fechaFin: '2026-08-31',
            idModalidad: 1,
            idTipo: 2,
            idEstado: 3,
            estadoPago: 'PENDIENTE',
            texto: 'JUAN',
            pagina: 2,
            tamanoPagina: 20
        }).subscribe();

        const request = httpTesting.expectOne(req =>
            req.url === apiUrl
        );

        expect(request.request.method).toBe('GET');
        expect(request.request.params.get('fechaInicio')).toBe('2026-08-01');
        expect(request.request.params.get('fechaFin')).toBe('2026-08-31');
        expect(request.request.params.get('idModalidad')).toBe('1');
        expect(request.request.params.get('idTipo')).toBe('2');
        expect(request.request.params.get('idEstado')).toBe('3');
        expect(request.request.params.get('estadoPago')).toBe('PENDIENTE');
        expect(request.request.params.get('texto')).toBe('JUAN');
        expect(request.request.params.get('pagina')).toBe('2');
        expect(request.request.params.get('tamanoPagina')).toBe('20');

        request.flush({
            pagina: 2,
            tamanoPagina: 20,
            totalRegistros: 0,
            totalPaginas: 0,
            items: []
        });
    });

    it('should omit empty optional filters from the misa list', () => {
        service.getList({
            fechaInicio: null,
            fechaFin: null,
            idModalidad: null,
            idTipo: null,
            idEstado: null,
            estadoPago: '',
            texto: '   ',
            pagina: 1,
            tamanoPagina: 20
        }).subscribe();

        const request = httpTesting.expectOne(req =>
            req.url === apiUrl
        );

        expect(request.request.params.keys()).toEqual([
            'pagina',
            'tamanoPagina'
        ]);

        request.flush({
            pagina: 1,
            tamanoPagina: 20,
            totalRegistros: 0,
            totalPaginas: 0,
            items: []
        });
    });

    it('should request a misa by id', () => {
        service.getById(15).subscribe();

        const request = httpTesting.expectOne(
            `${apiUrl}/15`
        );

        expect(request.request.method).toBe('GET');

        request.flush({
            idMisa: 15,
            intenciones: [],
            puedeEditar: true,
            puedeEliminar: true,
            puedeCobrar: false
        });
    });

    it('should request misa catalogs', () => {
        service.getModalidades().subscribe();
        service.getTipos().subscribe();
        service.getSantos().subscribe();
        service.getEstados().subscribe();

        const modalidades = httpTesting.expectOne(
            `${apiUrl}/modalidades`
        );
        const tipos = httpTesting.expectOne(
            `${apiUrl}/tipos`
        );
        const santos = httpTesting.expectOne(
            `${apiUrl}/santos`
        );
        const estados = httpTesting.expectOne(
            `${apiUrl}/estados`
        );

        expect(modalidades.request.method).toBe('GET');
        expect(tipos.request.method).toBe('GET');
        expect(santos.request.method).toBe('GET');
        expect(estados.request.method).toBe('GET');

        modalidades.flush([]);
        tipos.flush([]);
        santos.flush([]);
        estados.flush([]);
    });

    it('should request the misa price calculation', () => {
        service.getPrecioCalculo(2, 1).subscribe();

        const request = httpTesting.expectOne(req =>
            req.url === `${apiUrl}/precio-calculo`
        );

        expect(request.request.method).toBe('GET');
        expect(request.request.params.get('idTipo')).toBe('2');
        expect(request.request.params.get('idModalidad')).toBe('1');

        request.flush({
            idTipo: 2,
            codigoTipo: 'DIFUNTO',
            nombreTipo: 'Difunto',
            idModalidad: 1,
            nombreModalidad: 'Personal',
            modoCalculo: 'FIJO',
            precioBase: 30,
            fechaVigencia: '2026-01-01T00:00:00'
        });
    });


    it('should use misa-scoped person lookups', () => {
        service.getPersonaTiposDocumento().subscribe(); let request = httpTesting.expectOne(`${apiUrl}/personas/tipos-documento`); request.flush([]);
        service.searchPersonas('jose', 10).subscribe(); request = httpTesting.expectOne(req => req.url === `${apiUrl}/personas/search`); expect(request.request.params.get('search')).toBe('jose'); request.flush([]);
        service.getPersonaByDocument(1, '12345678').subscribe(); request = httpTesting.expectOne(req => req.url === `${apiUrl}/personas/by-document`); request.flush(null);
    });

    it('should create a misa', () => {
        const body = createRequest();

        service.create(body).subscribe();

        const request = httpTesting.expectOne(apiUrl);

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(body);

        request.flush(
            {
                idMisa: 20,
                codMisa: 'M2026-00020',
                idSolicitudServicio: 50,
                codSolicitudServicio: 'SOL-000050',
                requierePago: true,
                importe: 30,
                estadoPago: 'PENDIENTE',
                mensaje: 'Misa registrada correctamente.'
            },
            {
                status: 201,
                statusText: 'Created'
            }
        );
    });

    it('should update a misa without sending idMisa in the body', () => {
        const body = updateRequest();

        service.update(20, body).subscribe();

        const request = httpTesting.expectOne(
            `${apiUrl}/20`
        );

        expect(request.request.method).toBe('PUT');
        expect(request.request.body).toEqual(body);
        expect(request.request.body).not.toHaveProperty('idMisa');

        request.flush({
            idMisa: 20,
            codMisa: 'M2026-00020',
            idSolicitudServicio: 50,
            codSolicitudServicio: 'SOL-000050',
            requierePago: true,
            importe: 30,
            estadoPago: 'PENDIENTE',
            mensaje: 'Misa actualizada correctamente.'
        });
    });

    it('should delete a misa', () => {
        service.delete(20).subscribe();

        const request = httpTesting.expectOne(
            `${apiUrl}/20`
        );

        expect(request.request.method).toBe('DELETE');
        expect(request.request.body).toBeNull();

        request.flush({
            idMisa: 20,
            idSolicitudServicio: 50,
            codSolicitudServicio: 'SOL-000050',
            estadoSolicitud: 'ANULADA',
            mensaje: 'Misa eliminada correctamente.'
        });
    });

    function createRequest(): MisaCreateRequest {
        return {
            modalidad: { idModalidad: 1 },
            tipo: { idTipo: 2 },
            solicitante: {
                idPersona: 10,
                idTipoDocumento: 1,
                numeroDocumento: '12345678',
                nombre: 'JUAN PEREZ',
                telefono: '999999999'
            },
            intenciones: [
                {
                    nombre: 'MARIA PEREZ',
                    observacion: null
                }
            ],
            fecha: '2026-08-30',
            hora: '18:00:00',
            observaciones: null,
            requierePago: true,
            motivoNoPago: null,
            motivo: null,
            ofrecen: null,
            celular: null,
            devotos: null,
            santo: null
        };
    }

    function updateRequest(): MisaUpdateRequest {
        return {
            ...createRequest(),
            intenciones: [
                {
                    idIntencion: 5,
                    nombre: 'MARIA PEREZ',
                    observacion: null
                }
            ]
        };
    }

    it('should correct existing intentions without full misa update', () => {
        const payload = { intenciones: [{ idIntencion: 10, nombre: 'JUAN CORREGIDO', observacion: null }] };
        service.correctIntenciones(5, payload).subscribe();
        const req = httpTesting.expectOne(`${apiBaseUrl}/Misa/5/intenciones`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual(payload);
        req.flush({ idMisa: 5, codMisa: 'M2026-0005', cantidadCorregida: 1, mensaje: 'OK' });
    });
});