import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
	const authService = inject(Auth);
	const router = inject(Router);

	// Adjunta el token a la petición
	const reqWithToken = addToken(req, authService.getToken());

	return next(reqWithToken).pipe(
		catchError((error: HttpErrorResponse) => {

			// Si el token expiró, intenta renovarlo
			if (error.status === 401 && authService.getRefreshToken()) {
				return authService.refreshToken().pipe(
					switchMap(tokens => {
						// Reintenta la petición original con el nuevo token
						return next(addToken(req, tokens.access));
					}),
					catchError(refreshError => {
						// Si el refresh también falla, cierra sesión
						authService.logout();
						router.navigate(['/login']);
						return throwError(() => refreshError);
					})
				);
			}

			return throwError(() => error);
		})
	);
};

function addToken(req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
	if (!token) return req;
	return req.clone({
		setHeaders: { Authorization: `Bearer ${token}` }
	});
}