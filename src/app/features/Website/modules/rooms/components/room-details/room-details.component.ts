import { Component } from '@angular/core';
import { WebsitePageHeadingComponent } from "../../../../../../shared/components/website/ui/website-page-heading/website-page-heading.component";
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-room-details',
  imports: [WebsitePageHeadingComponent],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.scss',
})
export class RoomDetailsComponent {
  breadcrumbs: MenuItem[] = [
    {
      label: 'Rooms',
      routerLink: '/rooms'
    },
    {
      label: 'Room Details'
    }
  ];
}
