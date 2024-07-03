import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoadingComponent } from './components/general/loading/loading.component';

const routes: Routes = [

  {path: ':language?',      component: HomeComponent},
  
  // {path: 'profile'        ,   component: ProfileComponent         , canActivate: [AuthGuard]},
  // {path: 'users'          ,   component: UsersComponent           , canActivate: [AuthGuard]},
  // {path: 'register-user'  ,   component: RegisterUserComponent    , canActivate: [AuthGuard]},

  {path: '**', pathMatch: 'full', redirectTo: '/'},
  {path: 'loading'  ,   component: LoadingComponent},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
