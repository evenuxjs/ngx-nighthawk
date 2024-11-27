import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'nighthawk-table-sort',
  templateUrl: 'table-sort.component.html',
  styleUrl: 'table-sort.component.scss',
  standalone: true,
})
export class NighthawkTableSortComponent {
  @Input() currentField: string = '';
  @Input() config!: {
    fields: { name: string; sortEnabled: boolean; searchEnabled: boolean }[];
    currentSortField: string;
    currentSortDirection: 'asc' | 'desc' | '';
    searchQueryParams: any;
  };

  readonly onSortChange = output<{
    sortField: string;
    sortDirection: 'asc' | 'desc' | '';
}>({ alias: 'onSortChange' });

  public changeSortState(): void {
    if (this.config.currentSortField !== this.currentField) {
      this.config.currentSortDirection = '';
      this.config.currentSortField = this.currentField;
    }

    switch (this.config.currentSortDirection) {
      case '': {
        this.config.currentSortDirection = 'desc';
        break;
      }

      case 'desc': {
        this.config.currentSortDirection = 'asc';
        break;
      }

      case 'asc': {
        this.config.currentSortDirection = '';
        break;
      }
    }

    this.onSortChange.emit({
      sortField: this.config.currentSortField,
      sortDirection: this.config.currentSortDirection,
    });
  }
}
