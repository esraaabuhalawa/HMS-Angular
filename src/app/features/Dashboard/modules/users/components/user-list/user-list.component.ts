import { Component, inject, OnInit, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../../../../shared/components/dashboard/ui/page-header/page-header.component';
import { UserService } from '../../services/user.service';
import { IUser, IUserDetailsResponse, IUserResponse } from '../../interfaces/user.interface';
import { TableSkeletonComponent } from '../../../../../../shared/components/dashboard/ui/table-skeleton/table-skeleton.component';
import { EmptyStateComponent } from '../../../../../../shared/components/general/empty-state/empty-state.component';
import { TableModule } from 'primeng/table';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { UserViewComponent } from '../user-view/user-view.component';
import { UserAddComponent } from '../user-add/user-add.component';

import { AuthService } from '../../../../../Auth/services/auth.service';
import { ICurrentUserResponse } from '../../../../../Auth/interfaces/auth';
import { MessageService } from 'primeng/api';

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
    UserAddComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private _UserService = inject(UserService);
  private _AuthService = inject(AuthService);
  private messageService = inject(MessageService);
  userList = signal<IUser[]>([]);
  sendUser = signal<IUser | null>(null);
  isLoading = signal<boolean>(true);
  visible = signal(false);
  userLoading = signal(false);
  showLoading = false;
  showDialog = false;
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

  openNewAddUserDialog() {
    this.showDialog = true;
  }
  submitNewUser(createdUser: FormData) {
    this._AuthService.register(createdUser).subscribe({
      next: (res: ICurrentUserResponse) => {
        this.showLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Account Created',
          detail: 'Your account has been created successfully!',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
        this.showLoading = false;
      },
      complete: () => {
        this.loadUserListData();
        this.visible.set(false);
        this.showDialog = false;
      },
    });
  }
  onPageChange(event: PaginatorState) {
    this.currentPage = (event.page ?? 0) + 1;
    this.pageSize = event.rows ?? 10;
    this.loadUserListData();
  }
}
