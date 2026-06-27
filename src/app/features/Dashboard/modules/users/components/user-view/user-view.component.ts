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

@Component({
  selector: 'app-user-view',
  imports: [DialogModule, SkeletonModule, TagModule, DividerModule],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss',
})
export class UserViewComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.userInfo);
    console.log(this.loading);
  }
  @Input() userInfo: IUser | null = null;
  @Input({ required: true }) visible = false;
  @Input({ required: true }) loading = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  onHide() {
    this.visibleChange.emit(false);
  }
  ngOnInit(): void {
    console.log(this.userInfo);
  }
  ngAfterViewInit(): void {
    console.log(this.userInfo);
  }
}
