import { Component, Input, forwardRef, Output, EventEmitter, OnChanges } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NighthawkButtonDirective } from "../../directives/button.directive";
import { NighthawkFormControlDirective } from "../../directives/form-control.directive";
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  selector: "nighthawk-quantity-selector",
  templateUrl: "./quantity-selector.component.html",
  styleUrls: ["./quantity-selector.component.scss"],
  imports: [CommonModule, FormsModule, NighthawkButtonDirective, NighthawkFormControlDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NighthawkQuantitySelectorComponent),
      multi: true,
    },
  ],
})
export class NighthawkQuantitySelectorComponent implements ControlValueAccessor, OnChanges {
  @Input() size: "large" | "medium" | "small" = "medium";
  @Input() maxQuantity = 99999;
  @Output() onQuantityChange = new EventEmitter<number>();

  public quantity = 1;
  public maxLength = 5;

  private onChange: (quantity: number) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.maxLength = Math.abs(this.maxQuantity).toString().length;
  }

  public ngOnChanges() {
    this.maxLength = Math.abs(this.maxQuantity).toString().length;
  }

  public decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.onChange(this.quantity);
      this.onTouched();
      this.onQuantityChange.emit(this.quantity);
    }
  }

  public increaseQuantity(): void {
    if (this.quantity < this.maxQuantity) {
      this.quantity++;
      this.onChange(this.quantity);
      this.onTouched();
      this.onQuantityChange.emit(this.quantity);
    }
  }

  public writeValue(quantity: number): void {
    this.quantity = quantity || 1;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public updateQuantity(newValue: number): void {
    if (newValue < 0) {
      this.quantity = 1;
    } else if (newValue > this.maxQuantity) {
      this.quantity = this.maxQuantity;
    } else {
      this.quantity = newValue;
    }

    this.onChange(this.quantity);
    this.onQuantityChange.emit(this.quantity);
  }

  public validate(evt: any): void {
    const theEvent = evt || window.event;
    let key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    const regex = /[0-9]|\./;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }
}
