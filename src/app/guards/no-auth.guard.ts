import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UtilsService } from "../services/utils.service";

export const noAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const utilsSvc = inject(UtilsService);
  const router = inject(Router);
  const user = localStorage.getItem("user");
  if (!user) {
    return true;
  } else {
    utilsSvc.presentToast({
      message: 'Ya has iniciado sesión.',
      duration: 1500,
      color: 'primary',
      position: 'middle',
      icon: 'checkmark-circle-outline',
    });
    return router.createUrlTree(['/main/home']);
  }
};
