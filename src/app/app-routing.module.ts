import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PageNotPoundComponent } from './components/page-not-pound/page-not-pound.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { SinginComponent } from './components/singin/singin.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

const routes: Routes = [
  { path: 'product', component: ProductDetailComponent},
  { path: 'user', component: UserDetailComponent},
  { path: 'singin', component: SinginComponent},
  { path: 'login', component: LoginComponent},

  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', component: PageNotPoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
