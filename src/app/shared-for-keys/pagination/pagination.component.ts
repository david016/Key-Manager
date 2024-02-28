import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() keysPerPage: number;
  @Input() countOfKeys = 0;
  @Output() pageChanged = new EventEmitter<number>();

  currentPage = 1;
  numberOfPages: number;
  iterationArray: any[];

  constructor() {}

  ngOnInit(): void {
    this.numberOfPages = Math.ceil(this.countOfKeys / this.keysPerPage);
    this.iterationArray = Array(this.numberOfPages).fill(0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.countOfKeys || changes.keysPerPage) {
      this.numberOfPages = Math.ceil(this.countOfKeys / this.keysPerPage);
    }
  }

  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.pageChanged.emit(pageNumber);
  }

  isPageActive(pageNumber: number): boolean {
    return this.currentPage === pageNumber;
  }
}
