import { Component, Input, inject } from "@angular/core";
import { DialogRef, DIALOG_DATA } from "@angular/cdk/dialog";
import { NighthawkBootstrapService, NighthawkButtonDirective } from "../../public-api";
import { NighthawkDateSelectorComponent } from "../../lib/components/date-selector/date-selector.component";
import { FormsModule } from "@angular/forms";

@Component({
  standalone: true,
  imports: [FormsModule, NighthawkButtonDirective, NighthawkDateSelectorComponent],
  selector: "nighthawk-date-select-dialog",
  templateUrl: "date-select-dialog.component.html",
  styleUrls: ["./date-select-dialog.component.scss"],
})
export class NighthawkDateSelectDialogComponent {
  data = inject(DIALOG_DATA);
  dialogRef = inject<DialogRef<any>>(DialogRef);
  private readonly bootstrapService = inject(NighthawkBootstrapService);

  @Input() selectDatesText = "Select date(s)";
  @Input() selectADateText = "Select a date";
  @Input() selectARangeText = "Select a range";
  @Input() selectAStartDateText = "Select a start date";
  @Input() selectAnEndDateText = "Select an end date";
  @Input() clearText = "Clear";
  @Input() closeText = "Close";
  @Input() submitText = "Submit";

  public method: "date" | "range" = "date";
  public years: { name: string; value: number }[] = [];

  public selectedDate: Date | undefined;
  public startDate: Date | undefined;
  public endDate: Date | undefined;

  constructor() {
    const translations = this.bootstrapService.getTranslations();
    if (translations) {
      this.selectDatesText = translations.dateSelectDialog.selectDatesText;
      this.selectADateText = translations.dateSelectDialog.selectADateText;
      this.selectARangeText = translations.dateSelectDialog.selectARangeText;
      this.selectAStartDateText = translations.dateSelectDialog.selectAStartDateText;
      this.selectAnEndDateText = translations.dateSelectDialog.selectAnEndDateText;
      this.clearText = translations.dateSelectDialog.clearText;
      this.closeText = translations.dateSelectDialog.closeText;
      this.submitText = translations.dateSelectDialog.submitText;
    }

    const currentYear = new Date().getUTCFullYear();
    for (let i = currentYear; i > 1925; i--) {
      this.years.push({ name: "" + i, value: i });
    }

    this.selectedDate = this.data?.selectedDate;
    this.startDate = this.data?.startDate;
    this.endDate = this.data?.endDate;
  }

  public submit(): void {
    if (this.method === "date") {
      this.dialogRef.close({ selectedDate: this.selectedDate });
    } else {
      this.dialogRef.close({
        startDate: this.startDate,
        endDate: this.endDate,
      });
    }
  }

  public clear(): void {
    this.dialogRef.close("clear");
  }
}
