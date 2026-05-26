import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { Cliente } from '../../../../services/cliente';

@Component({
  selector: 'app-form-historia-dental',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCheckboxModule, MatDividerModule,
  ],
  templateUrl: './historia-dental.html',
  styleUrl: './historia-dental.css',
})
export class HistoriaDentalComponent implements OnInit {
  @Input()  cliente!: Cliente | null;
  @Output() onGuardar  = new EventEmitter<any>();
  @Output() onCancelar = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      // Datos clínicos
      nhc:             [''],
      ocupacion:       [''],
      fecha_nac:       [''],
      edad:            [''],
      sexo:            [''],
      talla:           [''],
      peso:            [''],
      pa:              [''],
      fc:              [''],
      fr:              [''],
      motivo_consulta: [''],
      representante:   [''],

      // Sección I — preguntas 1-6
      p1:  [false], p2:  [false], p2_cual:  [''],
      p3:  [false], p3_cual:  [''],
      p4:  [false], p4_cual:  [''], p4_fecha_medico: [''], p4_fecha_dental: [''],
      p5:  [false], p5_cual:  [''],
      p6:  [false],

      // Sección II — Ha notado (7-17)
      p7:  [false], p8:  [false], p9:  [false], p10: [false],
      p11: [false], p12: [false], p13: [false], p14: [false],
      p15: [false], p16: [false], p17: [false],

      // Sección II cont — Ha notado (18-28)
      p18: [false], p19: [false], p20: [false], p21: [false],
      p22: [false], p23: [false], p24: [false], p25: [false],
      p26: [false], p27: [false], p28: [false],

      // Sección III — Tiene o ha tenido (29-39)
      p29: [false], p30: [false], p31: [false], p32: [false],
      p33: [false], p34: [false], p35: [false], p36: [false],
      p37: [false], p38: [false], p39: [false],

      // Sección III cont (40-50)
      p40: [false], p41: [false], p42: [false], p43: [false],
      p44: [false], p45: [false], p46: [false], p47: [false],
      p48: [false], p49: [false], p50: [false],

      // Sección IV — Tiene o ha tenido (51-60)
      p51: [false], p52: [false], p53: [false], p54: [false],
      p55: [false], p56: [false], p57: [false], p58: [false],
      p59: [false], p60: [false],

      // Sección V — Está tomando (61-64)
      p61: [false], p62: [false], p63: [false], p64: [false],
      medicamentos_extra: [''],

      // Sección solo mujeres (65-66)
      p65: [false], p66: [false],

      // Sección VI — Para todos (67)
      p67: [false], p67_cual: [''],
    });
  }

  guardar(): void {
    this.onGuardar.emit({
      ...this.form.value,
      paciente_nombre:    `${this.cliente?.cli_nombre} ${this.cliente?.cli_apellido_pat} ${this.cliente?.cli_apellido_mat || ''}`.trim(),
      paciente_telefono:  this.cliente?.cli_telefono  || '',
      paciente_direccion: this.cliente?.cli_direccion || '',
    });
  }
}
