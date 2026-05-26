import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { Cliente } from '../../../services/cliente';
import { ExpedienteService, TIPOS_DOCUMENTO } from '../../../services/expediente';
import { PdfService } from '../../../services/pdf';
import { HistoriaGeneralComponent } from '../forms/historia-general/historia-general';
import { HistoriaDentalComponent } from '../forms/historia-dental/historia-dental';


@Component({
  selector: 'app-expedientes-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatSelectModule,
    MatIconModule, MatCheckboxModule, MatDividerModule, MatStepperModule,
    HistoriaGeneralComponent, HistoriaDentalComponent
  ],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class FormComponent implements OnInit {
  tiposDocs   = TIPOS_DOCUMENTO;
  tipoSel     = '';
  clienteSel: Cliente | null = null;
  form!:       FormGroup;
  guardando   = false;

  constructor(
    private fb:          FormBuilder,
    private expService:  ExpedienteService,
    private pdfService:  PdfService,
    private dialogRef:   MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { clientes: Cliente[] }
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({ tipo: ['', Validators.required], cliente: ['', Validators.required] });
  }

  get tipoActual(): string { return this.form.get('tipo')?.value || ''; }

  seleccionarCliente(id: number): void {
    this.clienteSel = this.data.clientes.find(c => c.cli_id === id) || null;
  }

  buildFormData(): any {
    // Cada sub-formulario retorna sus propios datos
    return {};
  }

  guardarYPdf(datosFormulario: any): void {
    if (!this.clienteSel) return;
    this.guardando = true;

    const expediente = {
      expcli_cliente: this.clienteSel.cli_id!,
      expcli_tipo:    this.tipoActual,
      expcli_datos:   datosFormulario,
    };

    this.expService.crearExpediente(expediente).subscribe({
      next: (exp) => {
        this.pdfService.generar(this.tipoActual, datosFormulario, this.clienteSel!);
        this.guardando = false;
        this.dialogRef.close(true);
      },
      error: () => { this.guardando = false; }
    });
  }

  cancelar(): void { this.dialogRef.close(false); }
}
