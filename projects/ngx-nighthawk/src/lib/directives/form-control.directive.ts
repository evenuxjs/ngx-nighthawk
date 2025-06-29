import { Directive, ElementRef, HostBinding, Input, OnInit, PLATFORM_ID, Renderer2, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Directive({
  standalone: true,
  selector: "[nighthawkFormControl]",
})
export class NighthawkFormControlDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly renderer2 = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);

  @Input() color: "primary" | "secondary" | "light" | "dark" | "transparent" = "transparent";
  @Input() size: "large" | "medium" | "small" = "medium";
  @Input() centered = false;
  @Input() border = false;
  @Input() rounded = false;
  @Input() fullWidth = false;
  @Input() controlToCheckForErrors!: any;

  @Input() set disabled(value: boolean) {
    this.isDisabled = value;
  }

  @HostBinding("class.form-control-disabled") isDisabled = false;
  @HostBinding("class") get classes(): string {
    const classes = ["form-control"];
    classes.push(`form-control-${this.size}`);

    if (this.controlToCheckForErrors?.invalid && (this.controlToCheckForErrors?.dirty || this.controlToCheckForErrors?.touched)) {
      classes.push("form-control-errored");
    }

    if (this.centered) {
      classes.push("form-control-centered");
    }

    if (this.border) {
      classes.push("form-control-bordered");
    }

    if (this.rounded) {
      classes.push("form-control-rounded");
    }

    if (this.fullWidth) {
      classes.push("form-control-full-width");
    }

    if (this.color) {
      classes.push(`form-control-background-${this.color}`);
    }

    return classes.join(" ");
  }

  private isBrowser = false;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public ngOnInit(): void {
    if (this.isDisabled) {
      this.renderer2.setProperty(this.el.nativeElement, "disabled", true);
    }

    if (!this.isBrowser) {
      return;
    }

    const inputElement = this.el.nativeElement as HTMLInputElement;

    if (inputElement.type === "password") {
      this.renderer2.addClass(inputElement, "form-control-password");

      // Create outer wrapper with no styles
      const outerWrapperDiv = this.renderer2.createElement("div");

      // Create inner wrapper with styles
      const innerWrapperDiv = this.renderer2.createElement("div");
      this.renderer2.setStyle(innerWrapperDiv, "position", "relative");
      this.renderer2.setStyle(innerWrapperDiv, "display", "inline-block");
      this.renderer2.setStyle(innerWrapperDiv, "width", "100%");

      const eyeIcon = this.renderer2.createElement("i");
      this.renderer2.addClass(eyeIcon, "fa");
      this.renderer2.addClass(eyeIcon, "fa-eye");
      this.renderer2.setStyle(eyeIcon, "position", "absolute");
      this.renderer2.setStyle(eyeIcon, "top", "50%");
      this.renderer2.setStyle(eyeIcon, "transform", "translateY(-50%)");
      this.renderer2.setStyle(eyeIcon, "cursor", "pointer");

      switch (this.size) {
        case "large":
          this.renderer2.addClass(eyeIcon, "password-form-control-eye-icon-large");
          break;
        case "small":
          this.renderer2.addClass(eyeIcon, "password-form-control-eye-icon-small");
          break;
        default:
          this.renderer2.addClass(eyeIcon, "password-form-control-eye-icon-medium");
          break;
      }

      switch (this.color) {
        case "primary":
          this.renderer2.addClass(eyeIcon, "password-form-control-eye-icon-primary");
          break;
        case "secondary":
          this.renderer2.addClass(eyeIcon, "password-form-control-eye-icon-secondary");
          break;
        case "dark":
          this.renderer2.addClass(eyeIcon, "password-form-control-eye-icon-dark");
          break;
        case "light":
          this.renderer2.addClass(eyeIcon, "password-form-control-eye-icon-light");
          break;
        case "transparent":
          this.renderer2.addClass(eyeIcon, "password-form-control-eye-icon-transparent");
          break;
      }

      const parent = inputElement.parentNode;
      if (parent) {
        // Remove inputElement from its parent
        this.renderer2.removeChild(parent, inputElement);

        // Insert outer wrapper
        this.renderer2.insertBefore(parent, outerWrapperDiv, parent.firstChild);

        // Append inner wrapper inside the outer wrapper
        this.renderer2.appendChild(outerWrapperDiv, innerWrapperDiv);

        // Append the input and eyeIcon to the inner wrapper
        this.renderer2.appendChild(innerWrapperDiv, inputElement);
        this.renderer2.appendChild(innerWrapperDiv, eyeIcon);

        // Handle click on eyeIcon to toggle password visibility
        this.renderer2.listen(eyeIcon, "click", () => {
          const isPassword = inputElement.type === "password";
          this.renderer2.setProperty(inputElement, "type", isPassword ? "text" : "password");
          this.renderer2.removeClass(eyeIcon, isPassword ? "fa-eye" : "fa-eye-slash");
          this.renderer2.addClass(eyeIcon, isPassword ? "fa-eye-slash" : "fa-eye");
        });
      } else {
        console.error("Parent node not found");
      }
    }
  }
}
