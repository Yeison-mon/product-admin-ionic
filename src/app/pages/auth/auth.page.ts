import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UtilsService } from "../../services/utils.service";
import { LoginService } from "../../services/seguridad/login.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {

  form = new FormGroup({
    nomusu: new FormControl('', [Validators.required]),
    clave: new FormControl('', [Validators.required]),
  });

  utilsSvc = inject(UtilsService);
  seguridadSvc = inject(LoginService);

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.seguridadSvc.inicioSesion(this.form.value).subscribe({
        next: (res) => {
          console.log('Inicio de sesión exitoso:', res);

          // Guardar datos del usuario en localStorage
          const user = res[0]; // Aquí se asume que la respuesta es un array y que el primer objeto es el usuario
          this.utilsSvc.saveInLocalStorage('user', user);

          // Redirigir y mostrar el mensaje de bienvenida
          this.utilsSvc.routerLink('/main/home');
          this.form.reset();
          this.utilsSvc.presentToast({
            message: `Bienvenido: ${user.nombrecompleto}`,
            duration: 1500,
            color: 'primary',
            position: 'middle',
            icon: 'person-circle-outline',
          });
        },
        error: (err) => {
          console.error('Error de inicio de sesión:', err);
          this.utilsSvc.presentToast({
            message: err.message,
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        },
        complete: () => {
          loading.dismiss();
        }
      });
    }
  }
}
