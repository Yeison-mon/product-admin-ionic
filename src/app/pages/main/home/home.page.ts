import {Component, inject, Input, OnInit} from '@angular/core';
import {FirebaseService} from "../../../services/firebase.service";
import {UtilsService} from "../../../services/utils.service";
import {AddUpdateProductComponent} from "../../../shared/components/add-update-product/add-update-product.component";
import {User} from "../../../models/user.model";
import {Product} from "../../../models/product.model";
import { orderBy, where } from "firebase/firestore";
import index from "eslint-plugin-jsdoc";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  products:Product[] = [];
  loading:boolean = false;
  ngOnInit() {}

  // ======== Confirmación ========= //
  async confirmDeleteProduct(product: Product) {
    await this.utilsSvc.presentAlert({
      header: `Eliminar producto`,
      message: `Esta seguro que desea eliminar este producto: ${product.name}?`,
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteProduct(product);
          }
        }
      ]
    })
  }
  // ========= Datos del Usuario =========== //
  user():User{
    return this.utilsSvc.getFromLocalStorage('user')
  }
  // ========= Obtener Productos =========== //
  ionViewWillEnter(){
    this.getProducts();
  }
  doRefresh(event){
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000)
  }

  getProfits(){
    return this.products.reduce((index, product) => index + product.price * product.soldUnits, 0);
  }
  getProducts(){
    let path = `users/${this.user().uid}/products`
    let query = [
      //where('soldUnits', '>', 30),
      orderBy('soldUnits', 'desc')]
    this.loading = true
    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next:(res:any)=> {
        this.products = res;
        this.loading = false;
        sub.unsubscribe();
      }
    })
  }
  // ===== Agregar o Actualizar Producto ===== //
  async addUpdateProduct(product?:Product){
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass : 'add-update-modal',
      componentProps: { product },
    })
    if (success) {
      this.getProducts();
    }
  }
  // ===== Eliminar Productos ========= //
  async deleteProduct(product:Product){

    let path:string = `users/${this.user().uid}/products/${product.id}`
    const loading = await this.utilsSvc.loading()
    await loading.present();
    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);
    this.firebaseSvc.deleteDocument(path).then(async res => {
      this.products = this.products.filter(p => p.id !== product.id)
      await this.utilsSvc.presentToast({
        message: 'Producto eliminado exitosamente',
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
