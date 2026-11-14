// Server-side error reporting for the Node and edge runtimes. See lib/monitoring.ts.
import * as Sentry from "@sentry/nextjs";
import { sentryOptions } from "@/lib/monitoring";

export function register() {
  Sentry.init(sentryOptions);
}

// Reports errors thrown while rendering pages, route handlers and server actions.
export const onRequestError = Sentry.captureRequestError;
