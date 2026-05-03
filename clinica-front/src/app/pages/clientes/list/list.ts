import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ClienteService, Cliente } from '../../../services/cliente';
import { ClienteEditComponent } from '../edit/edit';

@Component({
	selector: 'app-clientes-list',
	standalone: true,
	imports: [
		MatTableModule, MatButtonModule, MatIconModule,
		MatDialogModule, MatTooltipModule, MatProgressSpinnerModule,
		MatInputModule, MatFormFieldModule, FormsModule,
	],
	templateUrl: './list.html',
	styleUrl: './list.css',
})
export class ClienteListComponent implements OnInit {

	clientes: Cliente[] = [];
	clientesFiltrados: Cliente[] = [];
	loading = true;
	busqueda = '';

	columnas = ['nombre', 'telefono', 'correo', 'responsable', 'acciones'];

	constructor(
		private clienteService: ClienteService,
		private dialog: MatDialog,
		private cdr: ChangeDetectorRef,
	) { }

	ngOnInit(): void {
		this.cargarClientes();
	}

	cargarClientes(): void {
		this.loading = true;
		this.clienteService.getClientes().subscribe({
			next: (data) => {
				this.clientes = data;
				this.clientesFiltrados = data;
				this.loading = false;
				this.cdr.detectChanges();
			},
			error: () => {
				this.loading = false;
				this.cdr.detectChanges();
			}
		});
	}

	filtrar(): void {
		const q = this.busqueda.toLowerCase();
		this.clientesFiltrados = this.clientes.filter(c =>
			`${c.cli_nombre} ${c.cli_apellido_pat} ${c.cli_apellido_mat ?? ''}`
				.toLowerCase().includes(q) ||
			(c.cli_telefono ?? '').includes(q) ||
			(c.cli_correo ?? '').toLowerCase().includes(q)
		);
	}

	abrirModal(cliente?: Cliente): void {
		const ref = this.dialog.open(ClienteEditComponent, {
			width: '560px',
			maxWidth: '95vw',
			data: { cliente: cliente ?? null, clientes: this.clientes },
			panelClass: 'clinica-dialog',
		});

		ref.afterClosed().subscribe(resultado => {
			if (resultado) this.cargarClientes();
		});
	}

	eliminar(cliente: Cliente): void {
		if (!confirm(`¿Eliminar a ${cliente.cli_nombre} ${cliente.cli_apellido_pat}?`)) return;
		this.clienteService.eliminarCliente(cliente.cli_id!).subscribe({
			next: () => this.cargarClientes()
		});
	}
}