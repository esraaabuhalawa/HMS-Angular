import { AdminService } from './../../services/admin.service';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { StaticsCardComponent } from '../../../../shared/components/dashboard/ui/statics-card/statics-card.component';
import { ToastModule, Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Data } from '../../interfaces/iadmin.interface';
import { UserChartComponent } from '../../../../shared/components/dashboard/ui/user-chart/user-chart.component';
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'app-home',
  imports: [StaticsCardComponent, Toast, UserChartComponent, SkeletonModule],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly adminService = inject(AdminService);
  private readonly messageService = inject(MessageService);
  mainData = signal<Data | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading.set(true);
    this.adminService.getDashboardStats().subscribe({
      next: (res) => {
        this.mainData.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load dashboard data',
        });
        this.isLoading.set(false);
      },
    });
  }
  ngOnDestroy(): void {}
}
