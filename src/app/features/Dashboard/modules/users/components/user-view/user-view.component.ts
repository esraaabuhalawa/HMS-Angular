import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { IUser } from '../../interfaces/user.interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-user-view',
  imports: [DialogModule, SkeletonModule, TagModule, DividerModule, TranslatePipe],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss',
})
export class UserViewComponent {
  @Input() userInfo: IUser | null = null;
  @Input({ required: true }) visible = false;
  @Input({ required: true }) loading = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  onHide() {
    this.visibleChange.emit(false);
  }
}
