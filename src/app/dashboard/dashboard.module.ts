import { NgModule } from "@angular/core";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SharedModule } from "../shared/shared.module";
import { BarChartComponent } from "../charts/bar-chart/bar-chart.component";

@NgModule({
  declarations: [DashboardComponent, BarChartComponent],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
