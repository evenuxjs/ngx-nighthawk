import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { Highlight } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';

@Component({
  standalone: true,
  selector: 'nighthawk-highlight',
  templateUrl: 'highlight.component.html',
  styleUrl: 'highlight.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Highlight, HighlightLineNumbers]
})
export class NighthawkHighlightComponent {
  @Input() code!: string;
  @Input() language: string = 'Plaintext';
}
