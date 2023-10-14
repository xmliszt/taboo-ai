import withMiddleware from '@/lib/middleware/withMiddleware';
import { AuthNextAPIRequest } from '@/lib/middleware/auth+middleware';
import sgMail from '@sendgrid/mail';
import { NextApiResponse } from 'next';

const sendgridApiKey = process.env.SENDGRID_API_KEY;
sendgridApiKey && sgMail.setApiKey(sendgridApiKey);

export type RejectionReason =
  | 'inapproriate-content'
  | 'ambiguous'
  | 'duplicate'
  | 'insufficient-word-variety';

const sendExternalEmailVerificationSuccess = async (
  toEmail: string,
  fromEmail: string
) => {
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: 'Congratulations! Your Taboo AI Contribution is Now Live 🎉',
    html: `<article>
      <h1>Congratulations! Your Taboo AI Contribution is Now Live 🎉</h1>
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
};

const sendExternalEmailVerificationRejection = async (
  toEmail: string,
  fromEmail: string,
  reason: RejectionReason
) => {
  let reasonString = '';
  let reasonContent = '';
  switch (reason) {
    case 'ambiguous':
      reasonString = 'Ambiguity and Lack of Clarity';
      reasonContent =
        "Your topic's target words and associated taboo words lacked clarity, making the gameplay confusing and less enjoyable for users. To enhance the gaming experience, please consider providing more concise and clear definitions for future submissions.";
      break;
    case 'duplicate':
      reasonString = 'Duplicate Topic';
      reasonContent =
        'We already have a similar topic in our database, and to avoid repetition, we have decided not to accept duplicate entries. We encourage you to explore other unique topics to share with the Taboo AI community.';
      break;
    case 'inapproriate-content':
      reasonString = 'Inappropriate Content';
      reasonContent =
        'We strive to maintain a friendly and inclusive environment for players of all ages. Unfortunately, your topic contains content that may not align with our community standards. Please feel free to submit other topics that are suitable for a wider audience.';
      break;
    case 'insufficient-word-variety':
      reasonString = 'Insufficient Word Variety';
      reasonContent =
        'Your submission contained limited word choices, which may limit the diversity of gameplay. Please consider adding more words or exploring broader themes for your next submission.';
      break;
  }
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
      <p>Thank you once again for being part of the Taboo AI community. Your support is essential to our continuous improvement. Should you have any questions or require further assistance, feel free to reach out.</p>
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
};

const sendGridEmailApiHandler = async (
  req: AuthNextAPIRequest,
  res: NextApiResponse
) => {
  const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
  if (req.uid !== 'BnlcfMNIvrf2XCxY73O5KXmYNkI3') {
    return res.status(401).json({ error: 'You are not authorized' });
  }
  if (FROM_EMAIL === undefined) {
    return res.status(500).json({ error: 'Error sending email' });
  }
  if (req.method === 'POST') {
    const {
      type,
      to,
      reason,
    }: { type: 'verify' | 'reject'; to: string; reason?: RejectionReason } =
      req.body;
    try {
      if (type === 'verify') {
        await sendExternalEmailVerificationSuccess(to, FROM_EMAIL);
        res.status(200).json({
          message: 'Email is sent successfully!',
        });
      } else if (type === 'reject' && reason !== undefined) {
        await sendExternalEmailVerificationRejection(to, FROM_EMAIL, reason);
        res.status(200).json({
          message: 'Email is sent successfully!',
        });
      } else {
        res.status(400).json({
          error: 'Error sending email',
          details: 'Type mismatched or reason empty',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error sending email', details: error });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default withMiddleware(sendGridEmailApiHandler);
