import { Component, inject, Input } from '@angular/core';
import { IdeaType } from '../_services/rest-backend/idea.type';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth/auth.service';
import { VoteRequest } from '../_services/rest-backend/vote-request.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-idea-card',
  imports: [],
  templateUrl: './idea-card.component.html',
  styleUrl: './idea-card.component.scss'
})
export class IdeaCardComponent {
  @Input() idea: IdeaType = {id : 0, title: 'New idea', description: 'this is a new idea', UserId: 0};
  
  restBackend = inject(RestBackendService);
  toastr = inject(ToastrService);
  authService = inject(AuthService);
  router = inject(Router);

  upvote() {
    if(this.idea.id !== undefined){
      const request : VoteRequest = {
        IdeaId: this.idea.id,
        UserId: this.restBackend.currentUser?.id ?? 0,
        vote: 1
      }
      this.restBackend.voteIdea(request).subscribe({
        next: (data) => {
          this.toastr.success('Idea upvoted');
        },
        error: (err) => {
          this.toastr.error('Error upvoting idea');
        }
      });
    }
  }


  downvote() {
    if(this.idea.id !== undefined){
      const request : VoteRequest = {
        IdeaId: this.idea.id,
        UserId: this.restBackend.currentUser?.id ?? 0,
        vote: -1
      }
      this.restBackend.voteIdea(request).subscribe({
        next: (data) => {
          this.toastr.success('Idea downvoted');
        },
        error: (err) => {
          this.toastr.error('Error downvoting idea');
        }
      });
    }
  }
  viewDetails(){
    if(this.idea.id !== undefined){
      this.router.navigate(['/idea', this.idea.id]);
    }
  }
}
