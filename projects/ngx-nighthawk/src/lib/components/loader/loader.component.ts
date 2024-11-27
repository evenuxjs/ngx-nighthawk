import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NighthawkBootstrapService } from '../../services/bootstrap.service';
import { SvgComponent } from '../svg/svg.component';

@Component({
  standalone: true,
  selector: 'nighthawk-loader',
  templateUrl: 'loader.component.html',
  styleUrl: 'loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SvgComponent],
})
export class NighthawkLoaderComponent {
  @Input() render: boolean = true;
  @Input() width: number | undefined;
  @Input() height: number | undefined;
  @Input() size: number = 16;
  @Input() type:
    | 'bouncing-ball'
    | 'bouncing-circles'
    | 'bouncing-squares'
    | 'fade-stagger-circles'
    | 'fade-stagger-squares'
    | 'gear-spinner' 
    | 'infinite-spinner'
    | 'motion-blur-2'
    | 'ripples'
    | 'tube-spinner'
    = 'tube-spinner';
  @Input() isHidden: boolean = false;
  @Input() isPageLoader: boolean = false;
  @Input() isPageLoaderFinished: boolean = false;
  @Input() customLoaderImagePath: string = '';

  public customPageLoaderImagePath: string = '';
  public pageLoaderType: string = '';

  constructor(private readonly nighthawk: NighthawkBootstrapService) {
    if (!this.nighthawk.config.pageLoaderCustomImagePath) {
      this.pageLoaderType = nighthawk.config.pageLoaderType as any; 
    } else {
      this.customPageLoaderImagePath = nighthawk.config.pageLoaderCustomImagePath || '';
    }
  }
}
