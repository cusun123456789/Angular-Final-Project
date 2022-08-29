import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { NotifierService } from './notifier.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private notifier: NotifierService){

  }
  canActivate(){
    if( this.auth.IsloggedIn()){
      return true;
    }
    this.router.navigate(['/login']);
    this.notifier.showNotification('You not logged in', 'oke', 'error');
    return false;

  }

}
