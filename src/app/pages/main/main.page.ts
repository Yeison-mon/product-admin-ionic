import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FirebaseService} from "../../services/firebase.service";
import {UtilsService} from "../../services/utils.service";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    { title: 'Inicio', url: '/main/home', icon: 'home-outline' },
    { title: 'Perfil', url: '/main/profile', icon: 'person-outline' },
  ]
  router = inject(Router)
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  currentPath: string = '';
  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    })
  }
  signOut(){
    this.firebaseSvc.signOut();
  }
  user():User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

}
