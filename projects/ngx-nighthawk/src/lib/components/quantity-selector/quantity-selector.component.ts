import { Component, Input, forwardRef, output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NighthawkButtonDirective } from '../../directives/button.directive';
import { NighthawkFormControlDirective } from '../../directives/form-control.directive';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'nighthawk-quantity-selector',
  templateUrl: './quantity-selector.component.html',
  styleUrls: ['./quantity-selector.component.scss'],
  imports: [CommonModule, FormsModule, NighthawkButtonDirective, NighthawkFormControlDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NighthawkQuantitySelectorComponent),
      multi: true,
    },
  ],
})
export class NighthawkQuantitySelectorComponent implements ControlValueAccessor {
  @Input() size: 'large' | 'medium' | 'small' = 'medium';
  readonly onQuantityChange = output<number>();

  public quantity: number = 1;

  private onChange = (quantity: number) => {};
  private onTouched = () => {};

  public decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.onChange(this.quantity);
      this.onTouched();
    }
  }

  public increaseQuantity(): void {
    if (this.quantity < 99999) {
      this.quantity++;
      this.onChange(this.quantity);
      this.onTouched();
    }
  }

  writeValue(quantity: number): void {
    this.quantity = quantity || 1;
    this.onQuantityChange.emit(this.quantity || 1);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
