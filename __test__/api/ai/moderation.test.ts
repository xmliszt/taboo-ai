import handler from '../../../pages/api/ai/moderation';
import { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../../lib/middleware/withMiddleware', () => jest.fn((fn) => fn));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        choices: [{ message: { role: 'assistant', content: 'test' } }],
      }),
  })
) as jest.Mock;

describe('/api/ai/moderation', () => {
  const mockReq = {} as NextApiRequest;
  const mockRes = {} as NextApiResponse;
  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.method = 'GET'; // default 'GET'
    mockReq.headers = {
      'x-forwarded-for': ['http://localhost:3000'],
      origin: 'http://localhost:3000',
    };
    mockReq.body = { prompt: [{ role: 'user', content: 'hello' }] };
    mockRes.status = jest.fn().mockReturnThis();
    mockRes.json = jest.fn();
    mockRes.end = jest.fn();
    process.env.OPENAI_API = 'something';
  });

  it('should return error 500 response when no API key is provided', async () => {
    process.env.OPENAI_API = '';
    mockReq.method = 'POST';
    mockReq.body = {
      prompt: [{ role: 'user', content: 'hello' }],
      temperature: 0.5,
      maxToken: 100,
    };
    mockReq.headers = {};
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'No API Key provided!',
    });
  });

  it('should return error 400 response when target or prompt is missing', async () => {
    mockReq.method = 'POST';
    mockReq.body = {
      temperature: 0.5,
      maxToken: 100,
    };
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Missing target word or prompt',
    });
  });

  it('should return error 500 response when ChatGPT side API error', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            error: 'something',
          }),
      })
    ) as jest.Mock;
    mockReq.method = 'POST';
    mockReq.body = {
      target: 'test',
      prompt: [{ role: 'user', content: 'hello' }],
      temperature: 0.5,
      maxToken: 100,
    };
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith('something');
  });

  it('should return successful 200 response with response text', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            choices: [{ message: { role: 'assistant', content: 'test' } }],
          }),
      })
    ) as jest.Mock;
    mockReq.method = 'POST';
    mockReq.body = {
      target: 'test',
      prompt: [{ role: 'user', content: 'hello' }],
      temperature: 0.5,
      maxToken: 100,
    };
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ response: 'test' });
  });

  it('should return error 500 response when fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('something')));
    mockReq.method = 'POST';
    mockReq.body = {
      target: 'test',
      prompt: [{ role: 'user', content: 'hello' }],
      temperature: 0.5,
      maxToken: 100,
    };
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'something' });
  });

  it('should return end response when method is not POST', async () => {
    mockReq.method = 'GET';
    await handler(mockReq, mockRes);
    expect(mockRes.end).toHaveBeenCalled();
  });
});

export {};
