import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { IBooking } from '../../interfaces/booking.interface';
import { DialogModule } from 'primeng/dialog';
import { Skeleton } from "primeng/skeleton";
import { Tag } from "primeng/tag";
import { Divider } from "primeng/divider";
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-view-booking',
  imports: [
    DialogModule,
    Skeleton,
    Tag,
    Divider,
    CurrencyPipe,
    DatePipe,
    TranslatePipe
  ],
  templateUrl: './view-booking.component.html',
  styleUrl: './view-booking.component.scss',
})
export class ViewBookingComponent {
    @Input() selectedBooking: IBooking | null = null;

  @Input() visible = false;

  @Input() loading = false;

  @Output() visibleChange = new EventEmitter<boolean>();

  onHide() {
    this.visibleChange.emit(false);
  }

}
