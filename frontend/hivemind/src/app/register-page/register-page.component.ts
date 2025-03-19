import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';

@Component({
  selector: 'app-register-page',
  imports: [NavbarComponent, HeaderComponent, FooterComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });
  submitted = false;
  toastr = inject(ToastrService);
  restService = inject(RestBackendService);
  router = inject(Router);
  handleSignup() {
    console.log("Signup form submitted");
    this.submitted = true;
    if(this.signupForm.invalid){
      this.toastr.error("The data you provided is invalid!", "Oops! Invalid data!");
    } else {
      this.restService.signup({
        firstName: this.signupForm.value.firstName as string,
        lastName: this.signupForm.value.lastName as string,
        email: this.signupForm.value.email as string,
        password: this.signupForm.value.password as string,
    }).subscribe({
      error: (err) => {
        this.toastr.error("The username you selected was already taken", "Oops! Could not create a new user");
      },
      complete: () => {
        this.toastr.success(`You can now login with your new account`,`Congrats!`);
        this.router.navigateByUrl("/login");
        }
      })
    } 
  }
}
