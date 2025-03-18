import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { authorizationGuard } from './_guards/authorization/authorization.guard';


export const routes: Routes = [
    {
        path: 'home',
        title: 'Home',
        component: HomePageComponent,
        canActivate: [authorizationGuard]
    },
    {
        path: 'register',
        title: 'Register',
        component: RegisterPageComponent
    },
    {
        path: 'login',
        title: 'Login',
        component: LoginPageComponent
    },
    {
        path: '',
        title: 'Welcome to Hivemind',
        component: LandingPageComponent
    }
];
