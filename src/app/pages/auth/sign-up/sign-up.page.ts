import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FirebaseService} from "../../../services/firebase.service";
import {UtilsService} from "../../../services/utils.service";
import {User} from "../../../models/user.model";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required]),
  })
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  ngOnInit() {}
  async submit(){
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading()
      await loading.present();
      this.firebaseSvc.signUp(this.form.value as User).then(async res => {
        await this.firebaseSvc.updateUser(this.form.value.name)
        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid);
        await this.setUserInfo(uid);

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

  async setUserInfo(uid:string){
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading()
      await loading.present();
      let path = `users/${uid}`;
      delete this.form.value.password;
      this.firebaseSvc.setDocument(path, this.form.value).then(async res => {
        this.utilsSvc.saveInLocalStorage('user', this.form.value);
        await this.utilsSvc.routerLink('/main/home');
        this.form.reset();
      }).catch(err => {
        this.utilsSvc.presentToast({
          message: err.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        })
        console.log(err);
      }).finally(() => {
        loading.dismiss();

      })
    }
  }
}
