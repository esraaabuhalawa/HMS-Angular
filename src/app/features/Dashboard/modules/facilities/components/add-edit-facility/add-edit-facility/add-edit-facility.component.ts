import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { FacilitiesService } from '../../../services/facilities.service';
import { ICreateFacility, IFacility } from '../../../interfaces/facilities.interface';

@Component({
  selector: 'app-add-edit-facility',
  imports: [Dialog, Button, FormsModule, InputText],
  templateUrl: './add-edit-facility.component.html',
  styleUrl: './add-edit-facility.component.scss',
})
export class AddEditComponent implements OnChanges {
  private facilitiesService = inject(FacilitiesService);

  @Input() visible = false;
  @Input() selectedFacility: IFacility | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() facilityAdded = new EventEmitter<void>();

  facilityName = '';
  loading = false;

  get isEditMode(): boolean {
    return !!this.selectedFacility;
  }

  ngOnChanges() {
    if (this.selectedFacility) {
      this.facilityName = this.selectedFacility.name;
    } else {
      this.facilityName = '';
    }
  }

  onHide() {
    this.facilityName = '';
    this.visibleChange.emit(false);
  }

  save() {
    if (!this.facilityName.trim()) return;

    this.loading = true;
    const data: ICreateFacility = { name: this.facilityName };

    if (this.isEditMode) {
      this.facilitiesService.updateFacility(this.selectedFacility!._id, data).subscribe({
        next: () => {
          this.loading = false;
          this.onHide();
          this.facilityAdded.emit();
        },
        error: () => (this.loading = false),
      });
    } else {
      this.facilitiesService.createFacility(data).subscribe({
        next: () => {
          this.loading = false;
          this.onHide();
          this.facilityAdded.emit();
        },
        error: () => (this.loading = false),
      });
    }
  }
}
