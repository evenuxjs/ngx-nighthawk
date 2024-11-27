export interface ApplicationConfig {
  readonly fonts: string[];
  readonly timezone: string;
  readonly databaseTimezone: string;
  readonly pageLoaderEnabled: boolean;
  readonly routeLoaderEnabled: boolean;
  readonly minimumLoaderTime: number;
  readonly pageLoaderSize: number;
  readonly manualLoader: boolean;
  readonly pageLoaderCustomImagePath: string | false;
  readonly pageLoaderType: string;
}
