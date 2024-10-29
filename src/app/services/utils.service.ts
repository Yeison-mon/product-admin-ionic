import {inject, Injectable} from '@angular/core';
import {
  AlertController, AlertOptions,
  LoadingController,
  ModalController,
  ModalOptions,
  ToastController,
  ToastOptions
} from "@ionic/angular";
import {Router} from "@angular/router";
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);
  modalCtrl = inject(ModalController);
  alertCtrl = inject(AlertController);

  // ====== Alert ====== //
  async presentAlert(opts?:AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present(); // Esto muestra el alert en pantalla
    return alert;
  }
  // ====== Loading ====== //
  loading(){
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  // ====== Toast ===== //
  async presentToast(opts:ToastOptions){
    const toast = await this.toastCtrl.create(opts);
    await toast.present();
  }
  // ===== Enrutar a cualquier página ====== //
  routerLink(url:string){
    return this.router.navigateByUrl(url);
  }

  // ===== Guardar elemento en LocalStorage ====== //
  saveInLocalStorage(key:string, value:any){
    return localStorage.setItem(key, JSON.stringify(value));
  }
  // ====== Obtener de LocalStorage ====== //
  getFromLocalStorage(key:string){
    return JSON.parse(localStorage.getItem(key));
  }

  // ===== Modal ===== //
  async presentModal(opts:ModalOptions){
    const modal = await this.modalCtrl.create(opts)
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data){
      return data;
    }
  }
  dismissModal(data?:any){
    return this.modalCtrl.dismiss(data);
  }
  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto : 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto'
  });
  };
}
