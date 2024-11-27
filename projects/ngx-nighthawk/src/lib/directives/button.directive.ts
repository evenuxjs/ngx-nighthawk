import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[nighthawk-button]',
  standalone: true,
})
export class NighthawkButtonDirective {
  @Input() color: 'primary' | 'secondary' | 'light' | 'dark' | 'transparent' =
    'transparent';
  @Input() size: 'large' | 'medium' | 'small' = 'medium';
  @Input() border: boolean = false;
  @Input() rounded: boolean = false;

  @Input() set disabled(value: boolean) {
    this.isDisabled = value;
  }

  @HostBinding('class.btn-disabled') isDisabled: boolean = false;
  @HostBinding('class') get classes(): string {
    const classes = ['btn'];
    classes.push(`btn-${this.size}`);

    if (this.border) {
      classes.push('btn-bordered');
    }

    if (this.rounded) {
      classes.push('btn-rounded');
    }

    if (this.color) {
      classes.push(`btn-${this.color}`);
    }

    return classes.join(' ');
  }
}
