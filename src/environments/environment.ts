import { Environment } from "./environment.model";

export const environment: Environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3400'
} as const;