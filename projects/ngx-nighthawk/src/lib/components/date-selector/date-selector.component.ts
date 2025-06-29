import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { NighthawkDropdownComponent } from '../dropdown/dropdown.component';
import { NighthawkControlledDropdownTriggerDirective } from '../../directives/controlled-dropdown-trigger-for.directive';
import { NighthawkCalendarComponent } from '../calendar/calendar.component';
import { NighthawkSelectComponent } from '../select/select.component';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';
import { NighthawkButtonDirective } from '../../directives/button.directive';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'nighthawk-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    NighthawkButtonDirective,
    NighthawkControlledDropdownTriggerDirective,
    NighthawkSelectComponent,
    NighthawkCalendarComponent,
    NighthawkDropdownComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NighthawkDateSelectorComponent),
      multi: true,
    },
  ],
})
export class NighthawkDateSelectorComponent implements ControlValueAccessor {
  @Input() color: 'primary' | 'secondary' | 'light' | 'dark' | 'transparent' =
    'transparent';
  @Input() size: 'large' | 'medium' | 'small' = 'medium';
  @Input() border: boolean = false;
  @Input() rounded: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() textAlign: 'start' | 'center' | 'end' = 'start';
  @Input() closeButtonText: string = 'Close';
  @Input() selectedDate!: Date;
  @Input() selectedMonth: number = 1;
  @Input() selectedYear: number = 2025;
  @Input() monthOptions: any[] = [];
  @Input() yearOptions: any[] = [];
  @Input() closeOnSelectDate: boolean = true;
  @Input() buttonClasses: string = '';
  @Input() buttonSelectDateText: string = 'Select a date';
  @Input() buttonCloseText: string = 'Close';
  @Input() buttonSelectMonthText: string = 'Select month';
  @Input() buttonSelectYearText: string = 'Select year';
  @Input() dateFormatExpression: string = 'dd.MM.yyyy';
  @Input() dropdownOffset: string = '8px';
  @Input() showMonthSelector: boolean = true;
  @Input() showYearSelector: boolean = true;
  @Input() dayNames: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  @Output() dateSelected: EventEmitter<Date> = new EventEmitter<Date>();

  public showCalendarDropdown: boolean = false;

  constructor() {
    this.monthOptions = [
      { name: 'January', value: 1 },
      { name: 'February', value: 2 },
      { name: 'March', value: 3 },
      { name: 'April', value: 4 },
      { name: 'May', value: 5 },
      { name: 'June', value: 6 },
      { name: 'July', value: 7 },
      { name: 'August', value: 8 },
      { name: 'September', value: 9 },
      { name: 'October', value: 10 },
      { name: 'November', value: 11 },
      { name: 'December', value: 12 },
    ];

    const currentYear = new Date().getUTCFullYear();
    for (let year = 2020; year <= currentYear; year++) {
      this.yearOptions.push({
        name: '' + year,
        value: year,
      });
    }
  }

  ngOnInit(): void {
    const currentDate = new Date();

    if (this.selectedDate) {
      this.setMonthAndYearFromDate(this.selectedDate);
    } else if (!this.selectedMonth || !this.selectedYear) {
      this.selectedMonth = currentDate.getMonth() + 1;
      this.selectedYear = currentDate.getFullYear();
    }
  }

  private setMonthAndYearFromDate(date: Date): void {
    this.selectedMonth = date.getMonth() + 1;
    this.selectedYear = date.getFullYear();
  }

  public onSelectDay(date: any): any {
    if (this.closeOnSelectDate) {
      this.showCalendarDropdown = false;
    }

    this.selectedDate = new Date(date.year, date.month - 1, date.day);
    this.setMonthAndYearFromDate(this.selectedDate);
    this.onChange(this.selectedDate);
    this.dateSelected.emit(this.selectedDate);
  }

  public close(): void {
    this.showCalendarDropdown = false;
  }

  private onChange = (date: Date) => {};

  private onTouched = () => {};

  writeValue(date: Date): void {
    if (date) {
      this.selectedDate = date;
      this.setMonthAndYearFromDate(date);
    }
  }

  registerOnChange(fn: (date: Date) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
