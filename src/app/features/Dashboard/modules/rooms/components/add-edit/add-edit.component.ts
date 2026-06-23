import { Component ,inject } from '@angular/core';
import { FormBuilder,ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { RoomsService } from '../../services/rooms.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-add-edit',
  imports: [ReactiveFormsModule,
  InputTextModule,
  InputNumberModule,
  SelectModule,
  FileUploadModule,
    CommonModule],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss',
})
export class AddEditComponent {

  private fb = inject(FormBuilder);
  private roomsService = inject(RoomsService);


   loading = false;
  previewUrls: string[] = [];


roomForm = this.fb.group({
  roomNumber: [''],
  price: [null],
  capacity: [null],
  discount: [null],
  facility: [null]
});

facilities = [
  { id: 1, name: 'WiFi' },
  { id: 2, name: 'TV' },
  { id: 3, name: 'AC' }
];

selectedFiles: File[] = [];

onSelectFiles(event: any) {
  console.log(event);

  const files = event.currentFiles || event.files;

  this.selectedFiles = files;

  this.previewUrls = files.map((file: File) =>
    URL.createObjectURL(file)
  );
}


 save() {
    this.loading = true;

    const formData = new FormData();

    formData.append('roomNumber', this.roomForm.value.roomNumber ?? '');
    formData.append('price', String(this.roomForm.value.price ?? ''));
    formData.append('capacity', String(this.roomForm.value.capacity ?? ''));
    formData.append('discount', String(this.roomForm.value.discount ?? ''));
    formData.append('facility', String(this.roomForm.value.facility ?? ''));

    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    this.roomsService.createRoom(formData)
      .subscribe({
        next: () => {
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

}
