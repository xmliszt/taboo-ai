'use server';

import 'server-only';

import { cookies } from 'next/headers';
import sgMail from '@sendgrid/mail';

import { RejectionReason, REJECTIONS } from '@/lib/constants';
import { createClient } from '@/lib/utils/supabase/server';

const sendgridApiKey = process.env.SENDGRID_API_KEY;
sendgridApiKey && sgMail.setApiKey(sendgridApiKey);

async function sendExternalEmailVerificationSuccess(
  topicName: string,
  toEmail: string,
  fromEmail: string
) {
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: `Congratulations! Your Topic Submitted: "${topicName}" is Now Live 🎉`,
    html: `<article>
        <h1>Congratulations! Your Topic Submitted: "${topicName}" is Now Live. 🎉</h1>
        <p>Your creativity has hit the mark, and we&apos;re delighted to inform you that your topic contribution has been accepted for Taboo AI. 🌟🎉</p>
        <p>Your unique topic, with its cleverly crafted target words and well-thought-out taboo words, has been added to our collection, and players worldwide can now enjoy the challenges you&apos;ve created. We applaud your contribution and believe your topic will add a fantastic twist to the Taboo AI experience.</p>
        <p>Thank you for being part of our growing community and for sharing your passion for wordplay with us. Your involvement has made Taboo AI even more vibrant and engaging. 🌍💬</p>
        <br/>
        <p>Best regards,</p>
        <p>
        Li Yuxuan,
        Taboo AI
        </p>
        </article>`,
  };
  await sgMail.send(msg);
}

async function sendExternalEmailVerificationRejection(
  toEmail: string,
  fromEmail: string,
  reason: RejectionReason
) {
  const reasonString = REJECTIONS[reason].title;
  const reasonContent = REJECTIONS[reason].message;
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: "Hi! Let's Elevate Your Topics! Resubmit Your Taboo AI Entry 🚀",
    html: `<article>
        <h1>Hi! Let&apos;s Elevate Your Topics! Resubmit Your Taboo AI Entry 🚀</h1>
        <p>Thank you for your interest in contributing to Taboo AI&apos;s ever-growing collection of custom topics. We appreciate your enthusiasm and creative spirit. After careful consideration, we regret to inform you that your submission has been rejected. Please don&apos;t be disheartened, as we have specific guidelines in place to ensure the best possible gaming experience for all users.</p>
        <p>Reasons for Rejection: </p>
        <h3>${reasonString}</h3>
        <p>${reasonContent}</p>
        <br/>
        <p>We value your contribution and encourage you to continue sharing your ideas with us. We welcome you to resubmit your custom topic with necessary adjustments based on the provided feedback.</p>
        <p>Thank you once again for being part of the Taboo AI community. Your support is essential to our continuous improvement. If you require any further assistance, feel free to reach out.</p>
        <p>To further help you with topic creation, here are some good examples for you to refer to:</p>
        <h3>Examples:</h3>
        <ul>
          <li>
            <h4>Topic: Superheroes</h4>
            <p>Target Words: Batman</p>
            <p>Taboo Words: Gotham, Dark Knight ...</p>
          </li>
          <li>
            <h4>Topic: Famous Landmarks</h4>
            <p>Target Words: Eiffel Tower, Statue of Liberty</p>
            <p>Taboo Words: Paris, New York City ...</p>
          </li>
        </ul>
        <br/>
        <p>Best regards,</p>
        <p>
        Li Yuxuan,
        Taboo AI
        </p>
        </article>`,
  };
  await sgMail.send(msg);
}

export async function sendSecureEmail(
  topic: string,
  toEmail: string,
  type: 'reject' | 'verify',
  reason?: RejectionReason
) {
  const supabaseClient = createClient(cookies());
  const authUserResponse = await supabaseClient.auth.getUser();
  if (authUserResponse.error) throw new Error('You are not authenticated');
  const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
  if (FROM_EMAIL === undefined)
    throw new Error('Error sending email because no source email is provided');
  if (type === 'verify') {
    await sendExternalEmailVerificationSuccess(topic, toEmail, FROM_EMAIL);
  } else if (type === 'reject' && reason !== undefined) {
    await sendExternalEmailVerificationRejection(toEmail, FROM_EMAIL, reason);
  }
}
