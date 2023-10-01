process.env.SENDGRID_API_KEY = 'SG.1234567890';
import handler from '../../pages/api/send-email';
import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

jest.mock('@sendgrid/mail');
jest.mock('../../lib/middleware/withMiddleware', () => jest.fn((fn) => fn));

describe('/api/send-email', () => {
  const mockReq = {} as NextApiRequest;
  const mockRes = {} as NextApiResponse;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.method = 'POST'; // default 'GET'
    mockReq.headers = {
      'x-forwarded-for': ['http://localhost:3000'],
      origin: 'http://localhost:3000',
    };
    mockRes.status = jest.fn().mockReturnThis();
    mockRes.json = jest.fn();
    mockRes.end = jest.fn();
    process.env.SENDGRID_TO_EMAIL = 'to@mail.com';
    process.env.SENDGRID_FROM_EMAIL = 'from@mail.com';
    sgMail.send = jest.fn();
    sgMail.setApiKey = jest.fn();
  });

  it('should return error 500 if TO_EMAIL is not defined', async () => {
    delete process.env.SENDGRID_TO_EMAIL;
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error sending email',
    });
  });

  it('should return error 500 if FROM_EMAIL is not defined', async () => {
    delete process.env.SENDGRID_FROM_EMAIL;
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error sending email',
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

  it('should return error 400 response when email is not provided', async () => {
    mockReq.body = {};
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'email is requried',
    });
  });

  it('should return success 200 when email is sent', async () => {
    mockReq.body = {
      nickname: 'test',
      email: 'sender@mail.com',
      message: 'test',
      subject: 'test',
      html: 'test',
    };
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Email is sent successfully!',
    });
  });

  it('should return error 500 when email is not sent', async () => {
    mockReq.body = {
      nickname: 'test',
      email: 'sender@mail.com',
    };
    sgMail.send = jest.fn(() => {
      throw new Error('error');
    });
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error sending email',
      details: new Error('error'),
    });
  });
});
