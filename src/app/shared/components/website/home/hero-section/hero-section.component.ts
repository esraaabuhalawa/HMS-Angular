import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { formatDate } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-hero-section',
  imports: [InputNumberModule, FormsModule, DatePickerModule, ButtonModule, TranslatePipe],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
})
export class HeroSectionComponent {
  @Input() loadingSearch!: boolean;
  dateError: boolean = false;
  dateRange: Date[] | null = null;
  value1: number = 1;
  @Output() clear = new EventEmitter<void>();
  @Output() search = new EventEmitter<{
    startDate: string;
    endDate: string;
    capacity: number;
  }>();

  filterByDate() {
    if (!this.dateRange || this.dateRange.length < 2) return;

    // const [startDate, endDate] = this.dateRange;
    // // Ensure end date is after start date
    // if (endDate <= startDate) {
    //   this.dateError = true;
    //   return;
    // }

    this.search.emit({
      startDate: formatDate(this.dateRange[0], 'yyyy-MM-dd', 'en'),
      endDate: formatDate(this.dateRange[1], 'yyyy-MM-dd', 'en'),
      capacity: this.value1
    });
  }

  onDateClear() {
    this.dateRange = null;
    this.clear.emit();
  }
}
