import { Component, inject, Input } from '@angular/core';
import { CommentType } from '../_services/rest-backend/comment.type';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comment-section',
  imports: [CommentCardComponent, ReactiveFormsModule],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.scss'
})
export class CommentSectionComponent {
  @Input() comments: CommentType[] = [];
  @Input() ideaId: number | undefined = undefined;

  restBackendService = inject(RestBackendService);
  toastr = inject(ToastrService);

  commentForm = new FormGroup({
    content: new FormControl('', [Validators.required])
  });

  addComment() {
    if (this.commentForm.invalid) {
      this.toastr.error('The data you provided is invalid!', 'Oops! Invalid data!');
      return;
    }

    // Retrieve currentUser from localStorage
    const currentUserString = localStorage.getItem('currentUser');
    if (!currentUserString) {
      this.toastr.error('You must be logged in to add a comment!', 'Oops! Unauthorized!');
      return;
    }

    const currentUser = JSON.parse(currentUserString);
    const userId = currentUser?.id;

    if (!userId) {
      this.toastr.error('Invalid user information!', 'Oops! Unauthorized!');
      return;
    }

    const comment: CommentType = {
      content: this.commentForm.value.content as string,
      UserId: userId, // Use userId from parsed currentUser
      IdeaId: Number(this.ideaId),
      createdAt: new Date().toISOString(),
      User: {
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        password: currentUser.password
      }
    };

    console.log('Comment payload:', comment);

    this.restBackendService.createComment(comment).subscribe({
      next: () => {
        this.toastr.success('Comment created successfully!');
        this.commentForm.reset(); // Clear the form after success
  
        // Add the new comment to the comments array to update the DOM
        this.comments.unshift(comment);
      },
      error: () => {
        this.toastr.error('Failed to create comment');
      }
    });
  }
}
