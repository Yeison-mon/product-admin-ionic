import {inject, Injectable} from '@angular/core';
import {ApiService} from "../api.service";
import {UtilsService} from "../utils.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  laravel = inject(ApiService);
  utilsSvc = inject(UtilsService);
  inicioSesion(data: any) {
    return this.laravel.postData("seguridad/iniciosesion", data); // Retorna el Observable
  }

  signOut(){
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }
}
