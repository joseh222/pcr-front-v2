import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { InventarioProducto, MovimientoInventarioCreateRequest, MovimientoInventarioCreateResponse, MovimientoInventarioListQuery, MovimientoInventarioPagedResponse, TipoMovimientoInventario } from './models/inventario.models';
import { ProductoListQuery, ProductoPagedResponse } from '../../productos/data-access/models/producto-read.models';

@Injectable({ providedIn: 'root' })
export class InventarioApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getTiposMovimiento(): Observable<readonly TipoMovimientoInventario[]> { return this.http.get<readonly TipoMovimientoInventario[]>(`${this.url}/tipos-movimiento`); }
    getTiposMovimientoHistorial(): Observable<readonly TipoMovimientoInventario[]> { return this.http.get<readonly TipoMovimientoInventario[]>(`${this.url}/tipos-movimiento/historial`); }
    getProductos(query: ProductoListQuery): Observable<ProductoPagedResponse> {
        let params = new HttpParams().set('pageNumber', query.pageNumber).set('pageSize', query.pageSize);
        if (query.search?.trim()) params = params.set('search', query.search.trim());
        if (query.idCategoriaProducto != null) params = params.set('idCategoriaProducto', query.idCategoriaProducto);
        if (query.idMarcaProducto != null) params = params.set('idMarcaProducto', query.idMarcaProducto);
        if (query.isActive != null) params = params.set('isActive', query.isActive);
        return this.http.get<ProductoPagedResponse>(`${this.url}/productos`, { params });
    }
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
