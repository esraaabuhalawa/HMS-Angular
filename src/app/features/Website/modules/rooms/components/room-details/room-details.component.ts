import { Component, inject } from '@angular/core';
import { WebsitePageHeadingComponent } from '../../../../../../shared/components/website/ui/website-page-heading/website-page-heading.component';
import { MenuItem } from 'primeng/api';
import { ReviewsComponent } from '../reviews/reviews.component';
import { ActivatedRoute } from '@angular/router';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-room-details',
  imports: [WebsitePageHeadingComponent, ReviewsComponent, CommentsComponent],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.scss',
})
export class RoomDetailsComponent {
  private route = inject(ActivatedRoute);
  roomId = this.route.snapshot.paramMap.get('id') ?? '';

  breadcrumbs: MenuItem[] = [
    {
      label: 'Rooms',
      routerLink: '/rooms',
    },
    {
      label: 'Room Details',
    },
  ];
}
