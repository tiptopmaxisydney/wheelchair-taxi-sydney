// Same endpoint and payload as tiptopride-landing's Contact1 form
// (henceforthApi.ContactUs.marketingMessage) — tipopride-backend emails the admin
// and sends the customer an auto-reply.
const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT || "";

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

export async function sendContactMessage(payload: ContactPayload) {
  const res = await fetch(`${API_ROOT}contactus/marketing-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`contact request failed: ${res.status}`);
  return res.json();
}
