import { Component, Input, forwardRef, output } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'nighthawk-checkbox',
  templateUrl: 'checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NighthawkCheckboxComponent),
      multi: true,
    },
  ],
})
export class NighthawkCheckboxComponent implements ControlValueAccessor {
  @Input() checked: boolean = false;
  @Input() isEnabled: boolean = true;
  @Input() type: 'default' | 'rounded' | 'switch' = 'default';
  @Input() size: 'large' | 'medium' | 'small' = 'medium';

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onStateChange = output<boolean>();

  public onModelChange: (value: unknown) => void = () => {};

  private onTouched: () => void = () => {};

  public writeValue(value: boolean): void {
    this.checked = value;
  }

  public registerOnChange(fn: (value: unknown) => void): void {
    this.onModelChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onStateToggle(): void {
    if (this.isEnabled) {
      this.onStateChange.emit(this.checked);
      this.onModelChange(this.checked);
      this.onTouched();
    }
  }
}
