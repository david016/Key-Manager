import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Key } from "../../models/key";
import { KeyType } from "../../models/key-types";
import { KeyService } from "src/app/services/key.service";

@Component({
  selector: "app-key-item",
  templateUrl: "./key-item.component.html",
  styleUrls: ["./key-item.component.scss"],
})
export class KeyItemComponent implements OnInit {
  @Input() key: Key;
  @Input() type: KeyType;
  @Output() editEvent = new EventEmitter<Key>();
  public KeyType = KeyType;

  constructor(private keyService: KeyService) {}

  ngOnInit(): void {}

  onEdit(key: Key) {
    this.editEvent.emit(key);
  }

  onDelete() {
    this.keyService.deleteKey(this.key.keyId, this.type).subscribe({
      error: (error) => {
        console.log("Error occurred while deleting:", error);
      },
    });
  }

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear().toString().substr(-2); // get last two digits of year

    return `${day}.${month}.${year}`;
  }
}
