import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { RoomsService } from '../../services/rooms.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

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
    TranslatePipe,
  ],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss',
})
export class AddEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roomsService = inject(RoomsService);
  private activatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private router = inject(Router);

  roomId: string | null = null;
  existingImages: string[] = [];
  previewUrls: string[] = [];
  showImageError = false;
  loading = false;

  roomForm!: FormGroup;

  facilities = signal<any[]>([]);
  selectedFiles: File[] = [];

  constructor() {
    this.formInit();
  }

  formInit() {
    this.roomForm = this.fb.group({
      roomNumber: ['', Validators.required],
      price: [null as number | null, [Validators.required, Validators.min(1)]],
      capacity: [null as number | null, [Validators.required, Validators.min(1)]],
      discount: [0 as number | null, [Validators.required, Validators.min(0), Validators.max(100)]],
      facilities: this.fb.control<string[]>([], Validators.required),
    });
  }

  ngOnInit() {
    this.loadFacilities();
    this.roomId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.roomId) {
      this.getRoomData(this.roomId);
    }
  }

  onSelectFiles(event: any) {
    this.showImageError = false;
    const files = event.currentFiles as File[];

    this.selectedFiles = [...files];

    this.previewUrls.forEach((url) => URL.revokeObjectURL(url));
    this.previewUrls = files.map((file) => URL.createObjectURL(file));
  }

  loadFacilities() {
    this.roomsService.getAllFacilities().subscribe({
      next: (res) => {
        this.facilities.set(res.data.facilities);
      },
    });
  }

  async save() {
    this.showImageError = this.selectedFiles.length === 0 && this.existingImages.length === 0;

    if (this.roomForm.invalid || this.showImageError) {
      this.roomForm.markAllAsTouched();
      return;
    }

    if (this.roomForm.invalid) {
      this.roomForm.markAllAsTouched();
      return;
    }

    if (this.selectedFiles.length === 0 && this.existingImages.length === 0) {
      this.showImageError = true;
      return;
    }

    this.loading = true;

    try {
      const formData = new FormData();

      formData.append('roomNumber', this.roomForm.value.roomNumber ?? '');
      formData.append('price', String(this.roomForm.value.price ?? ''));
      formData.append('capacity', String(this.roomForm.value.capacity ?? ''));
      formData.append('discount', String(this.roomForm.value.discount ?? ''));
      const facilities = this.roomForm.value.facilities || [];

      facilities.forEach((facilityId: string) => {
        formData.append('facilities[]', facilityId);
      });

      // Convert old imgs to files
      if (this.roomId) {
        const oldFiles = await Promise.all(
          this.existingImages.map((img, index) => this.urlToFile(img, index)),
        );

        oldFiles.forEach((file) => {
          formData.append('imgs', file);
        });
      }

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
            detail:
              res.message ||
              (this.roomId ? 'Room updated successfully' : 'Room added successfully'),
          });
          this.router.navigate(['/dashboard/rooms']);
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
    } catch (err) {
      this.loading = false;

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to prepare images',
      });

      console.error(err);
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

  // delete new imgs
  removeSelectedImage(index: number) {
    URL.revokeObjectURL(this.previewUrls[index]);

    this.previewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);

    this.previewUrls = [...this.previewUrls];
    this.selectedFiles = [...this.selectedFiles];
  }

  //  delete old imgs

  removeExistingImage(index: number) {
    this.existingImages.splice(index, 1);
    this.existingImages = [...this.existingImages];
  }

  //convert url(imgs) to files
  async urlToFile(url: string, index: number): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();

    const extension = blob.type.split('/')[1] || 'png';

    return new File([blob], `old-image-${index}.${extension}`, { type: blob.type });
  }

  //clean Object URLs
  ngOnDestroy(): void {
    this.previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }
}
