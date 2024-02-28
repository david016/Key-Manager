import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ApiKeysPageComponent } from "./api-keys-page/api-keys-page.component";
import { AuthGuard } from "../auth/auth.guard";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: ApiKeysPageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApiKeysRoutingModule {}
