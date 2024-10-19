import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './auth/login.component';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectLoggedInToHome),
  },
];
