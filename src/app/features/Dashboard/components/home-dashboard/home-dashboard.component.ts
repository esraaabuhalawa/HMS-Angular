import { AdminService } from './../../services/admin.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { StaticsCardComponent } from '../../../../shared/components/dashboard/ui/statics-card/statics-card.component';
import {  Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Data } from '../../interfaces/iadmin.interface';
import { UserChartComponent } from '../../../../shared/components/dashboard/ui/user-chart/user-chart.component';
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'app-home-dashboard',
  imports: [StaticsCardComponent, Toast, UserChartComponent, SkeletonModule],
  providers: [MessageService],
  templateUrl: './home-dashboard.component.html',
  styleUrl: './home-dashboard.component.scss',
})
export class HomeDashboardComponent implements OnInit {
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
}
