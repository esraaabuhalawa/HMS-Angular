import { Component, inject, OnInit, signal } from '@angular/core';
import { WebsitePageHeadingComponent } from '../../../../../../shared/components/website/ui/website-page-heading/website-page-heading.component';
import { MenuItem } from 'primeng/api';
import { ReviewsComponent } from '../reviews/reviews.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentsComponent } from '../comments/comments.component';
import { RoomsService } from '../../services/rooms.service';
import { DatePicker } from 'primeng/datepicker';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { IRoom } from '../../../../../../shared/interfaces/general.interface';
import { Skeleton } from 'primeng/skeleton';
import Swal from 'sweetalert2';
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
  private router = inject(Router);
  isLoading = signal<boolean>(false);
  bookingId = signal<string>('');

  dateRange: Date[] | null = null;
  roomDetails: any | null = null;

  //id
  roomId = this.route.snapshot.paramMap.get('id') ?? '';
  breadcrumbs: MenuItem[] = [
    {
      label: this.translate.instant('ROOM_DETAILS.ROOM_DETAILS_TITLE'),
    },
  ];

  ngOnInit() {
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

  //Booking
  continueBooking() {
    if (!this.dateRange || !this.dateRange[0] || !this.dateRange[1]) {
      Swal.fire({
        icon: 'info',
        title: 'Dates Required',
        text: 'Please select your check-in and check-out dates first!',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    this.isLoading.set(true);
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const bookingPayload = {
      startDate: formatDate(this.dateRange[0]),
      endDate: formatDate(this.dateRange[1]),
      room: this.roomId,
      totalPrice: this.totalPrice,
    };

    this.roomService.createBooking(bookingPayload).subscribe({
      next: (res) => {
        this.isLoading.set(true);
        const bookingId = (res as any).data?.booking?._id;
        if (bookingId) {
          this.router.navigate(['/payment', bookingId], {
            queryParams: { price: this.totalPrice },
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Booking Error',
            text: 'Failed to get booking identity from server.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#d33',
          });
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Booking Failed',
          text: err.error?.message || 'Failed to create booking.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33',
        });
      },
    });
  }
}
