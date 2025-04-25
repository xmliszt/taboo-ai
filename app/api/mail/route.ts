import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_KEY;
if (!resendApiKey) throw new Error('No Resend API key found');
const resend = new Resend(resendApiKey);

export async function POST(request: NextRequest) {
  const TO_EMAIL = process.env.RESEND_TO_EMAIL;
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
  if (TO_EMAIL === undefined || FROM_EMAIL === undefined) {
    return new Response('Error sending email', { status: 500 });
  }
  const { nickname, email, message, subject, html } = await request.json();
  if (email === undefined) {
    return new Response('email is requried', { status: 400 });
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: subject ?? 'Mail from ' + email,
      text: message,
      html:
        html ??
        `<article><h1>Mail from ${nickname}</h1><h3>${email}</h3><p><strong>${message}</strong></p></article>`,
    });
    return NextResponse.json({ message: 'Email sent' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Error sending email', details: error }, { status: 500 });
  }
}
