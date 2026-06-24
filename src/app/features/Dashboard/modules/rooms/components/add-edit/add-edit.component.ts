import { Component ,inject ,OnInit } from '@angular/core';
import { FormBuilder,ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { RoomsService } from '../../services/rooms.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-add-edit',
  imports: [ReactiveFormsModule,
  InputTextModule,
  InputNumberModule,
  SelectModule,
  FileUploadModule,
    CommonModule,
],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss',
})
export class AddEditComponent implements OnInit{

  private fb = inject(FormBuilder);
  private roomsService = inject(RoomsService);
  private activatedRoute = inject(ActivatedRoute);


  roomId: string | null = null;

  existingImages: string[] = [];
  previewUrls: string[] = [];

   loading = false;



roomForm = this.fb.group({
  roomNumber: [''],
  price: [null as number | null],
capacity: [null as number | null],
discount: [null as number | null],
  facility: [null as number | null]
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
  formData.append('facilities', String(this.roomForm.value.facility));

  this.selectedFiles.forEach(file => {
    formData.append('imgs', file);
  });

  const request$ = this.roomId
    ? this.roomsService.updateRoom(this.roomId, formData)
    : this.roomsService.createRoom(formData);

  request$.subscribe({
    next: () => {
      this.loading = false;
    },
    error: () => {
      this.loading = false;
    }
  });
}





  ngOnInit() {
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

      });
    }

  });
}

}


