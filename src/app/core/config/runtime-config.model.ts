export interface RuntimeConfig {
  readonly apiBaseUrl: string;
  readonly applicationName: string;
  readonly environmentName: string;
  readonly locale: string;
  readonly currency: string;
  readonly defaultPageSize: number;
  readonly featureFlags: Readonly<Record<string, boolean>>;
}