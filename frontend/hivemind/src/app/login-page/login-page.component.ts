import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators} from '@angular/forms';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { AuthService } from '../_services/auth/auth.service';
import { LoginResponse } from '../_services/rest-backend/login-response.type';

@Component({
  selector: 'app-login-page',
  imports: [NavbarComponent, HeaderComponent, FooterComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]),
  });
  toastr = inject(ToastrService );
  restService = inject(RestBackendService);
  authService = inject(AuthService);
  router = inject(Router);
  submitted = false;

  handleLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.toastr.error("The data you provided is invalid!", "Oops! Invalid data!");
      return; // Esci immediatamente se il modulo non è valido
    }

    this.restService.login({
      email: this.loginForm.value.email as string,
      password: this.loginForm.value.password as string,
    }).subscribe({
      next: (loginResponse: LoginResponse) => {
        // Aggiorna il token e l'utente
        this.authService.updateToken(loginResponse.token);
        this.restService.setUser(loginResponse.user);

        // Mostra un messaggio di successo
        this.toastr.success(`You can now share your ideas`, `Welcome back!`);

        // Naviga immediatamente verso la home
        this.router.navigateByUrl("home");
      },
      error: (err) => {
        // Mostra un messaggio di errore
        this.toastr.error("Please, insert a valid username and password", "Oops! Invalid credentials");
      }
    });
  }
}
