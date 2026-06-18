import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/dashboard/ui/header/header.component";
import { SidebarComponent } from "../../../shared/components/dashboard/ui/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent {}
