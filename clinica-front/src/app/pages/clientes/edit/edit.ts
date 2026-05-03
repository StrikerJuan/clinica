import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ClienteService, Cliente } from '../../../services/cliente';

@Component({
	selector: 'app-clientes-edit',
	standalone: true,
	imports: [
		ReactiveFormsModule, MatDialogModule, MatButtonModule,
		MatInputModule, MatFormFieldModule, MatSelectModule, MatIconModule,
	],
	templateUrl: './edit.html',
	styleUrl: './edit.css',
})
export class ClienteEditComponent implements OnInit {

	form!: FormGroup;
	guardando = false;
	esEdicion = false;

	// Lista de clientes adultos para asignar como responsable
	adultos: Cliente[] = [];

	constructor(
		private fb: FormBuilder,
		private clienteService: ClienteService,
		private dialogRef: MatDialogRef<ClienteEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { cliente: Cliente | null, clientes: Cliente[] }
	) { }

	ngOnInit(): void {
		const c = this.data.cliente;
		this.esEdicion = !!c;

		// Filtra para no mostrar el mismo cliente como responsable
		this.adultos = this.data.clientes.filter(
			cl => cl.cli_id !== c?.cli_id
		);

		this.form = this.fb.group({
			cli_nombre: [c?.cli_nombre ?? '', Validators.required],
			cli_apellido_pat: [c?.cli_apellido_pat ?? '', Validators.required],
			cli_apellido_mat: [c?.cli_apellido_mat ?? ''],
			cli_telefono: [c?.cli_telefono ?? ''],
			cli_correo: [c?.cli_correo ?? '', Validators.email],
			cli_direccion: [c?.cli_direccion ?? ''],
			cli_responsable: [c?.cli_responsable ?? null],
		});
	}

	guardar(): void {
		if (this.form.invalid) return;

		this.guardando = true;
		const datos = this.form.value;

		const operacion = this.esEdicion
			? this.clienteService.editarCliente(this.data.cliente!.cli_id!, datos)
			: this.clienteService.crearCliente(datos);

		operacion.subscribe({
			next: () => {
				this.guardando = false;
				this.dialogRef.close(true);
			},
			error: () => this.guardando = false
		});
	}

	cancelar(): void {
		this.dialogRef.close(false);
	}
}