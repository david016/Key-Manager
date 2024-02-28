import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "./navbar/navbar.component";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { LineChartComponent } from "../charts/line-chart/line-chart.component";
import { PieChartComponent } from "../charts/pie-chart/pie-chart.component";

@NgModule({
  declarations: [PieChartComponent, LineChartComponent, NavbarComponent],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [
    NavbarComponent,
    CommonModule,
    LineChartComponent,
    PieChartComponent,
  ],
})
export class SharedModule {}
