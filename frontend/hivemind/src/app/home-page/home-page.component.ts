import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { IdeaCardComponent } from '../idea-card/idea-card.component';
import { IdeaType } from '../_services/rest-backend/idea.type';
import { SortingType } from '../_services/rest-backend/sorting.type';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VoteType } from '../_services/rest-backend/vote.type';

@Component({
  selector: 'app-home-page',
  imports: [NavbarComponent, HeaderComponent, FooterComponent, IdeaCardComponent, FormsModule, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  restBackend = inject(RestBackendService);
  toastr = inject(ToastrService);

  displayedIdeas: IdeaType[] = [];
  selectedSorting: SortingType = 'controversial';
  currentPage: number = 1;
  totalPages: number[] = []; // Array per i numeri di pagina

  userVotes: VoteType[] = [];

  ngOnInit() {
    this.loadIdeas();
    this.loadUserVotes();
  }

  // Carica le idee per la pagina corrente
  loadIdeas() {
    this.restBackend.getPagedIdeas(this.selectedSorting, this.currentPage).subscribe(
      (data: { ideas: IdeaType[]; totalPages: number }) => {
        this.displayedIdeas = data.ideas;
        this.totalPages = Array.from({ length: data.totalPages }, (_, i) => i + 1); // Genera i numeri di pagina
      },
      (error) => {
        this.toastr.error('Error loading ideas');
      }
    );
  }

  // Cambia pagina
  changePage(page: number) {
    this.currentPage = page;
    this.loadIdeas();
  }

  // Cambia il sorting
  onSortingChange() {
    this.currentPage = 1; // Resetta alla prima pagina
    this.loadIdeas();
  }

  loadUserVotes() {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      this.restBackend.getVotesByUserId(currentUser.id).subscribe(
        (votes: VoteType[]) => {
          this.userVotes = votes; // Salva i voti dell'utente
        },
        (error) => {
          this.toastr.error('Error loading user votes');
        }
      );
    }
  }
}

