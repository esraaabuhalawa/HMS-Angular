import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
//import { InputSwitchModule } from 'primeng/inputswitch';
import { IAd } from '../../interfaces/ads.interface';

@Component({
  selector: 'app-add-edit',
  imports: [  DialogModule,
    ReactiveFormsModule,
    InputNumberModule,
    ButtonModule],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss',
})
export class AddEditComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() visible = false;
  @Input() ad: IAd | null = null;
  @Input() loading = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() submitForm = new EventEmitter<any>();

  form = this.fb.group({
    roomId: ['', Validators.required],
    isActive: [true]
  });

  get isEditMode(): boolean {
    return !!this.ad;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ad']) {
      if (this.ad) {
        this.form.patchValue({
          roomId: this.ad.room._id,
          isActive: this.ad.isActive
        });
      } else {
        this.form.reset({
          roomId: '',
          isActive: true
        });
      }
    }
  }

  close() {
    this.visibleChange.emit(false);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.form.getRawValue());
  }
}
