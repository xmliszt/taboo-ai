import { createRequest, createResponse, RequestMethod } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../pages/api/ai';

jest.mock('next', () => ({
  NextApiRequest: {
    method: 'GET',
  },
  NextApiResponse: {
    json: jest.fn((response) => response),
    status: jest.fn((status: number) => {
      status;
      jest.fn((error) => error);
    }),
    end: jest.fn(),
  },
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        choices: [{ message: { role: 'assistant', content: 'test' } }],
      }),
  })
) as jest.Mock;

type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
type APiResponse = NextApiResponse & ReturnType<typeof createResponse>;

function makeRequestResponse(method: RequestMethod = 'GET') {
  const req = createRequest<ApiRequest>({ method });
  const res = createResponse<APiResponse>();
  return { req, res };
}

function makeRequestResponseWithBody(
  method: RequestMethod = 'GET',
  body: object
) {
  const req = createRequest<ApiRequest>({ method, body });
  const res = createResponse<APiResponse>();
  return { req, res };
}

describe('/api/ai 200', () => {
  beforeAll(() => {
    process.env.OPENAI_API = 'something';
  });
  it('should return successful 200 response with choices text', async () => {
    const { req, res } = makeRequestResponse('POST');
    await handler(req, res);
    const response = res._getData().response;
    expect(res.statusCode).toBe(200);
    expect(response).toBe('test');
  });

  it('should return successful 200 response with custom settings', async () => {
    const { req, res } = makeRequestResponseWithBody('POST', {
      temperature: 1,
      maxToken: 10,
    });
    await handler(req, res);
    const response = res._getData().response;
    expect(res.statusCode).toBe(200);
    expect(response).toBe('test');
  });

  it('should return successful 200 response with error text when choices is null', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ choices: [{ message: { content: null } }] }),
      })
    );
    const { req, res } = makeRequestResponse('POST');
    await handler(req, res);
    const response = res._getData().response;
    expect(res.statusCode).toBe(200);
    expect(response).toBe("Sorry I don't quite get it.");
  });

  it('should return successful response with nothing', async () => {
    const { req, res } = makeRequestResponse('GET');
    await handler(req, res);
    expect(res.statusCode).toBe(200);
  });
});

describe('/api/ai 500 with no api key', () => {
  beforeAll(() => {
    delete process.env['OPENAI_API'];
  });
  it('should return successful response', async () => {
    const { req, res } = makeRequestResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(500);
  });
});

describe('/api/ai 500', () => {
  beforeAll(() => {
    process.env['OPENAI_API'] = 'something';
  });
  it('should return unsuccessful 500 response', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: { error: 'error' } }),
      })
    );
    const { req, res } = makeRequestResponse('POST');
    await handler(req, res);
    expect(res.statusCode).toBe(500);
  });

  it('should return unsuccessful 500 response', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.reject('error'),
      })
    );
    const { req, res } = makeRequestResponse('POST');
    await handler(req, res);
    expect(res.statusCode).toBe(500);
  });
});

export {};
