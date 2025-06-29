import { Component, HostListener, Input, forwardRef, output } from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: "nighthawk-range-picker",
  templateUrl: "range-picker.component.html",
  styleUrls: ["./range-picker.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NighthawkRangePickerComponent),
      multi: true,
    },
  ],
})
export class NighthawkRangePickerComponent {
  @HostListener("mousedown")
  onMouseDown(): void {
    this.onMouseClick.emit(true);
  }

  @HostListener("mouseup")
  onMouseUp(): void {
    this.onMouseClick.emit(false);
  }

  @Input() valueA = 0;
  @Input() valueB = 0;
  @Input() minValue = 0;
  @Input() maxValue = 100;
  @Input() size: "large" | "medium" | "small" = "medium";
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() tickCount = 5;
  @Input() suffix = "";
  @Input() ticks = true;
  @Input() label = true;

  readonly onValueChange = output<any>();
  readonly onMouseClick = output<boolean>();

  public onModelChange: (value: unknown) => void = () => {};

  private onTouched: () => void = () => {};

  get textValueA(): string {
    return this.valueA?.toString() || "";
  }

  get textValueB(): string {
    return this.valueB?.toString() || "";
  }

  public updateRangeValueA(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueA = +target.value;
    this.onStateChange();
  }

  public updateRangeValueB(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueB = +target.value;
    this.onStateChange();
  }

  public writeValue(values: any): void {
    if (values) {
      this.valueA = values.a;
      this.valueB = values.b;
    }
  }

  public registerOnChange(fn: (value: unknown) => void): void {
    this.onModelChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onStateChange(): void {
    const values = {
      a: this.valueA,
      b: this.valueB,
    };

    this.onValueChange.emit(values);
    this.onModelChange(values);
    this.onTouched();
  }
}
