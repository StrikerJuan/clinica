import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Modulo {
   mod_id: number;
   mod_nombre: string;
   mod_orden: number;
   mod_icono: string;
}

@Injectable({ providedIn: 'root' })
export class ModuloService {
   private apiUrl = 'http://localhost:8000/api';

   constructor(private http: HttpClient) { }

   getModulos(): Observable<Modulo[]> {
      return this.http.get<Modulo[]>(`${this.apiUrl}/modulos/`);
   }
}