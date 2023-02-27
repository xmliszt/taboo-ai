import { createRequest, createResponse, RequestMethod } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import * as levelRepository from '../../lib/db/levelRespository';
import handler from '../../pages/api/level';
import ILevel from '../../app/levels/(models)/level.interface';

jest.mock('../../lib/db/levelRespository', () => ({
  queryAllLevels: jest.fn().mockReturnValue({
    levels: [
      {
        name: 'hello',
        difficulty: 100,
        author: 'test',
        words: '',
      },
    ],
  }),
}));
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
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  uniqueId: jest.fn().mockReturnValue(1),
}));

type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
type APiResponse = NextApiResponse & ReturnType<typeof createResponse>;

function makeRequestResponse(method: RequestMethod = 'GET') {
  const req = createRequest<ApiRequest>({ method });
  const res = createResponse<APiResponse>();
  return { req, res };
}

describe('/api/level 200', () => {
  it('should return successful 200 response with levels object', async () => {
    const { req, res } = makeRequestResponse();
    await handler(req, res);
    const levels: ILevel[] = res._getJSONData().levels;
    expect(res.statusCode).toBe(200);
    expect(levels.length).toBe(1);
    expect(levels[0].name).toBe('hello');
    expect(levels[0].difficulty).toBe(100);
  });

  it('should return successful response with nothing', async () => {
    const { req, res } = makeRequestResponse('POST');
    await handler(req, res);
    expect(res.statusCode).toBe(200);
  });
});

describe('/api/level 500', () => {
  it('should return 500 response with levels object', async () => {
    (levelRepository.queryAllLevels as jest.Mock).mockRejectedValue('');
    const { req, res } = makeRequestResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(500);
  });
});
