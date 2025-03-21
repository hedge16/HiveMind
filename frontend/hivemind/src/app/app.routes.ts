import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { authorizationGuard } from './_guards/authorization/authorization.guard';
import { LogoutComponent } from './logout/logout.component';
import { CreateIdeaPageComponent } from './create-idea-page/create-idea-page.component';


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
    },
    {
        path: 'logout',
        title: 'Logout',
        component: LogoutComponent
    },
    {
        path: 'create-idea',
        title: 'Create Idea',
        component: CreateIdeaPageComponent,
    }
];
