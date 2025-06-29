import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "firstKey",
  standalone: true,
})
export class NighthawkFirstKeyPipe implements PipeTransform {
  transform(obj: any) {
    if (obj && typeof obj === "object") {
      const keys = Object.keys(obj);
      if (keys && keys.length > 0) {
        return keys[0];
      }
    }

    return null;
  }
}
