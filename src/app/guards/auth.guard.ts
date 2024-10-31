import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UtilsService } from "../services/utils.service";

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const utilsSvc = inject(UtilsService);
  const router = inject(Router);

  // Verificar si el usuario está en localStorage
  const user = localStorage.getItem("user");

  if (user) {
    // Usuario autenticado, permite el acceso
    return true;
  } else {
    // Usuario no autenticado, redirigir a la página de inicio de sesión
    utilsSvc.presentToast({
      message: 'Por favor inicia sesión para continuar.',
      duration: 1500,
      color: 'warning',
      position: 'middle',
      icon: 'alert-circle-outline',
    });
    return router.createUrlTree(['/auth']);
  }
};
