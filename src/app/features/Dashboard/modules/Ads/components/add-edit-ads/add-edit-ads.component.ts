import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { IAd } from '../../interfaces/ads.interface';
import { Select } from 'primeng/select';
import { RoomsService } from '../../../rooms/services/rooms.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { IRoom } from '../../../../../../shared/interfaces/general.interface';

@Component({
  selector: 'app-add-edit-ads',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    InputNumberModule,
    Select,
    ButtonModule,
    FormsModule,
    ToggleSwitchModule,
  ],
  templateUrl: './add-edit-ads.component.html',
  styleUrl: './add-edit-ads.component.scss',
})
export class AddEditAdsComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private roomsService = inject(RoomsService);

  @Input() visible = false;
  @Input() ad: IAd | null = null;
  @Input() loading = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() submitForm = new EventEmitter<any>();
  form!: FormGroup;
  allRooms = signal<IRoom[]>([]);
  page = 1;
  size = 20;
  totalRecords = 0;
  loadingRooms = false;
  search = '';

  statusOptions = [
    {
      label: 'Active',
      value: true,
    },
    {
      label: 'Inactive',
      value: false,
    },
  ];

  constructor() {
    this.formInit();
  }

  ngOnInit(): void {
    this.getRoomsLocally();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ad']) {
      if (this.ad) {
        this.form.patchValue({
          room: this.ad.room._id,
          discount: this.ad.room.discount ?? 0,
          isActive: this.ad.isActive,
        });
      } else {
        this.form.reset({
          room: '',
          discount: null,
          isActive: true,
        });
      }
    }
  }

  formInit() {
    this.form = this.fb.group({
      room: ['', Validators.required],
      discount: [null as number | null, [Validators.required, Validators.min(1), Validators.max(100)],],
      isActive: [true],
    });
  }

  get isEditMode(): boolean {
    return !!this.ad;
  }

  // Submitting Form Data
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.isEditMode) {
      const payload = {
        discount: this.form.value.discount,
        isActive: this.form.value.isActive,
      };
      this.submitForm.emit(payload);
    } else {
      this.submitForm.emit(this.form.value);
    }
  }

  //Get Rooms Data For Select
  getRoomsLocally() {
    this.loadingRooms = true;

    this.roomsService.getAllRoomsLocally().subscribe({
      next: (res) => {
        this.allRooms.set(res.data.rooms);
        this.loadingRooms = false;
      },
      error: () => {
        this.loadingRooms = false;
      },
    });
  }

  close() {
    this.visibleChange.emit(false);
  }
}
