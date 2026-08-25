import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { TipoComprobanteCompra } from './models/compra-catalog.models';
import { CompraCreateRequest, CompraCreateResponse } from './models/compra-write.models';

@Injectable({ providedIn: 'root' })
export class CompraApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getTiposComprobante(): Observable<readonly TipoComprobanteCompra[]> {
        return this.http.get<readonly TipoComprobanteCompra[]>(`${this.url}/tipos-comprobante`);
    }

    create(request: CompraCreateRequest): Observable<CompraCreateResponse> {
        return this.http.post<CompraCreateResponse>(this.url, request);
    }

    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/Compra`; }
}
