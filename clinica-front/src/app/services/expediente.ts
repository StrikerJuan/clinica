import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const TIPOS_DOCUMENTO = [
  { value: 'historia_general', label: 'Historia Clínica General'           },
  { value: 'historia_dental',  label: 'Historia Clínica Dental'            },
  { value: 'consent_extrac',   label: 'Consentimiento - Extracción'        },
  { value: 'consent_operatoria', label: 'Consentimiento - Operatoria Dental'},
  { value: 'consent_ortodoncia', label: 'Consentimiento - Ortodoncia'      },
  { value: 'consent_protesis_fija', label: 'Consentimiento - Prótesis Fija'},
  { value: 'consent_protesis_rem',  label: 'Consentimiento - Prótesis Removible'},
  { value: 'consent_aclar',    label: 'Consentimiento - Aclaramiento Dental'},
  { value: 'historia_endod',   label: 'Historia Clínica Endodoncia'        },
  { value: 'consent_endod',    label: 'Consentimiento - Endodoncia'        },
  { value: 'endod_evolucion',  label: 'Endodoncia Evolución'               },
];

export interface Expediente {
  expcli_id?:      number;
  expcli_cliente:  number;
  expcli_tipo:     string;
  expcli_fecha?:   string;
  expcli_datos:    any;
  cliente_nombre?: string;
  tipo_display?:   string;
}

@Injectable({
  providedIn: 'root',
})
export class ExpedienteService {
  private api = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getExpedientes(clienteId?: number): Observable<Expediente[]> {
    const params = clienteId ? `?cliente=${clienteId}` : '';
    return this.http.get<Expediente[]>(`${this.api}/expedientes/${params}`);
  }

  getExpediente(id: number): Observable<Expediente> {
    return this.http.get<Expediente>(`${this.api}/expedientes/${id}/`);
  }

  crearExpediente(exp: Expediente): Observable<Expediente> {
    return this.http.post<Expediente>(`${this.api}/expedientes/`, exp);
  }
}
