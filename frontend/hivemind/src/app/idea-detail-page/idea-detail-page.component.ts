import { Component, inject, Input } from '@angular/core';
import { IdeaType } from '../_services/rest-backend/idea.type';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { VoteRequest } from '../_services/rest-backend/vote-request.type';
import { CommentSectionComponent } from '../comment-section/comment-section.component';
import { CommentType } from '../_services/rest-backend/comment.type';
import { UserType } from '../_services/rest-backend/login-response.type';

@Component({
  selector: 'app-idea-detail-page',
  imports: [HeaderComponent, FooterComponent, CommentSectionComponent],
  templateUrl: './idea-detail-page.component.html',
  styleUrl: './idea-detail-page.component.scss'
})
export class IdeaDetailPageComponent {
  idea: IdeaType = { id: 0, title: 'New idea', description: 'this is a new idea', UserId: 0 };
  ideaId: string | null = null;

  constructor(private route: ActivatedRoute){

  }

  router = inject(Router);
  restBackend = inject(RestBackendService);
  toastr = inject(ToastrService);

  currentUser: UserType | null = null; // Updated to handle null values
  comments: CommentType[] = [];

  ngOnInit() {

    this.ideaId = this.route.snapshot.paramMap.get('id');

    if (this.ideaId) {
      const numericIdeaId = Number(this.ideaId); // Convert ideaId to a number

      // Fetch idea details
      this.restBackend.getIdeaById(numericIdeaId).subscribe({
        next: (data) => {
          this.idea = data;
        },
        error: () => {
          this.toastr.error('Error loading idea details');
        }
      });

      // Fetch comments for the idea
      this.restBackend.getComments(numericIdeaId).subscribe({
        next: (data) => {
          this.comments = data;
          this.comments = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        },
        error: () => {
          this.toastr.error('Error loading comments');
        }
      });
    } else {
      this.toastr.error('Invalid idea ID');
      this.router.navigateByUrl('/home'); // Redirect to home if the idea ID is invalid
    }
  }

  upvote() {
    if (this.idea.id !== undefined && this.currentUser) {
      const request: VoteRequest = {
        IdeaId: this.idea.id,
        UserId: this.currentUser.id, // Use the current user's ID
        vote: 1
      };
      this.restBackend.voteIdea(request).subscribe({
        next: () => {
          this.toastr.success('Idea upvoted');
        },
        error: () => {
          this.toastr.error('Error upvoting idea');
        }
      });
    }
  }

  downvote() {
    if (this.idea.id !== undefined && this.currentUser) {
      const request: VoteRequest = {
        IdeaId: this.idea.id,
        UserId: this.currentUser.id, // Use the current user's ID
        vote: -1
      };
      this.restBackend.voteIdea(request).subscribe({
        next: () => {
          this.toastr.success('Idea downvoted');
        },
        error: () => {
          this.toastr.error('Error downvoting idea');
        }
      });
    }
  }

  goBack() {
    this.router.navigateByUrl('/home');
  }
}