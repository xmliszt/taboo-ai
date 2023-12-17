import { NextRequest } from 'next/server';
import sgMail from '@sendgrid/mail';

const sendgridApiKey = process.env.SENDGRID_API_KEY;
sendgridApiKey && sgMail.setApiKey(sendgridApiKey);

export async function POST(request: NextRequest) {
  const TO_EMAIL = process.env.SENDGRID_TO_EMAIL;
  const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
  if (TO_EMAIL === undefined || FROM_EMAIL === undefined) {
    return new Response('Error sending email', { status: 500 });
  }
  const { nickname, email, message, subject, html } = await request.json();
  if (email === undefined) {
    return new Response('email is requried', { status: 400 });
  }
  const msg = {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject: subject ?? 'Mail from ' + email,
    text: message,
    html:
      html ??
      `<article><h1>Mail from ${nickname}</h1><h3>${email}</h3><p><strong>${message}</strong></p></article>`,
  };
  try {
    await sgMail.send(msg);
    return new Response('Email is sent successfully!', { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Error sending email', { status: 500 });
  }
}
