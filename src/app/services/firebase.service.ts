import {inject, Injectable} from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  user
} from "@angular/fire/auth";
import {User} from "../models/user.model";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import { getFirestore, setDoc, getDoc, doc, addDoc, updateDoc, deleteDoc, collection, collectionData, query } from "@angular/fire/firestore";
import {UtilsService} from "./utils.service";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from "firebase/storage";
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  storage = inject(AngularFireStorage);
  // ====================== Autenticación =========================== //
  getAuth(){
    return getAuth();
  }
  // =========== Iniciar sesión =========== //
  signIn(user:User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }
  // =========== Crear Usuario =========== //
  signUp(user:User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  // =========== Actualizar Usuario =========== //
  updateUser(displayName:string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  // =========== Enviar email para recuperar contraseña =========== //
  sendRecoveryEmail(email:string) {
    return sendPasswordResetEmail(getAuth(), email)
  }

  // ========== Cerrar Sesión ========= //
  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }
  // =============================== Base de datos ============================== //
  // ========== Obtener documentos de una colección ========== //
  getCollectionData(path:string, collectionQuery?:any) {
    const ref = collection(getFirestore(), path)
    return collectionData(query(ref, ...collectionQuery), {idField: 'id'});
  }
  // ========== Setear datos ============== //
  setDocument(path:string, data:any) {
    return setDoc(doc(getFirestore(), path), data);
  }
  // ========== Actualizar documento ============== //
  updateDocument(path:string, data:any) {
    return updateDoc(doc(getFirestore(), path), data);
  }
  // ========== Eliminar documento ============== //
  deleteDocument(path:string) {
    return deleteDoc(doc(getFirestore(), path));
  }
  // ========== Obtener datos ============== //
  async getDocument(path:string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
  // ========== Agregar datos ============== //
  addDocument(path:string, data:any) {
    return addDoc(collection(getFirestore(), path), data);
  }
  // ========================== Almacenamiento ============================= //
  // ========== Subir imagen ============== //
  async upLoadImage(path:string, data_url:string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path));
    });
  }
  // ========== Obtener ruta de la imagen con su url ============== //
  async getFilePath(url:string) {
    return ref(getStorage(), url).fullPath;
  }

  deleteFile(path:string) {
    return deleteObject(ref(getStorage(), path));
  }
}
