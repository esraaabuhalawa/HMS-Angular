import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { WebsitePageHeadingComponent } from '../../../../../../shared/components/website/ui/website-page-heading/website-page-heading.component';
import { MenuItem } from 'primeng/api';
import { ReviewsComponent } from '../reviews/reviews.component';
import { ActivatedRoute } from '@angular/router';
import { CommentsComponent } from '../comments/comments.component';
import { RoomsService } from '../../services/rooms.service';
import { DatePicker } from 'primeng/datepicker';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { IRoom } from '../../../../../../shared/interfaces/general.interface';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-room-details',
  imports: [
    FormsModule,
    WebsitePageHeadingComponent,
    ReviewsComponent,
    CommentsComponent,
    DatePicker,
    TranslatePipe,
    Skeleton,
  ],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.scss',
})
export class RoomDetailsComponent implements OnInit {
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

  dateRange: Date[] | null = null;
  roomDetails: IRoom | null = null;
  ngOnInit(): void {
    this.getRoomDetails();
  }
  getRoomDetails() {
    this.isLoading.set(true);
    this.roomService.getRoomDetails(this.roomId).subscribe({
      next: (response: { data: { room: IRoom } }) => {
        this.roomDetails = response.data.room;
        console.log('Room Details:', response.data.room);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching room details:', error);
        this.isLoading.set(false);
      },
    });
  }

  get numberOfNights(): number {
    if (!this.dateRange || !this.dateRange[0] || !this.dateRange[1]) {
      return 0;
    }

    const startDate = this.dateRange[0];
    const endDate = this.dateRange[1];

    const oneDayMs = 1000 * 60 * 60 * 24;
    const diffMs = endDate.getTime() - startDate.getTime();

    return Math.round(diffMs / oneDayMs);
  }

  get totalPrice(): number {
    const pricePerNight = this.roomDetails!.price;
    return this.numberOfNights * pricePerNight;
  }
  continueBooking() {}
}
