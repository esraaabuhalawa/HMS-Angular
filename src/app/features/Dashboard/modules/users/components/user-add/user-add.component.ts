import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { AuthService } from '../../../../../Auth/services/auth.service';
import { Button } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { RoleEnum } from '../../../../../../core/enums/role.enum';
import { TranslatePipe } from '@ngx-translate/core';
import { FormFieldComponent } from '../../../../../../shared/components/auth/form-field/form-field.component';
import { matchPasswordValidator } from '../../../../../../shared/validators/confirm-password-validator';

@Component({
  selector: 'app-user-add',
  imports: [
    DialogModule,
    FileUploadModule,
    Button,
    SelectModule,
    ReactiveFormsModule,
    FormFieldComponent,
    TranslatePipe,
  ],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.scss',
})
export class UserAddComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly authservice = inject(AuthService);
  private readonly messageService = inject(MessageService);
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() loadingChange = new EventEmitter<boolean>();
  @Output() submitForm = new EventEmitter<any>();
  @Input() loading = false;

  @Input({ required: true }) visible = false;
  registerForm!: FormGroup;
  files: any[] = [];
  rolesOption = [
    {
      label: 'Admin',
      value: RoleEnum.Admin,
    },
    {
      label: 'User',
      value: RoleEnum.User,
    },
  ];
  constructor() {
    this.formInit();
  }
  formInit() {
    this.registerForm = this.fb.group(
      {
        userName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        email: [null, [Validators.required, Validators.email]],
        password: [
          null,
          [
            Validators.required,
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#?&]{8,}$/),
          ],
        ],
        confirmPassword: [null, [Validators.required]],
        phoneNumber: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
        country: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/),
          ],
        ],
        role: [null, Validators.required],
        profileImage: [null, [Validators.required]],
      },
      {
        validators: matchPasswordValidator('password', 'confirmPassword'),
      },
    );
  }

  get form() {
    return this.registerForm.controls;
  }

  onSelect(event: any) {
    this.files = event.currentFiles;
    console.log(this.files);
    if (this.files.length > 0) {
      this.registerForm.get('profileImage')?.setValue(this.files[0]);
    } else {
      this.registerForm.get('profileImage')?.setValue(null);
    }

    this.registerForm.get('profileImage')?.markAsTouched();
    console.log(this.registerForm.get('profileImage')?.value);
    console.log(this.registerForm.get('profileImage')?.touched);
    console.log(this.registerForm.get('profileImage')?.invalid);
  }

  onClear() {
    this.files = [];
    this.registerForm.get('profileImage')?.setValue(null);
    this.registerForm.get('profileImage')?.markAsTouched();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && !this.visible) {
      this.registerForm.reset();
      this.files = [];
    }
  }
  save() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;
    let createdUser = new FormData();
    Object.entries(this.registerForm.controls).forEach(([key, control]) => {
      if (key !== 'profileImage') {
        createdUser.append(key, control.value);
      }
    });
    createdUser.append('profileImage', this.files[0]);
    console.log(createdUser);

    this.loadingChange.emit(true);
    this.submitForm.emit(createdUser);
  }
  onHide() {
    this.visibleChange.emit(false);
  }
  close() {
    this.visibleChange.emit(false);
  }
}
