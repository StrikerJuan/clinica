import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { Cliente } from '../../../../services/cliente';

@Component({
  selector: 'app-form-historia-general',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, 
    MatButtonModule, MatCheckboxModule, MatDividerModule
  ],
  templateUrl: './historia-general.html',
  styleUrl: './historia-general.css',
})
export class HistoriaGeneralComponent implements OnInit {
  @Input()  cliente!: Cliente | null;
  @Output() onGuardar  = new EventEmitter<any>();
  @Output() onCancelar = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      // Higiene
      dolor_dental:       [''],
      cepillado_veces:    [''],
      hilo_dental:        [false],
      enjuague:           [false],
      pasta_dental:       [''],
      tratamiento_medico: [''],
      alergias:           [''],
      // Antecedentes hereditarios
      ah_diabetes:        [''],
      ah_cardiopatias:    [''],
      ah_tuberculosis:    [''],
      ah_hemofilia:       [''],
      ah_hipertension:    [''],
      ah_cancer:          [''],
      ah_alergias:        [''],
      ah_epilepsia:       [''],
      ah_otras:           [''],
      // Antecedentes patológicos (SI/NO)
      ap_diabetes:        [false], ap_infarto:         [false], ap_transfusiones:   [false],
      ap_hepatitis:       [false], ap_nefropatias:     [false], ap_artritis:        [false],
      ap_hipertension:    [false], ap_acv:             [false], ap_nerviosismo:     [false],
      ap_cardiovascular:  [false], ap_anemia:          [false], ap_obs:             [''],
      ap_asma:            [false], ap_adicciones:      [false],
      ap_alergias:        [false], ap_ets:             [false],
      ap_hemofilia:       [false], ap_quirurgicos:     [false],
      ap_epilepsia:       [false], ap_traumaticos:     [false],
      // Odontograma
      sarro:              [false],
      enf_periodontal:    [false],
      diagnostico:        [''],
      plan_tratamiento:   [''],
      observaciones:      [''],
      // Motivo
      motivo_consulta:    [''],
    });
  }

  guardar(): void {
    this.onGuardar.emit({
      ...this.form.value,
      paciente_nombre:    `${this.cliente?.cli_nombre} ${this.cliente?.cli_apellido_pat} ${this.cliente?.cli_apellido_mat || ''}`.trim(),
      paciente_telefono:  this.cliente?.cli_telefono || '',
      paciente_direccion: this.cliente?.cli_direccion || '',
    });
  }
}
