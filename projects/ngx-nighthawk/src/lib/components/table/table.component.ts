import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  TemplateRef,
  Input,
  OnInit,
  ViewContainerRef,
  Inject,
  PLATFORM_ID,
  contentChildren,
  output,
  AfterContentInit,
} from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { NighthawkTableSortComponent } from '../../../internal/table-sort/table-sort.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import queryString from 'query-string';
import { FormsModule } from '@angular/forms';
import moment from 'moment-timezone';
import { NighthawkSelectComponent } from '../select/select.component';
import { NighthawkFormControlDirective } from '../../directives/form-control.directive';
import { NighthawkButtonDirective } from '../../directives/button.directive';
import { NighthawkPaginationComponent } from '../pagination/pagination.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NighthawkDialogService } from '../../services/dialog.service';
import { NighthawkDateSelectDialogComponent } from '../../../internal/date-select-dialog/date-select-dialog.component';
import { NighthawkBootstrapService } from '../../services/bootstrap.service';

@Component({
  selector: 'nighthawk-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    CdkTableModule,
    DragDropModule,
    NighthawkTableSortComponent,
    NighthawkSelectComponent,
    NighthawkFormControlDirective,
    NighthawkButtonDirective,
    NighthawkPaginationComponent,
  ],
  standalone: true,
})
export class NighthawkTableComponent implements OnInit, AfterContentInit {
  @Input() config!: {
    fields: {
      name: string;
      headerDefinition?: string;
      header2Definition?: string;
      bodyDefinition?: string;
      sortEnabled: boolean;
      searchEnabled: boolean;
      searchType: string;
      searchValue?: string;
      width?: number | string | 'auto';
    }[];
    currentSortField: string;
    currentSortDirection: 'asc' | 'desc' | '';
    searchQueryParams: any;
    page: number;
    perPage: number;
    total?: number;
  };

  @Input() data: any[] = [];

  @Input() fetchUrl: string = '';

  @Input() showPerPage: boolean = true;

  @Input() showTotal: boolean = true;

  @Input() filtersEnabled: boolean = true;

  @Input() footerEnabled: boolean = true;

  @Input() allowReorder: boolean = false;

  @Input() maxTableHeight: number = 740;

  @Input() language = {
    showFilters: 'Show filters',
    collapse: 'Collapse',
    expand: 'Expand',
    sortByField: 'Sort by field',
    sortByDirection: 'Sort direction',
    searchField: 'Search field',
    searchValue: 'Search value',
    submit: 'Submit',
    clear: 'Clear',
    perPage: 'Per page',
    total: 'Total',
  };

  readonly onTableChange = output<{
    fields: {
      name: string;
      sortEnabled: boolean;
      searchEnabled: boolean;
      searchType: string;
    }[];
    currentSortField: string;
    currentSortDirection: 'asc' | 'desc' | '';
    searchQueryParams: any;
    page: number;
    perPage: number;
    total?: number;
  }>();

  readonly onQueryData = output<{
    currentSortField: string;
    currentSortDirection: 'asc' | 'desc' | '';
    searchQueryParams: any;
    data: any[];
  }>();

  readonly headers = contentChildren<TemplateRef<any>>('header', {
    descendants: true,
  });

  readonly cells = contentChildren<TemplateRef<any>>('cell', {
    descendants: true,
  });

  public sortByOptions: { name: string; field: string }[] = [];
  public sortDirectionOptions: { name: string; direction: string }[] = [
    { name: 'Ascending', direction: 'asc' },
    { name: 'Descending', direction: 'desc' },
  ];

  public searchFieldOptions: { name: string; field: string }[] = [];
  public headerLabels: string[] = [];
  public displayFilters: boolean = false;

  public sortByValue: string = '';
  public sortDirectionValue: string = '';
  public searchFieldValue: string = '';
  public searchTermValue: string = '';

  public headerCellDefinitions: string[] = [];
  public header2CellDefinitions: string[] = [];
  public cellBodyDefinitions: string[] = [];

