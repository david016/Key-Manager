import { NgModule } from "@angular/core";

import { ApiKeysPageComponent } from "./api-keys-page/api-keys-page.component";
import { ApiKeysRoutingModule } from "./api-keys-routing.module";
import { SharedModule } from "../shared/shared.module";
import { SharedForKeysModule } from "../shared-for-keys/shared-for-keys.module";

@NgModule({
  declarations: [ApiKeysPageComponent],
  imports: [SharedModule, ApiKeysRoutingModule, SharedForKeysModule],
})
export class ApiKeysModule {}
