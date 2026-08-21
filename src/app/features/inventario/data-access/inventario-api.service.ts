import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { InventarioProducto, MovimientoInventarioCreateRequest, MovimientoInventarioCreateResponse, MovimientoInventarioListQuery, MovimientoInventarioPagedResponse, TipoMovimientoInventario } from './models/inventario.models';

@Injectable({ providedIn: 'root' })
export class InventarioApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getTiposMovimiento(): Observable<readonly TipoMovimientoInventario[]> { return this.http.get<readonly TipoMovimientoInventario[]>(`${this.url}/tipos-movimiento`); }
    getTiposMovimientoHistorial(): Observable<readonly TipoMovimientoInventario[]> { return this.http.get<readonly TipoMovimientoInventario[]>(`${this.url}/tipos-movimiento/historial`); }
    getByProducto(idProducto: number): Observable<InventarioProducto> { return this.http.get<InventarioProducto>(`${this.url}/productos/${idProducto}`); }
    createMovimiento(idProducto: number, request: MovimientoInventarioCreateRequest): Observable<MovimientoInventarioCreateResponse> { return this.http.post<MovimientoInventarioCreateResponse>(`${this.url}/productos/${idProducto}/movimientos`, request); }
    getMovimientos(query: MovimientoInventarioListQuery): Observable<MovimientoInventarioPagedResponse> {
        let params = new HttpParams().set('pageNumber', query.pageNumber).set('pageSize', query.pageSize);
        if (query.idProducto != null) params = params.set('idProducto', query.idProducto);
        if (query.idTipoMovimiento != null) params = params.set('idTipoMovimiento', query.idTipoMovimiento);
        if (query.fechaInicio) params = params.set('fechaInicio', query.fechaInicio);
        if (query.fechaFin) params = params.set('fechaFin', query.fechaFin);
        return this.http.get<MovimientoInventarioPagedResponse>(`${this.url}/movimientos`, { params });
    }

    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/Inventario`; }
}
