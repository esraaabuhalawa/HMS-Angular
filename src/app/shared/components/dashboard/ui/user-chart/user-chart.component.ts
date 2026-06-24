import { Component, computed, inject, Input, input, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Bookings } from '../../../../../features/Dashboard/interfaces/iadmin.interface';
@Component({
  selector: 'app-user-chart',
  imports: [ChartModule],
  templateUrl: './user-chart.component.html',
  styleUrl: './user-chart.component.scss',
})
export class UserChartComponent {
  bookings = input<{
    pending: number;
    completed: number;
  }>();
  chartData = computed(() => {
    const data = this.bookings();

    if (!data) return null;

    const documentStyle = getComputedStyle(document.documentElement);

    return {
      labels: ['Pending', 'Completed'],

      datasets: [
        {
          data: [data.pending, data.completed],

          backgroundColor: [
            documentStyle.getPropertyValue('--p-orange-500'),
            documentStyle.getPropertyValue('--p-green-500'),
          ],

          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--p-orange-400'),
            documentStyle.getPropertyValue('--p-green-400'),
          ],
        },
      ],
    };
  });

  chartOptions = {
    cutout: '60%',
    plugins: {
      legend: {
        labels: {},
      },
    },
  };

  // @Input({ required: true }) data!: Bookings;
  // options: any;
  // platformId = inject(PLATFORM_ID);

  // ngOnInit() {
  //   this.initChart();
  // }

  // initChart() {
  //   // if (isPlatformBrowser(this.platformId)) {
  //   //   const documentStyle = getComputedStyle(document.documentElement);
  //   //   const textColor = documentStyle.getPropertyValue('--p-text-color');
  //   //   this.data = {
  //   //     labels: ['A', 'B', 'C'],
  //   //     datasets: [
  //   //       {
  //   //         data: [300, 50, 100],
  //   //         backgroundColor: [
  //   //           documentStyle.getPropertyValue('--p-cyan-500'),
  //   //           documentStyle.getPropertyValue('--p-orange-500'),
  //   //           documentStyle.getPropertyValue('--p-gray-500'),
  //   //         ],
  //   //         hoverBackgroundColor: [
  //   //           documentStyle.getPropertyValue('--p-cyan-400'),
  //   //           documentStyle.getPropertyValue('--p-orange-400'),
  //   //           documentStyle.getPropertyValue('--p-gray-400'),
  //   //         ],
  //   //       },
  //   //     ],
  //   //   };
  //   //   this.options = {
  //   //     cutout: '60%',
  //   //     plugins: {
  //   //       legend: {
  //   //         labels: {
  //   //           color: textColor,
  //   //         },
  //   //       },
  //   //     },
  //   //   };
  //   //   this.cd.markForCheck();
  //   // }
  // }
}
