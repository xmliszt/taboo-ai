process.env.SENDGRID_API_KEY = 'SG.1234567890';
import handler from '../../../pages/api/x/send-email';
import { NextApiResponse } from 'next';
import { AuthNextAPIRequest } from '@/lib/middleware/auth+middleware';
import sgMail from '@sendgrid/mail';

jest.mock('@sendgrid/mail');
jest.mock('../../../lib/middleware/withMiddleware', () => jest.fn((fn) => fn));

describe('/x/send-email', () => {
  const mockReq = {} as AuthNextAPIRequest;
  const mockRes = {} as NextApiResponse;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.method = 'POST'; // default 'GET'
    mockReq.headers = {
      'x-forwarded-for': ['http://localhost:3000'],
      origin: 'http://localhost:3000',
    };
    mockReq.uid = 'BnlcfMNIvrf2XCxY73O5KXmYNkI3';
    mockRes.status = jest.fn().mockReturnThis();
    mockRes.json = jest.fn();
    mockRes.end = jest.fn();
    process.env.SENDGRID_FROM_EMAIL = 'example@mail.com';
    sgMail.send = jest.fn();
    sgMail.setApiKey = jest.fn();
  });

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          choices: [{ message: { role: 'assistant', content: 'test' } }],
        }),
    })
  ) as jest.Mock;

  it('should return error 401 response when user is not authorized', async () => {
    mockReq.uid = '123';
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'You are not authorized',
    });
  });

  it('should return error 405 response when method is not POST', async () => {
    mockReq.method = 'GET';
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Method Not Allowed',
    });
  });

  it('should return success 200 when type is "verify"', async () => {
    mockReq.body = {
      topic: 'test',
      type: 'verify',
      to: 'somebody@mail.com',
    };
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Email is sent successfully!',
    });
  });

  it('should return success 200 when type is "reject"', async () => {
    mockReq.body = {
      type: 'reject',
      to: 'somebody@mail.com',
      reason: 'not qualified',
    };
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Email is sent successfully!',
    });
  });

  it('should return success 200 when type is "reject" and reason is "ambiguous"', async () => {
    mockReq.body = {
      type: 'reject',
      to: 'somebody@mail.com',
      reason: 'ambiguous',
    };
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Email is sent successfully!',
    });
  });

  it('should return success 200 when type is "reject" and reason is "duplicate"', async () => {
    mockReq.body = {
      type: 'reject',
      to: 'somebody@mail.com',
      reason: 'duplicate',
    };
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Email is sent successfully!',
    });
  });

  it('should return success 200 when type is "reject" and reason is "inapproriate-content"', async () => {
    mockReq.body = {
      type: 'reject',
      to: 'somebody@mail.com',
      reason: 'inapproriate-content',
    };
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Email is sent successfully!',
    });
  });

  it('should return success 200 when type is "reject" and reason is "insufficient-word-variety"', async () => {
    mockReq.body = {
      type: 'reject',
      to: 'somebody@mail.com',
      reason: 'insufficient-word-variety',
    };
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Email is sent successfully!',
    });
  });

  it('should return error 400 response when type is not "verify" or "reject"', async () => {
    mockReq.body = {
      type: 'test',
      to: 'sombody@mail.com',
    };
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error sending email',
      details: 'Type mismatched or reason empty',
    });
  });

  it('should return error 500 response when sendExternalEmailVerificationSuccess fails', async () => {
    mockReq.body = {
      type: 'verify',
      to: 'somebody@mail.com',
    };
    sgMail.send = jest.fn(() => Promise.reject(new Error('something')));
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error sending email',
      details: new Error('something'),
    });
  });

  it('should return error 500 when SENDGRID_FROM_EMAIL is undefined', async () => {
    delete process.env.SENDGRID_FROM_EMAIL;
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error sending email',
    });
  });
});
