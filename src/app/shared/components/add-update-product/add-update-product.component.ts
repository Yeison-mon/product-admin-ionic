import {Component, inject, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FirebaseService} from "../../../services/firebase.service";
import {UtilsService} from "../../../services/utils.service";
import {User} from "../../../models/user.model";
import {Product} from "../../../models/product.model";

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {
  @Input() product: Product;
  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]),
  })
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user = {} as User;
  // ======= String a Números =========== //
  setNumberInputs(){
    let { soldUnits, price } = this.form.controls
    if (soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value));
    if (price.value) price.setValue(parseFloat(price.value));
  }
  // ---- Tomar/Seleccionar Imagen ------- //
  async takeImage(){
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }
  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user')
    if (this.product) {
      this.form.setValue(this.product)
    }
  }
  async submit(){
    if (this.form.valid) {
      if (this.product) await this.updateProduct();
      else await this.createProduct();
    }
  }
  // ===== Crear Productos ========= //
  async createProduct(){

    let path = `users/${this.user.id}/products`
    const loading = await this.utilsSvc.loading()
    await loading.present();
    // ========= Subir Imagen y obtener la url ========= //
    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.id}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.upLoadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);
    delete this.form.controls.id;
    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {
      await this.utilsSvc.dismissModal({ success: true });
      await this.utilsSvc.presentToast({
        message: 'Producto creado exitosamente',
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
  // ===== Actualizar Productos ========= //
  async updateProduct(){

    let path:string = `users/${this.user.id}/products/${this.product.id}`
    const loading = await this.utilsSvc.loading()
    await loading.present();
    if (this.form.value.image !== this.product.image) {
      // ========= Subir Imagen y obtener la url ========= //
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      let imageUrl = await this.firebaseSvc.upLoadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }
    delete this.form.controls.id;
    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {
      await this.utilsSvc.dismissModal({ success: true });
      await this.utilsSvc.presentToast({
        message: 'Producto actualizado exitosamente',
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
