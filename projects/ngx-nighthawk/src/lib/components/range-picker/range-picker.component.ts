import {
  Component,
  HostListener,
  Input,
  forwardRef,
  output
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'nighthawk-range-picker',
  templateUrl: 'range-picker.component.html',
  styleUrls: ['./range-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NighthawkRangePickerComponent),
      multi: true,
    },
  ],
})
export class NighthawkRangePickerComponent {
  @HostListener('mousedown')
  onMouseDown(): void {
    this.onMouseClick.emit(true);
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    this.onMouseClick.emit(false);
  }

  @Input() valueA: number = 0;
  @Input() valueB: number = 0;
  @Input() minValue: number = 0;
  @Input() maxValue: number = 100;
  @Input() size: 'large' | 'medium' | 'small' = 'medium';
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() tickCount: number = 5;
  @Input() suffix: string = '';
  @Input() ticks: boolean = true;
  @Input() label: boolean = true;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix, @typescript-eslint/no-explicit-any
  readonly onValueChange = output<any>();
  readonly onMouseClick = output<boolean>();

  public onModelChange: (value: unknown) => void = () => {};

  private onTouched: () => void = () => {};

  get textValueA(): string {
    return this.valueA?.toString() || '';
  }

  get textValueB(): string {
    return this.valueB?.toString() || '';
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
