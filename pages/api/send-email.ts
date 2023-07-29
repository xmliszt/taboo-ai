import sgMail from '@sendgrid/mail';
import { NextApiRequest, NextApiResponse } from 'next';

const sendgridApiKey = process.env.SENDGRID_API_KEY;
sendgridApiKey && sgMail.setApiKey(sendgridApiKey);
const TO_EMAIL = process.env.SENDGRID_TO_EMAIL;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

const sendGridEmailApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (TO_EMAIL === undefined || FROM_EMAIL === undefined) {
    return res.status(500).json({ error: 'Error sending email' });
  }
  if (req.method === 'POST') {
    const { nickname, email, message, subject, html } = req.body;
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
      res.status(200).json({
        message: 'Email is sent successfully!',
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error sending email', details: error });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default sendGridEmailApiHandler;
