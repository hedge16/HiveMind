import { Component, Input } from '@angular/core';
import { CommentType } from '../_services/rest-backend/comment.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-card',
  imports: [CommonModule],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss'
})
export class CommentCardComponent {
  @Input() comment: CommentType | undefined = undefined;

}
