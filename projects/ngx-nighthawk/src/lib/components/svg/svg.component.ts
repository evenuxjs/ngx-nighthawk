import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'nighthawk-svg',
  styleUrl: './svg.component.scss',
  template: `
  @if (isSvg) {
    <ng-template>
      {{ src }}
    </ng-template>
  } @else {
    <img [src]="src" alt="" />
  }
  `,
  standalone: true,
  imports: [HttpClientModule],
})
export class SvgComponent implements OnInit {
  @Input() public src = '';

  public isSvg: boolean = false;

  constructor(private el: ElementRef, private http: HttpClient) {}

  public ngOnInit(): void {
    const parts = this.src.split('.');
    this.isSvg = parts[parts.length - 1] === 'svg';
    if (this.isSvg) {
      this.http.get(this.src, { responseType: 'text' }).subscribe((svg) => {
        this.el.nativeElement.innerHTML = svg;
      });
    }
  }
}
