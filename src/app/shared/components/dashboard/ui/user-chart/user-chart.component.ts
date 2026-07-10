import { Data } from './../../../../../features/Dashboard/interfaces/iadmin.interface';
import {
  Component,
  computed,
  inject,
  Input,
  input,
  OnInit,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Bookings } from '../../../../../features/Dashboard/interfaces/iadmin.interface';
import { ThemeService } from '../../../../../core/services/theme.service';
@Component({
  selector: 'app-user-chart',
  imports: [ChartModule],
  templateUrl: './user-chart.component.html',
  styleUrl: './user-chart.component.scss',
})
export class UserChartComponent {
  private readonly themeService = inject(ThemeService);
  data = input<{ label: string; value: number; color?: string }[]>();
  title = input<string>('');
  cutout = input<string>('60%');
  chartOptions = computed(() => ({
    cutout: this.cutout(),
    radius: '90%',

    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: this.themeService.theme() === 'dark' ? '#9BA3C7' : '#555',
          font: { size: 13 },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },

    animation: {
      duration: 800,
      animateRotate: true,
      animateScale: true,
    },

    responsive: true,
    maintainAspectRatio: true,
  }));

  chartData = computed(() => {
    const items = this.data();
    if (!items?.length) return null;

    return {
      labels: items.map((i) => i.label),
      datasets: [
        {
          data: items.map((i) => i.value),
          backgroundColor: items.map(
            (i, idx) => i.color ?? ['#4ade80', '#60a5fa', '#f97316', '#a78bfa', '#f87171'][idx % 5],
          ),
          hoverBackgroundColor: items.map(
            (i, idx) => i.color ?? ['#22c55e', '#3b82f6', '#ea580c', '#7c3aed', '#ef4444'][idx % 5],
          ),
          borderWidth: 0,
          borderRadius: 4,
          spacing: 2,
        },
      ],
    };
  });
}
