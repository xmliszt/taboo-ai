'use server';

import sgMail from '@sendgrid/mail';

const sendgridApiKey = process.env.SENDGRID_API_KEY;
sendgridApiKey && sgMail.setApiKey(sendgridApiKey);

export async function sendEmail(
  nickname: string,
  fromEmail: string,
  content: string,
  subject?: string,
  html?: string
) {
  const TO_EMAIL = process.env.SENDGRID_TO_EMAIL;
  const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
  if (TO_EMAIL === undefined || FROM_EMAIL === undefined) throw new Error('Error sending email');
  const msg = {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject: subject ?? `Mail from ${nickname} (${fromEmail})`,
    text: content,
    html:
      html ??
      `
      <article>
        <h1>Mail from ${nickname} (${fromEmail})</h1>
        <p>${content}</p>
      </article>`,
  };
  await sgMail.send(msg);
}
