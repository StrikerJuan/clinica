import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Modulo, ModuloService } from '../../services/modulo';
import { Auth } from '../../services/auth';

@Component({
   selector: 'app-dashboard',
   standalone: true,
   imports: [],
   templateUrl: './dashboard.html',
   styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
   modulos: Modulo[] = [];
   loading = true;

   constructor(
      private moduloService: ModuloService,
      private authService: Auth,
      private router: Router,
      private cdr: ChangeDetectorRef
   ) { }

   ngOnInit(): void {
      this.moduloService.getModulos().subscribe({
         next: (data) => {
            console.log('Módulos recibidos:', data);
            this.modulos = data;
            this.loading = false;
            this.cdr.detectChanges(); // ← fuerza actualización de la vista
         },
         error: () => {
            this.loading = false;
            this.cdr.detectChanges();
         }
      });
   }

   logout(): void {
      this.authService.logout();
      this.router.navigate(['/login']);
   }

   irA(modulo: Modulo): void {
      const rutas: Record<string, string> = {
         'Pacientes':   '/pacientes',
         'Citas':       '/citas',
         'Expedientes': '/expedientes',
      };
      const ruta = rutas[modulo.mod_nombre];
      if (ruta) this.router.navigate([ruta]);
   }
}