import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { RoomsService } from '../../services/rooms.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-edit',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ButtonModule,
    FileUploadModule,
    CommonModule,
    MultiSelectModule,
  ],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss',
})
export class AddEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roomsService = inject(RoomsService);
  private activatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  roomId: string | null = null;
  existingImages: string[] = [];
  previewUrls: string[] = [];
  loading = false;

  roomForm = this.fb.group({
    roomNumber: [''],
    price: [null as number | null],
    capacity: [null as number | null],
    discount: [null as number | null],
    facilities: [[] as string[]],
  });

  facilities = signal<any[]>([]);
  selectedFiles: File[] = [];
  onSelectFiles(event: any) {
    const files = event.currentFiles || event.files;
    this.selectedFiles = files;
    this.previewUrls = files.map((file: File) => URL.createObjectURL(file));
  }

  loadFacilities() {
    this.roomsService.getAllFacilities().subscribe({
      next: (res) => {
        this.facilities.set(res.data.facilities);
        //this.facilities = res.data.facilities;
      },
    });
  }

  save() {
    this.loading = true;

    const formData = new FormData();

    formData.append('roomNumber', this.roomForm.value.roomNumber ?? '');
    formData.append('price', String(this.roomForm.value.price ?? ''));
    formData.append('capacity', String(this.roomForm.value.capacity ?? ''));
    formData.append('discount', String(this.roomForm.value.discount ?? ''));
    const facilities = this.roomForm.value.facilities || [];

    facilities.forEach((facilityId: string) => {
      formData.append('facilities[]', facilityId);
    });

    this.selectedFiles.forEach((file) => {
      formData.append('imgs', file);
    });

    const request$ = this.roomId
      ? this.roomsService.updateRoom(this.roomId, formData)
      : this.roomsService.createRoom(formData);

    request$.subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Room added successfully',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Something went wrong',
        });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  ngOnInit() {
    this.loadFacilities();
    this.roomId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.roomId) {
      this.getRoomData(this.roomId);
    }
  }

  getRoomData(id: string) {
    this.roomsService.getRoomDetails(id).subscribe({
      next: (res) => {
        const room = res.data.room;

        console.log(room.facilities);

        this.existingImages = room.images;

        this.roomForm.patchValue({
          roomNumber: room.roomNumber,
          price: room.price,
          capacity: room.capacity,
          discount: room.discount,
          facilities: room.facilities.map((f) => f._id),
        });
      },
    });
  }
}
