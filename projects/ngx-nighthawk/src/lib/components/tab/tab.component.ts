import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'nighthawk-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class NighthawkTabComponent {
  @Input() tabLabel!: string;
  @Input() active = false;
}
