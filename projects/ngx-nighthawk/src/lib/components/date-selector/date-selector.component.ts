import { Component, Input, Output, EventEmitter, forwardRef, OnInit, inject } from "@angular/core";
import { NighthawkDropdownComponent } from "../dropdown/dropdown.component";
import { NighthawkControlledDropdownTriggerDirective } from "../../directives/controlled-dropdown-trigger-for.directive";
import { NighthawkCalendarComponent } from "../calendar/calendar.component";
import { NighthawkSelectComponent } from "../select/select.component";
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { NighthawkButtonDirective } from "../../directives/button.directive";
import { CommonModule } from "@angular/common";
import { NighthawkBootstrapService } from "../../services/bootstrap.service";

@Component({
  standalone: true,
  selector: "nighthawk-date-selector",
  templateUrl: "./date-selector.component.html",
  styleUrls: ["./date-selector.component.scss"],
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
export class NighthawkDateSelectorComponent implements ControlValueAccessor, OnInit {
  private readonly bootstrapService = inject(NighthawkBootstrapService);

  @Input() color: "primary" | "secondary" | "light" | "dark" | "transparent" = "transparent";
  @Input() size: "large" | "medium" | "small" = "medium";
  @Input() border = false;
  @Input() rounded = false;
  @Input() fullWidth = false;
  @Input() textAlign: "start" | "center" | "end" = "start";
  @Input() selectedDate!: Date;
  @Input() selectedMonth = 1;
  @Input() selectedYear = 2025;
  @Input() monthOptions: any[] = [];
  @Input() yearOptions: any[] = [];
  @Input() closeOnSelectDate = true;
  @Input() buttonClasses = "";
  @Input() closeButtonText = "Close";
  @Input() buttonSelectDateText = "Select a date";
  @Input() buttonSelectMonthText = "Select a month";
  @Input() buttonSelectYearText = "Select a year";
  @Input() dateFormatExpression = "dd.MM.yyyy";
  @Input() dropdownOffset = "8px";
  @Input() showMonthSelector = true;
  @Input() showYearSelector = true;
  @Input() dayNames: string[] = ["M", "T", "W", "T", "F", "S", "S"];
  @Input() monthNames: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  @Output() dateSelected: EventEmitter<Date> = new EventEmitter<Date>();

  public showCalendarDropdown = false;

  constructor() {
    const translations = this.bootstrapService.getTranslations();
    if (translations) {
      this.dayNames = [
        translations.weekDaysShort.monday,
        translations.weekDaysShort.tuesday,
        translations.weekDaysShort.wednesday,
        translations.weekDaysShort.thursday,
        translations.weekDaysShort.friday,
        translations.weekDaysShort.saturday,
        translations.weekDaysShort.sunday,
      ];

      this.monthNames = [
        translations.monthNames.january,
        translations.monthNames.february,
        translations.monthNames.march,
        translations.monthNames.april,
        translations.monthNames.may,
        translations.monthNames.june,
        translations.monthNames.july,
        translations.monthNames.august,
        translations.monthNames.september,
        translations.monthNames.october,
        translations.monthNames.november,
        translations.monthNames.december,
      ];

      this.closeButtonText = translations.dateSelector.closeButtonText;
      this.buttonSelectDateText = translations.dateSelector.buttonSelectDateText;
      this.buttonSelectMonthText = translations.dateSelector.buttonSelectMonthText;
      this.buttonSelectYearText = translations.dateSelector.buttonSelectYearText;
    }

    this.monthOptions = this.monthNames.map((name, index) => ({
      name,
      value: index + 1,
    }));

    const currentYear = new Date().getUTCFullYear();
    for (let year = 2020; year <= currentYear; year++) {
      this.yearOptions.push({
        name: "" + year,
        value: year,
      });
    }
  }

  ngOnInit(): void {
    if (this.selectedDate) {
      this.setMonthAndYearFromDate(this.selectedDate);
    } else {
      const currentDate = new Date();
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

  /* eslint-disable @typescript-eslint/no-unused-vars */
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
