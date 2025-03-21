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

@Component({
  selector: 'app-home-page',
  imports: [NavbarComponent, HeaderComponent, FooterComponent, IdeaCardComponent, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  restBackend = inject(RestBackendService);
  toastr = inject(ToastrService);
  router = inject(Router);
  controversialIdeas: IdeaType[] = [];
  newestIdeas: IdeaType[] = [];
  mainstreamIdeas: IdeaType[] = [];
  unpopularIdeas: IdeaType[] = [];

  // Proprietà
  selectedSorting: SortingType = 'controversial'; // Sorting iniziale
  displayedIdeas: IdeaType[] = []; // Idee mostrate nella pagina

  ngOnInit() {
    this.loadInitialIdeas();
  }

  // Carica le idee iniziali (controversial)
  loadInitialIdeas() {
    this.restBackend.getPagedIdeas('controversial', 1).subscribe(
      (data: IdeaType[]) => {
        this.controversialIdeas = data;
        this.displayedIdeas = data; // Mostra inizialmente le idee controverse
      },
      (error) => {
        this.toastr.error('Error loading ideas');
      }
    );
  }

  // Cambia il sorting e aggiorna le idee mostrate
  onSortingChange() {
    switch (this.selectedSorting) {
      case 'controversial':
        this.displayedIdeas = this.controversialIdeas;
        break;
      case 'mainstream':
        if (this.mainstreamIdeas.length === 0) {
          this.restBackend.getPagedIdeas('mainstream', 1).subscribe(
            (data: IdeaType[]) => {
              this.mainstreamIdeas = data;
              this.displayedIdeas = data;
            },
            (error) => {
              this.toastr.error('Error loading mainstream ideas');
            }
          );
        } else {
          this.displayedIdeas = this.mainstreamIdeas;
        }
        break;
      case 'newest':
        if (this.newestIdeas.length === 0) {
          this.restBackend.getPagedIdeas('newest', 1).subscribe(
            (data: IdeaType[]) => {
              this.newestIdeas = data;
              this.displayedIdeas = data;
            },
            (error) => {
              this.toastr.error('Error loading newest ideas');
            }
          );
        } else {
          this.displayedIdeas = this.newestIdeas;
        }
        break;
      case 'unpopular': // Gestione del sorting "unpopular"
        if (this.unpopularIdeas.length === 0) {
          this.restBackend.getPagedIdeas('unpopular', 1).subscribe(
            (data: IdeaType[]) => {
              this.unpopularIdeas = data;
              this.displayedIdeas = data;
            },
            (error) => {
              this.toastr.error('Error loading unpopular ideas');
            }
          );
        } else {
          this.displayedIdeas = this.unpopularIdeas;
        }
        break;
    }
  }

  // Carica altre idee per la categoria selezionata
  loadMoreIdeas() {
    this.restBackend.pageNumber++;
    this.restBackend.getPagedIdeas(this.selectedSorting, this.restBackend.pageNumber).subscribe(
      (data: IdeaType[]) => {
        this.displayedIdeas = this.displayedIdeas.concat(data);
        switch (this.selectedSorting) {
          case 'controversial':
            this.controversialIdeas = this.controversialIdeas.concat(data);
            break;
          case 'mainstream':
            this.mainstreamIdeas = this.mainstreamIdeas.concat(data);
            break;
          case 'newest':
            this.newestIdeas = this.newestIdeas.concat(data);
            break;
          case 'unpopular': // Caricamento di altre idee "unpopular"
            this.unpopularIdeas = this.unpopularIdeas.concat(data);
            break;
        }
      },
      (error) => {
        this.toastr.error('Error loading more ideas');
      }
    );
  }
}

