"use client";

// Last-resort boundary for errors in the root layout itself. Reports the error to Sentry
// (a no-op when Sentry isn't configured) and offers a retry instead of a blank page.
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "48px 16px", textAlign: "center" }}>
        <h1>Something went wrong</h1>
        <p>Please try again. If the problem continues, call us to book.</p>
        <button type="button" onClick={() => retry()} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Try again
        </button>
      </body>
    </html>
  );
}
