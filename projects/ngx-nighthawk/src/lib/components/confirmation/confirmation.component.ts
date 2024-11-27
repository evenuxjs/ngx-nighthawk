import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { NighthawkButtonDirective } from '../../directives/button.directive';

@Component({
  standalone: true,
  imports: [NighthawkButtonDirective],
  selector: 'nighthawk-confirmation',
  templateUrl: 'confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class NighthawkConfirmationComponent {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(DIALOG_DATA) public data: any,
    public dialogRef: DialogRef<boolean>
  ) {}
}
