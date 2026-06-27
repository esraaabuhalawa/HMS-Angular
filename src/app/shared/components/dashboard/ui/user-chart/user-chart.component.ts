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
  // bookings = input<{
  //   pending: number;
  //   completed: number;
  // }>();
  // users = input<{
  //   user: number;
  //   admin: number;
  // }>();
  // chartData = computed(() => {
  //   const data = this.bookings();

  //   if (!data) return null;

  //   const documentStyle = getComputedStyle(document.documentElement);

  //   return {
  //     labels: ['Pending', 'Completed'],

  //     datasets: [
  //       {
  //         data: [data.pending, data.completed],

  //         backgroundColor: [
  //           documentStyle.getPropertyValue('--p-orange-500'),
  //           documentStyle.getPropertyValue('--p-green-500'),
  //         ],

  //         hoverBackgroundColor: [
  //           documentStyle.getPropertyValue('--p-orange-400'),
  //           documentStyle.getPropertyValue('--p-green-400'),
  //         ],
  //       },
  //     ],
  //   };
  // });

  // chartOptions = {
  //   cutout: '60%',
  //   plugins: {
  //     legend: {
  //       labels: {},
  //     },
  //   },
  // };
  data = input<{ label: string; value: number; color?: string }[]>();
  title = input<string>('');

  chartData = computed(() => {
    const items = this.data();
    if (!items?.length) return null;

    const documentStyle = getComputedStyle(document.documentElement);

    const defaultColors = [
      '--p-orange-500',
      '--p-green-500',
      '--p-blue-500',
      '--p-purple-500',
      '--p-red-500',
      '--p-yellow-500',
    ];
    const defaultHovers = [
      '--p-orange-400',
      '--p-green-400',
      '--p-blue-400',
      '--p-purple-400',
      '--p-red-400',
      '--p-yellow-400',
    ];

    return {
      labels: items.map((i) => i.label),
      datasets: [
        {
          data: items.map((i) => i.value),
          backgroundColor: items.map(
            (i, idx) =>
              i.color ?? documentStyle.getPropertyValue(defaultColors[idx % defaultColors.length]),
          ),
          hoverBackgroundColor: items.map((_, idx) =>
            documentStyle.getPropertyValue(defaultHovers[idx % defaultHovers.length]),
          ),
        },
      ],
    };
  });

  chartOptions = {
    cutout: '60%',
    plugins: { legend: { labels: {} } },
  };
}
