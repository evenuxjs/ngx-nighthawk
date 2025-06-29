import { ChangeDetectionStrategy, Component, Input, inject } from "@angular/core";
import { NighthawkBootstrapService } from "../../services/bootstrap.service";
import { SvgComponent } from "../svg/svg.component";

@Component({
  standalone: true,
  selector: "nighthawk-loader",
  templateUrl: "loader.component.html",
  styleUrl: "loader.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SvgComponent],
})
export class NighthawkLoaderComponent {
  private readonly nighthawk = inject(NighthawkBootstrapService);

  @Input() render = true;
  @Input() width: number | undefined;
  @Input() height: number | undefined;
  @Input() size = 16;
  @Input() type:
    | "bouncing-ball"
    | "bouncing-circles"
    | "bouncing-squares"
    | "fade-stagger-circles"
    | "fade-stagger-squares"
    | "gear-spinner"
    | "infinite-spinner"
    | "motion-blur-2"
    | "ripples"
    | "tube-spinner" = "tube-spinner";
  @Input() isHidden = false;
  @Input() isPageLoader = false;
  @Input() isPageLoaderFinished = false;
  @Input() customLoaderImagePath = "";

  public customPageLoaderImagePath = "";
  public pageLoaderType = "";

  constructor() {
    const nighthawk = this.nighthawk;

    if (!this.nighthawk.config.pageLoaderCustomImagePath) {
      this.pageLoaderType = nighthawk.config.pageLoaderType as any;
    } else {
      this.customPageLoaderImagePath = nighthawk.config.pageLoaderCustomImagePath || "";
    }
  }
}
