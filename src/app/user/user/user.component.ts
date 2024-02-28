import { Component, OnDestroy, OnInit } from "@angular/core";
import { DbUser } from "src/app/models/dbUser";
import { UserService } from "../user.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit, OnDestroy {
  user: DbUser;
  private userSub: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userSub = this.userService.dbUser.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
