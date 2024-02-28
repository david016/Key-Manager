import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DbUser } from "src/app/models/dbUser";
import { UserService } from "../user.service";

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
})
export class UserEditComponent implements OnInit {
  @Input() user: DbUser;

  userForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: [this.user.username || ""],
      email: [this.user.email || ""],
      name: [this.user.name || ""],
      surname: [this.user.surname || ""],
      age: [this.user.age],
      address: [this.user.address || ""],
      city: [this.user.city || ""],
      country: [this.user.country || ""],
      postalCode: [this.user.postalCode || ""],
      aboutMe: [this.user.aboutMe || ""],
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      const user = new DbUser(this.user.uId, this.user.email);
      Object.assign(user, formData);

      this.userService.editUser(user).subscribe();
    }
  }
}
