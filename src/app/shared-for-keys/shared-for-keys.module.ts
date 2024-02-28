import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { KeyTableComponent } from "./key-table/key-table.component";
import { KeyFormComponent } from "./key-form/key-form.component";
import { KeyItemComponent } from "./key-item/key-item.component";
import { PaginationComponent } from "./pagination/pagination.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    KeyTableComponent,
    KeyFormComponent,
    KeyItemComponent,
    PaginationComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    KeyTableComponent,
    KeyFormComponent,
    KeyItemComponent,
    PaginationComponent,
  ],
})
export class SharedForKeysModule {}
