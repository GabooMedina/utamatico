import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { FirebaseService } from '../services/firebase.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const firebaseSrv=inject(FirebaseService)
  const utilsSrv=inject(UtilsService)

  let user= localStorage.getItem('user')

  return new Promise((resolve, reject) => {
    firebaseSrv.getAuth().onAuthStateChanged((auth)=>{
      if(!auth){
          resolve(true)

    }else{
      utilsSrv.routerLink('/main/home')
      resolve(false)
    }
    })
  });
  return true;
};
