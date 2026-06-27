import { Component, inject, OnInit, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../../../../shared/components/dashboard/ui/page-header/page-header.component';
import { UserService } from '../../services/user.service';
import { IUser, IUserDetailsResponse, IUserResponse } from '../../interfaces/user.interface';
import { TableSkeletonComponent } from '../../../../../../shared/components/dashboard/table-skeleton/table-skeleton.component';
import { EmptyStateComponent } from '../../../../../../shared/components/general/empty-state/empty-state.component';
import { TableModule } from 'primeng/table';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { UserViewComponent } from '../user-view/user-view.component';

@Component({
  selector: 'app-user-list',
  imports: [
    PageHeaderComponent,
    TableSkeletonComponent,
    EmptyStateComponent,
    TableModule,
    ButtonModule,
    PaginatorModule,
    UserViewComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private _UserService = inject(UserService);
  userList = signal<IUser[]>([]);
  sendUser = signal<IUser | null>(null);
  isLoading = signal<boolean>(true);
  visible = signal(false);
  userLoading = signal(false);
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  ngOnInit(): void {
    this.loadUserListData();
  }
  loadUserListData() {
    this.isLoading.set(true);
    this._UserService.getUserList(this.currentPage, this.pageSize).subscribe({
      next: (res: IUserResponse) => {
        this.isLoading.set(false);
        this.userList.set(res.data.users);
        this.totalRecords = res.data.totalCount;
      },
      error: (error) => {
        this.isLoading.set(false);
      },
    });
  }
  onOpenViewDialog(userInfo: IUser) {
    this.sendUser.set(null);
    this.userLoading.set(true);
    this.visible.set(true);

    this._UserService.getUserDetails(userInfo._id).subscribe({
      next: (res: IUserDetailsResponse) => {
        this.sendUser.set(userInfo);
        this.userLoading.set(false);
      },
      error: (error) => {
        this.userLoading.set(false);
        this.visible.set(false);
      },
    });
  }
  onPageChange(event: PaginatorState) {
    this.currentPage = (event.page ?? 0) + 1;
    this.pageSize = event.rows ?? 10;
    this.loadUserListData();
  }
}
