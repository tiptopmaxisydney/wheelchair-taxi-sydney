/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./booking-widget/**/*.{js,ts,jsx,tsx}",
  ],
  // The ported booking widget (from tiptopnextjs) uses Tailwind utility classes, but
  // this site otherwise has its own hand-rolled CSS (see app/globals.css) that assumes
  // normal browser defaults. Tailwind's preflight reset would zero out margins/headings/
  // list styles across the WHOLE site, not just the widget — disabled so only the
  // utility classes the widget actually uses are added, with zero effect elsewhere.
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
