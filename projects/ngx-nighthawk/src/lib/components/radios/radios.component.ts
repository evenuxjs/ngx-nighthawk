import {
  Component,
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
  selector: 'nighthawk-radios',
  templateUrl: 'radios.component.html',
  styleUrls: ['./radios.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NighthawkRadiosComponent),
      multi: true,
    },
  ],
})
export class NighthawkRadiosComponent implements ControlValueAccessor {
  @Input() size: 'large' | 'medium' | 'small' = 'medium';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() options: { label: string; value: any; disabled?: boolean }[] = [];

  @Input() disabled: boolean = false;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix, @typescript-eslint/no-explicit-any
  readonly onValueChange = output<any>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public selectedValue: any = '';
  public identifier: string = '';

  public onModelChange: (value: unknown) => void = () => {};

  private onTouched: () => void = () => {};

  constructor() {
    this.identifier = this.generateRandomString(12);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
}
