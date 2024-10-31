import {Component, inject} from '@angular/core';
import {UtilsService} from "../../../services/utils.service";
import {FirebaseService} from "../../../services/firebase.service";
import {User} from "../../../models/user.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage  {

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  user():User{
    return this.utilsSvc.getFromLocalStorage('user')
  }
  // ====== Tomar una foto ======== //
  async takeImage(){
    let user = this.user();
    const dataUrl = (await this.utilsSvc.takePicture('Foto de Perfil')).dataUrl;
    let imagePath = `${user.id}/profile`;
    user.image = await this.firebaseSvc.upLoadImage(imagePath, dataUrl);
    let path:string = `users/${user.id}`
    const loading = await this.utilsSvc.loading()
    await loading.present();
    this.firebaseSvc.updateDocument(path, {image : user.image}).then(async res => {
      this.utilsSvc.saveInLocalStorage('user', user)
      await this.utilsSvc.presentToast({
        message: 'Foto de perfil actualizada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      })

    }).catch(err => {
      this.utilsSvc.presentToast({
        message: err.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      })
    }).finally(() => {
      loading.dismiss();

    })
  }


}
