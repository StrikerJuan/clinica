import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { ExpedienteService, Expediente, TIPOS_DOCUMENTO } from '../../../services/expediente';
import { ClienteService, Cliente } from '../../../services/cliente';
import { FormComponent } from '../form/form';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expedientes-list',
  standalone: true,
  imports: [
    MatTableModule, MatButtonModule, MatIconModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTooltipModule, MatProgressSpinnerModule, FormsModule, DatePipe
  ],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class ExpedientesListComponent implements OnInit {
  expedientes: Expediente[] = [];
  clientes:    Cliente[]    = [];
  loading      = true;
  clienteFiltro: number | null = null;
  columnas = ['fecha', 'paciente', 'tipo', 'acciones'];

  constructor(
    private expService:     ExpedienteService,
    private clienteService: ClienteService,
    private dialog:         MatDialog,
    private cdr:            ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe(data => {
      this.clientes = data;
      this.cdr.detectChanges();
    });
    this.cargarExpedientes();
  }

  cargarExpedientes(): void {
    this.loading = true;
    this.expService.getExpedientes(this.clienteFiltro ?? undefined).subscribe({
      next: data => {
        this.expedientes = data;
        this.loading     = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  abrirFormulario(): void {
    const ref = this.dialog.open(FormComponent, {
      width:     '780px',
      maxWidth:  '98vw',
      maxHeight: '95vh',
      data:      { clientes: this.clientes },
      panelClass: 'clinica-dialog',
    });
    ref.afterClosed().subscribe(ok => { if (ok) this.cargarExpedientes(); });
  }

  verPdf(exp: Expediente): void {
    // Se implementa en el siguiente paso
    console.log('Ver PDF de expediente:', exp.expcli_id);
  }
}
