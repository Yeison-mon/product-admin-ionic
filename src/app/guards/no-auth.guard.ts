import { inject } from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree} from "@angular/router";
import { Observable } from "rxjs";
import { FirebaseService } from "../services/firebase.service";
import { UtilsService } from "../services/utils.service";

export const noAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const firebaseSvc = inject(FirebaseService);
  const utilsSvc = inject(UtilsService);
  let user = localStorage.getItem("user");
  return new Promise((resolve) => {
    firebaseSvc.getAuth().onAuthStateChanged((auth) => {
      if (!auth) {
        resolve(true);
      } else {
        utilsSvc.routerLink('/main/home');
        resolve(false);
      }
    });
  });
};
