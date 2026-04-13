import { Injectable, OnDestroy, inject } from '@angular/core';
import { AuthServicesService } from '../routes/services/auth-services.service';

declare const alertify: any;

@Injectable({
  providedIn: 'root',
})
export class AutoReloadService implements OnDestroy {
  private timeout: any;
  private authService = inject(AuthServicesService); // ← agregar esto

  startWatching() {
    const fechaInicio = localStorage.getItem('fecha_inicio');
    if (!fechaInicio) return;

    const loginTime = new Date(fechaInicio);
    const targetTime = new Date(loginTime.getTime() + 1 * 60 * 1000);
    const msRestantes = targetTime.getTime() - new Date().getTime();

    console.log('loginTime:', loginTime);
    console.log('msRestantes (seg):', msRestantes / 1000);

    if (msRestantes <= 0) {
      // Ya expiró, refrescar inmediatamente
      this.doRefresh();
      return;
    }

    this.timeout = setTimeout(() => {
      this.doRefresh(); // ← llamar refresh en lugar de solo alertar
    }, msRestantes);
  }

  private doRefresh() {
    this.authService.refreshToken().subscribe({
      next: (res) => {
        alertify.success('Token renovado correctamente');

        // Reiniciar el watcher para el próximo ciclo
        const ahora = new Date().toISOString();
        localStorage.setItem('fecha_inicio', ahora);
        this.startWatching();
      },
      error: (err) => {
        alertify.error('Sesión expirada, inicia sesión nuevamente');
        // Aquí puedes redirigir al login
        // this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    clearTimeout(this.timeout);
  }
}