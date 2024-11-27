import {
  Component,
  HostListener,
  Input,
  forwardRef,
  output
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'nighthawk-range-select',
  templateUrl: 'range-select.component.html',
  styleUrls: ['./range-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NighthawkRangeSelectComponent),
      multi: true,
    },
  ],
})
export class NighthawkRangeSelectComponent implements ControlValueAccessor {
  @HostListener('mousedown')
  onMouseDown(): void {
    this.onMouseClick.emit(true);
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    this.onMouseClick.emit(false);
  }

  readonly onMouseClick = output<boolean>({ alias: 'onMouseClick' });

  @Input() value: number = 0;
  @Input() size: 'large' | 'medium' | 'small' = 'medium';
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() tickCount: number = 5;
  @Input() ticks: boolean = true;
  @Input() label: boolean = true;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onValueChange = output<number>();

  public onModelChange: (value: unknown) => void = () => {};

  private onTouched: () => void = () => {};

  get textValue(): string {
    return this.value !== null ? this.value.toString() : '';
  }

  public updateRangeValue(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = +target.value;
    this.onStateChange();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public writeValue(value: number): void {
    this.value = value;
  }

  public registerOnChange(fn: (value: unknown) => void): void {
    this.onModelChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onStateChange(): void {
    this.onValueChange.emit(this.value);
    this.onModelChange(this.value);
    this.onTouched();
  }
}
