import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";
import Chart from "chart.js";
import { ApiKey } from "src/app/api-keys/api-key.model";
import { LicenceKey } from "src/app/licence-keys/licence-key.model";

const API_KEY_COLOR = "rgba(255, 99, 132, 0.2)";
const API_KEY_BORDER_COLOR = "rgba(255, 99, 132, 1)";
const LICENCE_KEY_COLOR = "rgba(54, 162, 235, 0.2)";
const LICENCE_KEY_BORDER_COLOR = "rgba(54, 162, 235, 1)";

@Component({
  selector: "app-bar-chart",
  templateUrl: "./bar-chart.component.html",
  styleUrls: ["./bar-chart.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent implements AfterViewInit {
  @Input() nameOfChart: string;
  @Input() apiKeys?: ApiKey[];
  @Input() licenceKeys: LicenceKey[];
  @Input() type: "created" | "expire";
  @Input() numberOfDays: number;
  @ViewChild("myBarChart", { static: false })
  myBarChart: ElementRef<HTMLCanvasElement>;

  uniqueId: string;
  organizedApiKeys: { [date: string]: (ApiKey | LicenceKey)[] };
  organizedLicenceKeys: { [date: string]: (ApiKey | LicenceKey)[] };
  public chart: Chart;

  constructor() {}

  ngAfterViewInit() {
    this.organizedLicenceKeys = this.organizeKeysByDate(this.licenceKeys);

    const licenceKeysCount = this.getKeyCounts(this.organizedLicenceKeys);
    const apiKeysCount = this.apiKeys
      ? this.getKeyCounts(this.organizeKeysByDate(this.apiKeys))
      : null;

    this.createChart(licenceKeysCount, apiKeysCount);
  }

  private getKeyCounts(keys: { [date: string]: (ApiKey | LicenceKey)[] }) {
    return this.getDays(this.numberOfDays).map(
      (date) => keys[date]?.length || 0
    );
  }

  organizeKeysByDate(keys: (ApiKey | LicenceKey)[]): {
    [date: string]: (ApiKey | LicenceKey)[];
  } {
    const organizedKeys: { [date: string]: (ApiKey | LicenceKey)[] } = {};

    keys.forEach((key) => {
      let dateKey: string;

      if (this.type === "created") {
        dateKey = this.formatDate(key.createdAt);
      } else if (this.type === "expire" && "expireAt" in key) {
        dateKey = this.formatDate((key as LicenceKey).expireAt);
      } else {
        return;
      }

      if (!organizedKeys[dateKey]) {
        organizedKeys[dateKey] = [];
      }
      organizedKeys[dateKey].push(key);
    });

    return organizedKeys;
  }

  createChart(licenseKeysCount: number[], apiKeysCount: number[]) {
    const licenceKeyDataset = this.createDataset(
      "Licence Keys",
      licenseKeysCount,
      LICENCE_KEY_COLOR,
      LICENCE_KEY_BORDER_COLOR
    );
    const datasets = [licenceKeyDataset];

    if (apiKeysCount) {
      const apiKeyDataset = this.createDataset(
        "Api Keys",
        apiKeysCount,
        API_KEY_COLOR,
        API_KEY_BORDER_COLOR
      );
      datasets.push(apiKeyDataset);
    }

    this.chart = new Chart(this.myBarChart.nativeElement, {
      type: "bar",
      data: {
        labels: this.getDays(this.numberOfDays),
        datasets: datasets,
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        legend: { display: true },
        title: {
          display: true,
          text: this.nameOfChart,
        },
      },
    });
  }

  private createDataset(
    label: string,
    data: number[],
    backgroundColor: string,
    borderColor: string
  ) {
    return {
      label,
      data,
      backgroundColor: Array(data.length).fill(backgroundColor),
      borderColor: Array(data.length).fill(borderColor),
      borderWidth: 1,
    };
  }

  private getDays(numOfDays: number): string[] {
    let today = new Date();
    let days: string[] = [];

    if (this.type === "expire") {
      today.setDate(today.getDate() + 1);
    } else {
      today.setDate(today.getDate() - numOfDays + 1);
    }

    for (let i = 0; i < numOfDays; i++) {
      days.push(this.formatDate(today));
      today.setDate(today.getDate() + 1);
    }

    return days;
  }

  private formatDate(input: Date | number): string {
    let date: Date;

    if (typeof input === "number") {
      date = new Date(input);
    } else {
      date = input;
    }

    let day = date.getDate().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear().toString().slice(2);

    return `${day}.${month}.${year}`;
  }
}
