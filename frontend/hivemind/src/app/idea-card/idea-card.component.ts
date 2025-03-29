import { Component, inject, Input, OnInit } from '@angular/core';
import { IdeaType } from '../_services/rest-backend/idea.type';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth/auth.service';
import { VoteType } from '../_services/rest-backend/vote.type';
import { Router } from '@angular/router';
import { UserType } from '../_services/rest-backend/login-response.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-idea-card',
  imports: [CommonModule],
  templateUrl: './idea-card.component.html',
  styleUrl: './idea-card.component.scss'
})
export class IdeaCardComponent implements OnInit {
  @Input() idea: IdeaType = { id: 0, title: 'New idea', description: 'this is a new idea', UserId: 0 };
  @Input() userVotes: VoteType[] = [];

  restBackend = inject(RestBackendService);
  toastr = inject(ToastrService);
  authService = inject(AuthService);
  router = inject(Router);

  currentUser: UserType | null = null; // Variabile per il current user
  isVoting: boolean = false; // Stato per prevenire clic multipli

  ngOnInit() {
    // Recupera il currentUser da localStorage
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      this.currentUser = JSON.parse(currentUserString);
    } else {
      console.warn('No current user found in localStorage');
    }
  }

  isCreator(): boolean {
    return this.currentUser?.id === this.idea.UserId;
  }

  getUserVote(): VoteType | undefined {
    return this.userVotes.find(vote => vote.IdeaId === this.idea.id);
  }

  upvote() {
    if (this.idea.id !== undefined && this.currentUser && !this.isVoting) {
      this.isVoting = true; // Disabilita ulteriori clic
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
          this.isVoting = false; // Riabilita i clic
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
          },
          complete: () => {
            this.isVoting = false; // Riabilita i clic
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
          },
          complete: () => {
            this.isVoting = false; // Riabilita i clic
          }
        });
      }
    } else if (!this.currentUser) {
      this.toastr.error('You must be logged in to vote');
    }
  }

  downvote() {
    if (this.idea.id !== undefined && this.currentUser && !this.isVoting) {
      this.isVoting = true; // Disabilita ulteriori clic
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
          this.isVoting = false; // Riabilita i clic
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
          },
          complete: () => {
            this.isVoting = false; // Riabilita i clic
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
          },
          complete: () => {
            this.isVoting = false; // Riabilita i clic
          }
        });
      }
    } else if (!this.currentUser) {
      this.toastr.error('You must be logged in to vote');
    }
  }

  viewDetails() {
    if (this.idea.id !== undefined) {
      this.router.navigate(['/idea', this.idea.id]);
    }
  }
}
