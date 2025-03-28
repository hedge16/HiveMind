import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { IdeaCardComponent } from '../idea-card/idea-card.component';
import { IdeaType } from '../_services/rest-backend/idea.type';
import { SortingType } from '../_services/rest-backend/sorting.type';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  ngOnInit() {
    this.loadIdeas();
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
}

