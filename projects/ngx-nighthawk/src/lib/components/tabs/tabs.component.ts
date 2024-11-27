import {
  Component,
  AfterContentInit,
  Input,
  contentChildren,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { NighthawkTabComponent } from '../tab/tab.component';
import { NighthawkButtonDirective } from '../../directives/button.directive';

@Component({
  selector: 'nighthawk-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [CommonModule, NighthawkButtonDirective],
  standalone: true,
  animations: [
    trigger('fadeInOutHeight', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate('300ms ease-in', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, height: 0 })),
      ]),
    ]),
  ],
})
export class NighthawkTabsComponent implements AfterContentInit {
  @Input() activeTabButtonColor:
    | 'primary'
    | 'secondary'
    | 'dark'
    | 'light'
    | 'transparent' = 'primary';
  @Input() inactiveTabButtonColor:
    | 'primary'
    | 'secondary'
    | 'dark'
    | 'light'
    | 'transparent' = 'dark';
  @Input() tabsButtonRounded: boolean = true;
  @Input() tabsButtonBorder: boolean = true;
  @Input() tabsButtonSize: 'small' | 'medium' | 'large' = 'medium';
  @Input() plainTabsContent: boolean = false;

  readonly onSelectTab = output<number>();

  readonly tabs = contentChildren(NighthawkTabComponent);

  public ngAfterContentInit(): void {
    const activeTabs = this.tabs().filter((tab) => tab.active);

    if (activeTabs.length === 0) {
      this.selectTab(this.tabs().at(0)!);
    }
  }

  public selectTab(tab: NighthawkTabComponent): void {
    this.tabs().forEach((tab) => (tab.active = false));
    const index = this.tabs().indexOf(tab);
    this.onSelectTab.emit(index);
    tab.active = true;
  }
}