  public perPageOptions: { name: string; value: number }[] = [
    { name: '10', value: 10 },
    { name: '25', value: 25 },
    { name: '50', value: 50 },
    { name: '100', value: 100 },
  ];

  public isBrowser: boolean = false;

  private searchSubject = new Subject<{ field: string; value: string }>();
  private currentRequestId: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformid: object,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialogService: NighthawkDialogService,
    private readonly nighthawk: NighthawkBootstrapService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformid);
  }

  public ngOnInit(): void {
    for (const field of this.config.fields) {
      field.headerDefinition = field.name + 'Header';
      field.header2Definition = field.name + 'Header2';
      field.bodyDefinition = field.name + 'Body';

      this.headerCellDefinitions.push(field.headerDefinition);
      this.header2CellDefinitions.push(field.header2Definition);
      this.cellBodyDefinitions.push(field.bodyDefinition);
    }

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => prev.value === curr.value)
      )
      .subscribe(({ field, value }) => {
        const currentPath = this.router.url.split('?')[0];
        this.router.navigate([currentPath], {
          queryParams: { [field]: value, page: 1 },
          queryParamsHandling: 'merge',
        });
      });

    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const { page, limit, sort, direction, ...filters } = queryParams;

      // Set table config values
      this.config.page = page || this.config.page || 1;
      this.config.perPage = limit || this.config.perPage || 10;
      this.config.currentSortField = sort;
      this.config.currentSortDirection = direction;

      // Set mobile filter values
      this.sortByValue = sort;
      this.sortDirectionValue = direction;
      this.searchFieldValue = Object.keys(filters)[0] || '';
      this.searchTermValue = filters[0] || '';

      // Emit changes
      this.onTableChange.emit(this.config);
      this.onQueryData.emit({
        currentSortField: this.config.currentSortDirection,
        currentSortDirection: this.config.currentSortDirection,
        searchQueryParams: this.config.searchQueryParams,
        data: this.data,
      });

      // Reset desktop filters
      this.config.searchQueryParams = {};

      // Reset input values
      for (const field of this.config.fields) {
        field.searchValue = '';
      }

      // Assign selected desktop filters
      let i = 0;
      for (const field of Object.keys(filters)) {
        if (filters[field]) {
          this.config.searchQueryParams[field] = filters[field];

          const configFieldRef = this.config.fields.find(
            (f) => f.name === field
          );

          if (configFieldRef) {
            configFieldRef.searchValue = filters[field];
          }
          i++;
        }
      }

      this.fetchData();
    });
  }

  public ngAfterContentInit() {
    this.headers().forEach((headerTemplate) => {
      const view = this.viewContainerRef.createEmbeddedView(headerTemplate);
      const textContent = view.rootNodes
        .map((node) => node.textContent)
        .join('');

      this.headerLabels.push(textContent);
      view.destroy();
    });

    this.headerLabels.forEach((definition, index) => {
      const option = {
        name: definition,
        field: this.config.fields[index].name,
      };

      this.sortByOptions.push(option);
      this.searchFieldOptions.push(option);
    });
  }

  public onDrop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    this.data = [...this.data];
  }

  public submitFilters(): void {
    const currentPath = this.router.url.split('?')[0];
    this.router.navigate([currentPath], {
      queryParams: {
        sort: this.sortByValue,
        direction: this.sortDirectionValue,
        [this.searchFieldValue]: this.searchTermValue,
      },
      queryParamsHandling: 'merge',
    });
  }

  public clearFilters(): void {
    const currentPath = this.router.url.split('?')[0];
    this.router.navigate([currentPath], {
      queryParams: {},
      queryParamsHandling: 'replace',
    });
  }

  public clearSearchForField(fieldName: string): void {
    const currentPath = this.router.url.split('?')[0];
    this.router.navigate([currentPath], {
      queryParams: { [fieldName]: null },
      queryParamsHandling: 'merge',
    });
  }

  public openDateSelectDialog(fieldName: string): void {
    const dateString = this.config.searchQueryParams[fieldName];
    const dialogData: any = {};

    if (dateString) {
      const dates = dateString.split('-');

      if (dates[0] === dates[1]) {
        const dateStringParts0 = dates[0].split('.');

        dialogData.selectedDate = new Date(
          `${dateStringParts0[2]}-${dateStringParts0[1]}-${dateStringParts0[0]}`
        );
      } else {
        const dateStringParts0 = dates[0].split('.');
        const dateStringParts1 = dates[1].split('.');

        dialogData.startDate = new Date(
          `${dateStringParts0[2]}-${dateStringParts0[1]}-${dateStringParts0[0]}`
        );

        dialogData.endDate = new Date(
          `${dateStringParts1[2]}-${dateStringParts1[1]}-${dateStringParts1[0]}`
        );
      }
    }

    const ref = this.dialogService.open(NighthawkDateSelectDialogComponent, {
      closeOnNavigation: true,
      disableClose: true,
      data: dateString ? dialogData : undefined,
    });

    ref.closed.pipe(take(1)).subscribe((response: any) => {
      if (response === 'clear') {
        const currentPath = this.router.url.split('?')[0];
        this.router.navigate([currentPath], {
          queryParams: {
            [fieldName]: '',
          },
          queryParamsHandling: 'merge',
        });
      } else if (response) {
        let dateString;

        const timezone =
          this.nighthawk.config.timezone === 'guess'
            ? moment.tz.guess()
            : this.nighthawk.config.timezone;

        if (response && response.selectedDate) {
          const date = moment(response.selectedDate)
            .tz(timezone)
            .format('DD.MM.YYYY');

          dateString = `${date}-${date}`;
        } else if (response && response.startDate && response.endDate) {
          const start = moment(response.startDate)
            .tz(timezone)
            .format('DD.MM.YYYY');

          const end = moment(response.endDate)
            .tz(timezone)
            .format('DD.MM.YYYY');

          dateString = `${start}-${end}`;
        }

        const currentPath = this.router.url.split('?')[0];
        const params: any = {};
        params[fieldName] = dateString;

        this.router.navigate([currentPath], {
          queryParams: params,
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  public onSortChange(sortData: {
    sortField: string;
    sortDirection: 'asc' | 'desc' | '';
  }): void {
    const currentPath = this.router.url.split('?')[0];
    this.router.navigate([currentPath], {
      queryParams: {
        sort: sortData.sortField,
        direction: sortData.sortDirection,
      },
      queryParamsHandling: 'merge',
    });
  }

  public onSearchField(event: any, field: string): void {
    const value = event.target.value;
    this.searchSubject.next({ field, value });
  }

  public onSelectPage(pageNumber: number): void {
    this.config.page = pageNumber;
    const currentPath = this.router.url.split('?')[0];
    this.router.navigate([currentPath], {
      queryParams: { page: pageNumber },
      queryParamsHandling: 'merge',
    });
  }

  public fetchData(): void {
    if (this.fetchUrl) {
      const copyOfCellDefinitions = this.cellBodyDefinitions;
      this.cellBodyDefinitions = [];
      this.data = [];

      const requestId = ++this.currentRequestId;
      const query = queryString.stringify({
        sort: this.config.currentSortField,
        direction: this.config.currentSortDirection,
        page: this.config.page,
        limit: this.config.perPage,
        ...this.config.searchQueryParams,
      });

      this.http
        .get<any>(`${this.fetchUrl}?${query}`)
        .pipe(take(1))
        .subscribe((response) => {
          if (this.currentRequestId === requestId) {
            this.data = response.data;
            this.config.total = response.total ?? this.config.total;
            this.cellBodyDefinitions = copyOfCellDefinitions;

            this.onQueryData.emit({
              currentSortField: this.config.currentSortDirection,
              currentSortDirection: this.config.currentSortDirection,
              searchQueryParams: this.config.searchQueryParams,
              data: this.data,
            });
          }
        });
    }
  }
}
