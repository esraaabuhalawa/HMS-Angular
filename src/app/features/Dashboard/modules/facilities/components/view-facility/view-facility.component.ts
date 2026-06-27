import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IFacility } from '../../interfaces/facilities.interface';
import { Dialog } from 'primeng/dialog';
import { Skeleton } from 'primeng/skeleton';
import { DatePipe } from '@angular/common';
import { Divider } from 'primeng/divider';
@Component({
  selector: 'app-view-facility',
  imports: [Dialog, Skeleton, DatePipe, Divider],
  templateUrl: './view-facility.component.html',
  styleUrl: './view-facility.component.scss',
})
export class ViewFacilityComponent {
  @Input() selectedFacility: IFacility | null = null;
  @Input() visible = false;
  @Input() loading = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  onHide() {
    this.visibleChange.emit(false);
  }
}
