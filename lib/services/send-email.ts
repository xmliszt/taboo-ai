'use server';

import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_KEY;
if (!resendApiKey) throw new Error('No Resend API key found');
const resend = new Resend(resendApiKey);

export async function sendEmail(
  nickname: string,
  fromEmail: string,
  content: string,
  subject?: string,
  html?: string
) {
  const TO_EMAIL = process.env.RESEND_TO_EMAIL;
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
  if (TO_EMAIL === undefined || FROM_EMAIL === undefined) throw new Error('Error sending email');
  await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: subject ?? `Mail from ${nickname} (${fromEmail})`,
    text: content,
    html:
      html ??
      `
      <article>
        <h1>Mail from ${nickname} (${fromEmail})</h1>
        <p>${content}</p>
      </article>`,
  });
}
