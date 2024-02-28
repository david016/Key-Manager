import { Component, Input, OnInit } from "@angular/core";
import { DbUser } from "src/app/models/dbUser";

@Component({
  selector: "app-user-card",
  templateUrl: "./user-card.component.html",
  styleUrls: ["./user-card.component.scss"],
})
export class UserCardComponent implements OnInit {
  @Input() user: DbUser;
  constructor() {}

  ngOnInit(): void {}
}
