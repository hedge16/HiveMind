import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-idea-page',
  imports: [ReactiveFormsModule, HeaderComponent, FooterComponent, NavbarComponent],
  templateUrl: './create-idea-page.component.html',
  styleUrl: './create-idea-page.component.scss'
})
export class CreateIdeaPageComponent {
  ideaForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });

  restBackendService = inject(RestBackendService);
  toastr = inject(ToastrService);
  router = inject(Router);

  onSubmit() {
    if (this.ideaForm.invalid) {
      this.toastr.error('The data you provided is invalid!', 'Oops! Invalid data!');
      return;
    }

    // Recupera lo UserId da localStorage
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

    if (!currentUser || !currentUser.id) {
      this.toastr.error('You must be logged in to create an idea!', 'Unauthorized');
      return;
    }

    this.restBackendService.createIdea({
      title: this.ideaForm.value.title as string,
      description: this.ideaForm.value.description as string,
      UserId: Number(currentUser.id) // Usa lo UserId recuperato da localStorage
    }).subscribe({
      next: () => {
        this.toastr.success('Idea created successfully!');
        this.router.navigateByUrl('/home');
      },
      error: () => {
        this.toastr.error('Failed to create idea');
      }
    });
  }
}
