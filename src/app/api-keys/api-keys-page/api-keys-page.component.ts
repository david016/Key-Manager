import { Component } from "@angular/core";
import { KeyType } from "src/app/models/key-types";

@Component({
  selector: "app-api-keys-page",
  templateUrl: "./api-keys-page.component.html",
  styleUrls: ["./api-keys-page.component.scss"],
})
export class ApiKeysPageComponent {
  type = KeyType.apiKey;

  constructor() {}
}
