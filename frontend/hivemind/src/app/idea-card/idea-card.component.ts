import { Component, inject, Input, OnInit } from '@angular/core';
import { IdeaType } from '../_services/rest-backend/idea.type';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth/auth.service';
import { VoteRequest } from '../_services/rest-backend/vote-request.type';
import { Router } from '@angular/router';
import { UserType } from '../_services/rest-backend/login-response.type';

@Component({
  selector: 'app-idea-card',
  imports: [],
  templateUrl: './idea-card.component.html',
  styleUrl: './idea-card.component.scss'
})
export class IdeaCardComponent implements OnInit {
  @Input() idea: IdeaType = { id: 0, title: 'New idea', description: 'this is a new idea', UserId: 0 };

  restBackend = inject(RestBackendService);
  toastr = inject(ToastrService);
  authService = inject(AuthService);
  router = inject(Router);

  currentUser: UserType | null = null; // Variabile per il current user

  ngOnInit() {
    // Recupera il currentUser da localStorage
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      this.currentUser = JSON.parse(currentUserString);
      console.log('Current user loaded:', this.currentUser); // Debugging log
    } else {
      console.warn('No current user found in localStorage');
    }
  }

  isCreator(): boolean {
    return this.currentUser?.id === this.idea.UserId;
  }

  upvote() {
    if (this.idea.id !== undefined && this.currentUser) {
      const request: VoteRequest = {
        IdeaId: this.idea.id,
        UserId: this.currentUser.id,
        vote: 1
      };
      this.restBackend.voteIdea(request).subscribe({
        next: (data) => {
          this.toastr.success('Idea upvoted');
          this.idea.totalUpvotes = (this.idea.totalUpvotes ?? 0) + 1;
        },
        error: (err) => {
          this.toastr.error('Error upvoting idea');
        }
      });
    } else {
      this.toastr.error('You must be logged in to vote');
    }
  }

  downvote() {
    if (this.idea.id !== undefined && this.currentUser) {
      const request: VoteRequest = {
        IdeaId: this.idea.id,
        UserId: this.currentUser.id,
        vote: -1
      };
      this.restBackend.voteIdea(request).subscribe({
        next: (data) => {
          this.toastr.success('Idea downvoted');
          this.idea.totalDownvotes = (this.idea.totalDownvotes ?? 0) + 1;
        },
        error: (err) => {
          this.toastr.error('Error downvoting idea');
        }
      });
    } else {
      this.toastr.error('You must be logged in to vote');
    }
  }

  viewDetails() {
    if (this.idea.id !== undefined) {
      this.router.navigate(['/idea', this.idea.id]);
    }
  }
}
