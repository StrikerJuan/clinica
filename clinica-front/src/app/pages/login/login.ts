import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './login.html',
	styleUrl: './login.css',
})
export class Login {
	username = '';
	password = '';
	errorMsg = '';
	loading = false;

	constructor(
		private authService: Auth,
		private router: Router
	) { }

	onLogin(): void {
		if (!this.username || !this.password) {
			this.errorMsg = 'Por favor ingresa usuario y contraseña.';
			return;
		}

		this.loading = true;
		this.errorMsg = '';

		this.authService.login(this.username, this.password).subscribe({
			next: () => {
				this.router.navigate(['/dashboard']); // cambia por tu ruta principal
			},
			error: (err) => {
				this.loading = false;
				this.errorMsg = err.status === 401
					? 'Usuario o contraseña incorrectos.'
					: 'Error al conectar con el servidor.';
			}
		});
	}
}
