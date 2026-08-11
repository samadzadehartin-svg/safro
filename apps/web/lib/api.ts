export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export async function sendContact(payload: ContactPayload) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const response = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message?.[0] ?? body?.message ?? "Could not send your message.");
  }

  return response.json();
}
