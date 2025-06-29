import { Pipe, PipeTransform, inject } from "@angular/core";
import { DateTime } from "luxon";
import { NighthawkBootstrapService } from "../services/bootstrap.service";

@Pipe({
  name: "dateFormat",
  standalone: true,
})
export class NighthawkDateFormatPipe implements PipeTransform {
  private readonly nighthawk = inject(NighthawkBootstrapService);

  transform(value: any, format = "dd.MM.yyyy", isDatabaseTimezone?: boolean): string {
    const timezone = this.nighthawk.config.timezone === "guess" ? DateTime.local().zoneName : this.nighthawk.config.timezone;

    const zone = isDatabaseTimezone ? this.nighthawk.config.databaseTimezone : timezone;

    let date: DateTime;

    if (typeof value === "string") {
      date = DateTime.fromISO(value, { zone });
    } else if (typeof value === "number") {
      date = DateTime.fromMillis(value, { zone });
    } else if (value instanceof Date) {
      date = DateTime.fromJSDate(value, { zone });
    } else {
      return "";
    }

    return date.setZone(zone).toFormat(format);
  }
}
