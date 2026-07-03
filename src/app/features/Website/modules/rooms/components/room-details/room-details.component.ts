import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { WebsitePageHeadingComponent } from '../../../../../../shared/components/website/ui/website-page-heading/website-page-heading.component';
import { MenuItem } from 'primeng/api';
import { ReviewsComponent } from '../reviews/reviews.component';
import { ActivatedRoute } from '@angular/router';
import { CommentsComponent } from '../comments/comments.component';
import { RoomsService } from '../../services/rooms.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-room-details',
  imports: [WebsitePageHeadingComponent, ReviewsComponent, CommentsComponent, TranslatePipe],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.scss',
})
export class RoomDetailsComponent {
  private route = inject(ActivatedRoute);
  private roomService = inject(RoomsService);
  private translate = inject(TranslateService);
  //id
  roomId = this.route.snapshot.paramMap.get('id') ?? '';
  breadcrumbs: MenuItem[] = [
    {
      label: this.translate.instant('ROOM_DETAILS.ROOM_DETAILS_TITLE'),
    },
  ];

  roomDetails = toSignal(this.roomService.getRoomDetails(this.roomId));
}
