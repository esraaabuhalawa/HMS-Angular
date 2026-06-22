import { Component ,inject } from '@angular/core';
import { FormBuilder,ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';


@Component({
  selector: 'app-add-edit',
  imports: [ReactiveFormsModule,
  InputTextModule,
  InputNumberModule,
  SelectModule,
  FileUploadModule],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss',
})
export class AddEditComponent {

  private fb = inject(FormBuilder);

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

}
