// Browser-side error reporting (runs before the app becomes interactive). See lib/monitoring.ts.
import * as Sentry from "@sentry/nextjs";
import { sentryOptions } from "@/lib/monitoring";

Sentry.init(sentryOptions);
