import { Component , Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';

export interface SkeletonColumn {
  header?: string;
  width?: string;
  height?: string;
  shape?: 'rectangle' | 'circle';
  borderRadius?: string;
}

@Component({
  selector: 'app-table-skeleton',
 imports: [TableModule, SkeletonModule],
  templateUrl: './table-skeleton.component.html',
  styleUrl: './table-skeleton.component.scss',
})
export class TableSkeletonComponent {
  @Input() columns: SkeletonColumn[] = [];
  @Input() rows = 6;
  get skeletonRows() {
    return Array(this.rows).fill({});
  }
}
