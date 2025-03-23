import { Component, Input } from '@angular/core';
import { CommentType } from '../_services/rest-backend/comment.type';
import { CommonModule } from '@angular/common';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-comment-card',
  imports: [CommonModule],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss'
})
export class CommentCardComponent {
  @Input() comment: CommentType | undefined = undefined;

  constructor(private sanitizer: DomSanitizer) {}

  // Metodo per processare e sanificare il contenuto in Markdown
  getProcessedContent(): SafeHtml {
    if (this.comment?.content) {
      const html = marked(this.comment.content); // Converte il Markdown in HTML
      return this.sanitizer.bypassSecurityTrustHtml(html.toString()); // Sanifica l'HTML
    }
    return '';
  }
}