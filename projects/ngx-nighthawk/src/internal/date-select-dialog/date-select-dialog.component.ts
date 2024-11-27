import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { NighthawkButtonDirective } from '../../public-api';
import { NighthawkDateSelectorComponent } from '../../lib/components/date-selector/date-selector.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    NighthawkButtonDirective,
    NighthawkDateSelectorComponent,
  ],
  selector: 'nighthawk-date-select-dialog',
  templateUrl: 'date-select-dialog.component.html',
  styleUrls: ['./date-select-dialog.component.scss'],
})
export class NighthawkDateSelectDialogComponent {
  public method: 'date' | 'range' = 'date';
  public years: { name: string; value: number }[] = [];

  public selectedDate: Date | undefined;
  public startDate: Date | undefined;
  public endDate: Date | undefined;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(DIALOG_DATA) public data: any,
    public dialogRef: DialogRef<any>
  ) {
    for (let i = 2024; i > 1943; i--) {
      this.years.push({ name: '' + i, value: i });
    }

    this.selectedDate = this.data?.selectedDate;
    this.startDate = this.data?.startDate;
    this.endDate = this.data?.endDate;
  }

  public submit(): void {
    if (this.method === 'date') {
      this.dialogRef.close({ selectedDate: this.selectedDate });
    } else {
      this.dialogRef.close({
        startDate: this.startDate,
        endDate: this.endDate,
      });
    }
  }

  public clear(): void {
    this.dialogRef.close('clear');
  }
}
