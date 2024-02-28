import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import Chart from "chart.js";

@Component({
  selector: "app-pie-chart",
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.scss"],
})
export class PieChartComponent implements OnInit {
  public chart: any;
  constructor() {}

  ngOnInit(): void {
    this.createChart();
  }

  createChart() {
    this.chart = new Chart("MyPieChart", {
      type: "pie",

      data: {
        // values on X-Axis
        labels: ["Api Keys", "Licence Keys"],
        datasets: [
          {
            label: "Dataset 1",
            data: [10, 15],
            backgroundColor: ["blue", "yellow"],
          },
        ],
      },
      options: {},
    });
  }
}
