import { Component, OnInit } from "@angular/core";
import { KeyType } from "src/app/models/key-types";

@Component({
  selector: "app-licence-keys",
  templateUrl: "./licence-keys.component.html",
  styleUrls: ["./licence-keys.component.scss"],
})
export class LicenceKeysComponent implements OnInit {
  type = KeyType.licenceKey;

  constructor() {}

  ngOnInit(): void {}
}
