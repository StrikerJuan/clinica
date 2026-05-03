import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
	cli_id?: number;
	cli_nombre: string;
	cli_apellido_pat: string;
	cli_apellido_mat?: string;
	cli_telefono?: string;
	cli_correo?: string;
	cli_direccion?: string;
	cli_responsable?: number | null;
	responsable_nombre?: string;
	menores?: any[];
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
	private api = 'http://localhost:8000/api';

	constructor(private http: HttpClient) { }

	getClientes(): Observable<Cliente[]> {
		return this.http.get<Cliente[]>(`${this.api}/clientes/`);
	}

	getCliente(id: number): Observable<Cliente> {
		return this.http.get<Cliente>(`${this.api}/clientes/${id}/`);
	}

	crearCliente(cliente: Cliente): Observable<Cliente> {
		return this.http.post<Cliente>(`${this.api}/clientes/`, cliente);
	}

	editarCliente(id: number, cliente: Cliente): Observable<Cliente> {
		return this.http.put<Cliente>(`${this.api}/clientes/${id}/`, cliente);
	}

	eliminarCliente(id: number): Observable<void> {
		return this.http.delete<void>(`${this.api}/clientes/${id}/`);
	}
}