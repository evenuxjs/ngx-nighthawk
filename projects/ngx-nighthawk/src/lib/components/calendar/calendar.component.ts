import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  output,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'nighthawk-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class NighthawkCalendarComponent implements OnInit, OnChanges {
  @Input() month: number = 0;
  @Input() year: number = new Date().getUTCFullYear();
  @Input() size: 'large' | 'small' = 'small';
  @Input() startDayOfWeek: number = 1; // Default to Monday (0 is Sunday, 1 is Monday, and so on)
  @Input() dayNames: string[] = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ];
  readonly selectedDay = output<{
    day: number;
    month: number;
    year: number;
  }>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public weeks: any[][] = [];

  public ngOnInit(): void {
    this.generateCalendar();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['month'] || changes['year']) {
      this.generateCalendar();
    }
  }

  public generateCalendar(): void {
    this.weeks = [];

    const firstDayOfMonth = new Date(this.year, this.month - 1, 1);
    const daysInMonth = new Date(this.year, this.month, 0).getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday, 1 is Monday, and so on

    let currentDay = 1;

    const daysUntilStart = (startingDayOfWeek - this.startDayOfWeek + 7) % 7;

    // Calculate the days from the previous month
    const prevMonthLastDay = new Date(this.year, this.month - 1, 0).getDate();
    const prevMonthDays = Array.from(
      { length: daysUntilStart },
      (_, i) => prevMonthLastDay - i
    ).reverse();

    // Calculate the days from the next month
    const totalDaysInCalendar = daysInMonth + daysUntilStart;
    const daysAfterEnd =
      totalDaysInCalendar % 7 === 0 ? 0 : 7 - (totalDaysInCalendar % 7);
    const nextMonthDays = Array.from({ length: daysAfterEnd }, (_, i) => i + 1);

    for (let i = 0; i < 6; i++) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const week: any[] = [];

      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < daysUntilStart) {
          week.push({
            month: this.month === 1 ? 12 : this.month - 1,
            number: prevMonthDays[j],
          }); // Days from the previous month
        } else if (currentDay > daysInMonth) {
          week.push({
            month: this.month === 12 ? 1 : this.month + 1,
            number: nextMonthDays.shift(),
          }); // Days from the next month
        } else {
          week.push({ month: this.month, number: currentDay });
          currentDay++;
        }
      }

      const validDays = week.filter((d) => !!d.number);
      if (validDays.length > 0) this.weeks.push(week);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public selectDay(day: any): void {
    if (day.month === this.month) {
      this.selectedDay.emit({
        day: day.number,
        month: this.month,
        year: this.year,
      });
    }
  }
}
