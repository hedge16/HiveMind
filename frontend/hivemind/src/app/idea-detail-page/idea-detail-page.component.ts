import { Component, inject, Input } from '@angular/core';
import { IdeaType } from '../_services/rest-backend/idea.type';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { VoteType } from '../_services/rest-backend/vote.type';
import { CommentSectionComponent } from '../comment-section/comment-section.component';
import { CommentType } from '../_services/rest-backend/comment.type';
import { UserType } from '../_services/rest-backend/login-response.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-idea-detail-page',
  imports: [HeaderComponent, FooterComponent, CommentSectionComponent, CommonModule],
  templateUrl: './idea-detail-page.component.html',
  styleUrl: './idea-detail-page.component.scss'
})
export class IdeaDetailPageComponent {
  idea: IdeaType = { id: 0, title: 'New idea', description: 'this is a new idea', UserId: 0 };
  ideaId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  router = inject(Router);
  restBackend = inject(RestBackendService);
  toastr = inject(ToastrService);

  currentUser: UserType | null = null; // Updated to handle null values
  comments: CommentType[] = [];
  userVotes: VoteType[] = []; // Aggiunto per gestire i voti dell'utente

  ngOnInit() {
    // Retrieve currentUser from localStorage
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      this.currentUser = JSON.parse(currentUserString);
    } else {
      this.toastr.error('You must be logged in to vote on ideas');
      this.router.navigateByUrl('/login'); // Redirect to login if no user is logged in
      return;
    }

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
          this.comments = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        },
        error: () => {
          this.toastr.error('Error loading comments');
        }
      });

      // Fetch user votes
      this.restBackend.getVotesByUserId(this.currentUser?.id ?? 0).subscribe({
        next: (votes) => {
          this.userVotes = votes;
        },
        error: () => {
          this.toastr.error('Error loading user votes');
        }
      });
    } else {
      this.toastr.error('Invalid idea ID');
      this.router.navigateByUrl('/home'); // Redirect to home if the idea ID is invalid
    }
  }

  // Metodo per verificare se l'utente loggato è il creatore dell'idea
  isCreator(): boolean {
    return this.currentUser?.id === this.idea.UserId;
  }

  upvote() {
    if (this.idea.id !== undefined && this.currentUser) {
      const existingVote = this.getUserVote();
      const request: VoteType = {
        IdeaId: this.idea.id,
        UserId: this.currentUser.id,
        vote: 1
      };

      if (existingVote) {
        // Controlla se il voto esistente è già un "Upvote"
        if (existingVote.vote === 1) {
          this.toastr.info('You have already upvoted this idea');
          return;
        }

        // Cambia il voto se l'utente ha già votato ma non è un "Upvote"
        this.restBackend.changeVote(request).subscribe({
          next: () => {
            this.toastr.success('Vote updated successfully');
            if (existingVote.vote === -1) {
              this.idea.totalDownvotes = (this.idea.totalDownvotes ?? 0) - 1;
            }
            this.idea.totalUpvotes = (this.idea.totalUpvotes ?? 0) + 1;
            existingVote.vote = 1; // Aggiorna il voto localmente
          },
          error: () => {
            this.toastr.error('Error updating vote');
          }
        });
      } else {
        // Crea un nuovo voto
        this.restBackend.voteIdea(request).subscribe({
          next: () => {
            this.toastr.success('Idea upvoted');
            this.idea.totalUpvotes = (this.idea.totalUpvotes ?? 0) + 1;
            this.userVotes.push(request); // Aggiungi il nuovo voto localmente
          },
          error: () => {
            this.toastr.error('Error upvoting idea');
          }
        });
      }
    } else {
      this.toastr.error('You must be logged in to vote');
    }
  }

  downvote() {
    if (this.idea.id !== undefined && this.currentUser) {
      const existingVote = this.getUserVote();
      const request: VoteType = {
        IdeaId: this.idea.id,
        UserId: this.currentUser.id,
        vote: -1
      };

      if (existingVote) {
        // Controlla se il voto esistente è già un "Downvote"
        if (existingVote.vote === -1) {
          this.toastr.info('You have already downvoted this idea');
          return;
        }

        // Cambia il voto se l'utente ha già votato ma non è un "Downvote"
        this.restBackend.changeVote(request).subscribe({
          next: () => {
            this.toastr.success('Vote updated successfully');
            if (existingVote.vote === 1) {
              this.idea.totalUpvotes = (this.idea.totalUpvotes ?? 0) - 1;
            }
            this.idea.totalDownvotes = (this.idea.totalDownvotes ?? 0) + 1;
            existingVote.vote = -1; // Aggiorna il voto localmente
          },
          error: () => {
            this.toastr.error('Error updating vote');
          }
        });
      } else {
        // Crea un nuovo voto
        this.restBackend.voteIdea(request).subscribe({
          next: () => {
            this.toastr.success('Idea downvoted');
            this.idea.totalDownvotes = (this.idea.totalDownvotes ?? 0) + 1;
            this.userVotes.push(request); // Aggiungi il nuovo voto localmente
          },
          error: () => {
            this.toastr.error('Error downvoting idea');
          }
        });
      }
    } else {
      this.toastr.error('You must be logged in to vote');
    }
  }

  getUserVote(): VoteType | undefined {
    return this.userVotes.find(vote => vote.IdeaId === this.idea.id);
  }

  goBack() {
    this.router.navigateByUrl('/home');
  }
}