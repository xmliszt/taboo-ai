import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../pages/api/ai';

jest.mock('../../lib/middleware/middlewareWrapper', () => jest.fn((fn) => fn));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        choices: [{ message: { role: 'assistant', content: 'test' } }],
      }),
  })
) as jest.Mock;

describe('/api/ai 200', () => {
  const mockReq = {} as NextApiRequest;
  const mockRes = {} as NextApiResponse;
  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.method = 'GET'; // default 'GET'
    mockReq.headers = {
      'x-forwarded-for': ['http://localhost:3000'],
      origin: 'http://localhost:3000',
    };
    mockReq.body = { prompt: 'hello' };
    mockRes.status = jest.fn().mockReturnThis();
    mockRes.json = jest.fn();
    mockRes.end = jest.fn();
  });
  beforeAll(() => {
    process.env.OPENAI_API = 'something';
  });
  it('should return successful 200 response with choices text', async () => {
    // const { req, res } = makeRequestResponse('POST');
    mockReq.method = 'POST';
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ response: 'test' });
  });

  it('should return successful 200 response with custom settings', async () => {
    mockReq.method = 'POST';
    mockReq.body = { prompt: 'hello', temperature: 0.5, maxToken: 100 };
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ response: 'test' });
  });

  it('should return successful 200 response with error text when choices is null', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ choices: [{ message: { content: null } }] }),
      })
    );
    mockReq.method = 'POST';
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ response: null });
  });

  it('should return successful response with nothing', async () => {
    await handler(mockReq, mockRes);
    expect(mockRes.end).toHaveBeenCalledTimes(1);
  });
});

describe('/api/ai 500 with no api key', () => {
  const mockReq = {} as NextApiRequest;
  const mockRes = {} as NextApiResponse;
  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.method = 'GET'; // default 'GET'
    mockReq.headers = {
      'x-forwarded-for': ['http://localhost:3000'],
      origin: 'http://localhost:3000',
    };
    mockReq.body = {};
    mockRes.status = jest.fn().mockReturnThis();
    mockRes.json = jest.fn();
    mockRes.end = jest.fn();
  });
  beforeAll(() => {
    delete process.env['OPENAI_API'];
  });
  it('should return 500 error response', async () => {
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'No API Key provided!',
    });
  });
});

describe('/api/ai 500', () => {
  const mockReq = {} as NextApiRequest;
  const mockRes = {} as NextApiResponse;
  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.method = 'GET'; // default 'GET'
    mockReq.headers = {
      'x-forwarded-for': ['http://localhost:3000'],
      origin: 'http://localhost:3000',
    };
    mockReq.body = {};
    mockRes.status = jest.fn().mockReturnThis();
    mockRes.json = jest.fn();
    mockRes.end = jest.fn();
  });
  beforeAll(() => {
    process.env['OPENAI_API'] = 'something';
  });
  it('should return unsuccessful 500 response', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: { error: 'error' } }),
      })
    );
    mockReq.method = 'POST';
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'error' });
  });

  it('should return unsuccessful 500 response', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.reject('error'),
      })
    );
    mockReq.method = 'POST';
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
  });
});

export {};
