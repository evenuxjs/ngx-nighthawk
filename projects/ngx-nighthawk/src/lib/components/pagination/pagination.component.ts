import {
  Component,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
  SimpleChanges,
  OnChanges,
  output
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'nighthawk-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class NighthawkPaginationComponent implements AfterViewInit, OnChanges {
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 1;
  @Input() itemsPerPage: number = 20;

  public totalPages: number = 1;
  public isPaginationCreated: boolean = false;

  readonly pageChange = output<number>();

  public visiblePages: number[] = [];

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    this.createPagination();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.createPagination();
  }

  public createPagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    if (this.totalPages <= 3) {
      this.visiblePages = Array.from(
        { length: this.totalPages },
        (_, i) => Number(i) + 1
      );
    } else if (this.currentPage <= 2) {
      this.visiblePages = [1, 2, 3];
    } else if (this.currentPage >= this.totalPages - 1) {
      this.visiblePages = [
        Number(this.totalPages) - 2,
        Number(this.totalPages) - 1,
        Number(this.totalPages),
      ];
    } else {
      this.visiblePages = [
        Number(this.currentPage) - 1,
        Number(this.currentPage),
        Number(this.currentPage) + 1,
      ];
    }

    if (this.currentPage === this.totalItems - 1) {
      delete this.visiblePages[2];
    }

    this.isPaginationCreated = true;
    this.cdRef.detectChanges();
  }

  public goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageChange.emit(pageNumber);
      this.currentPage = pageNumber;
      this.createPagination();
    }
  }

  public prevPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(Number(this.currentPage) - 1);
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(Number(this.currentPage) + 1);
    }
  }
}
