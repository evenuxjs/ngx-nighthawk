import { Component, Input, forwardRef, output } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: "nighthawk-radios",
  templateUrl: "radios.component.html",
  styleUrls: ["./radios.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NighthawkRadiosComponent),
      multi: true,
    },
  ],
})
export class NighthawkRadiosComponent implements ControlValueAccessor {
  @Input() size: "large" | "medium" | "small" = "medium";

  @Input() options: { label: string; value: any; disabled?: boolean }[] = [];

  @Input() disabled = false;

  readonly onValueChange = output<any>();

  public selectedValue: any = "";
  public identifier = "";

  public onModelChange: (value: unknown) => void = () => {};

  private onTouched: () => void = () => {};

  constructor() {
    this.identifier = this.generateRandomString(12);
  }

  public writeValue(value: any): void {
    this.selectedValue = value;
  }

  public registerOnChange(fn: (value: unknown) => void): void {
    this.onModelChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onStateChange(): void {
    this.onValueChange.emit(this.selectedValue);
    this.onModelChange(this.selectedValue);
    this.onTouched();
  }

  private generateRandomString(length: number): string {
    const characters = "abcdefghijklmnopqrstuvwxyz";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
}
