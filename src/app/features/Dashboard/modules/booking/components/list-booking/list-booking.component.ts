import { Component, inject, signal } from '@angular/core';
import { PageHeaderComponent } from "../../../../../../shared/components/dashboard/ui/page-header/page-header.component";
import { Menu, MenuModule } from 'primeng/menu';
import { Button, ButtonModule } from 'primeng/button';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { IBooking, IBookingsResponse } from '../../interfaces/booking.interface';
import { BookingService } from '../../services/booking.service';
import { AlertDeleteService } from '../../../../../../shared/services/alert-delete.service';
import { TableSkeletonComponent } from "../../../../../../shared/components/dashboard/table-skeleton/table-skeleton.component";
import { EmptyStateComponent } from "../../../../../../shared/components/general/empty-state/empty-state.component";
import { TableModule } from "primeng/table";
import { ViewBookingComponent } from "../view-booking/view-booking.component";
import { CurrencyPipe ,DatePipe  } from '@angular/common';

@Component({
  selector: 'app-list-booking',
  imports: [
    PageHeaderComponent,
    Menu,
    MenuModule,
    Button,
    ButtonModule,
    Paginator,
    TableSkeletonComponent,
    EmptyStateComponent,
    TableModule,
    ViewBookingComponent,
    CurrencyPipe,
    DatePipe,

  ],
  templateUrl: './list-booking.component.html',
  styleUrl: './list-booking.component.scss',
})
export class ListBookingComponent {
  private bookingService = inject(BookingService);
  private alertService = inject(AlertDeleteService);

  menuItems: any[] = [];
  selectedBooking = signal<IBooking | null>(null);
  bookingLoading = signal(false);
  visible = signal(false);
  isLoading = signal(false);
  bookingList = signal<IBooking[]>([]);
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;


openMenu(event: Event, booking: IBooking, menu: any) {
    this.menuItems = [
      {
        label: 'View',
        icon: 'pi pi-eye',
        command: () => this.viewBooking(booking)
      },

      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteBooking(booking)
      }
    ];
    menu.toggle(event);
  }


  viewBooking(booking: IBooking) {
      this.selectedBooking.set(null);
      this.bookingLoading.set(true);
      this.visible.set(true);

      this.bookingService.getBookingDetails(booking._id).subscribe({
        next: (res) => {
          this.selectedBooking.set(res.data.booking);
          this.bookingLoading.set(false);
        },
        error: () => {
          this.bookingLoading.set(false);
          this.visible.set(false);
        }
      });
    }



    //Delete Room
    deleteBooking(booking: IBooking) {
      console.log('Delete Clicked', booking);
      this.alertService.delete({
        entity: 'booking',
        label: booking.room.roomNumber,
        request: () => this.bookingService.deleteBooking(booking._id),
        onSuccess: () => this.loadBookingsData(),
      });
    }


loadBookingsData() {
  this.isLoading.set(true);

  this.bookingService.getAllBookings({
    page: this.currentPage,
    size: this.pageSize
  }).subscribe({
    next: (res: IBookingsResponse) => {
      this.bookingList.set(res.data.booking);
      this.totalRecords = res.data.totalCount;
      this.isLoading.set(false);
    },
    error: () => {
      this.isLoading.set(false);
    }
  });
}

 ngOnInit(): void {
    this.loadBookingsData();
  }

 onPageChange(event: PaginatorState) {
  this.currentPage = (event.page ?? 0) + 1;
  this.pageSize = event.rows ?? 10;

  this.loadBookingsData();
}

}



