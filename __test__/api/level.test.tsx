import { NextApiRequest, NextApiResponse } from 'next';
import * as levelRepository from '../../lib/database/levelRespository';
import handler from '../../pages/api/levels/get';

jest.mock('../../lib/middleware/middlewareWrapper', () => jest.fn((fn) => fn));

jest.mock('../../lib/database/levelRespository', () => ({
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

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  uniqueId: jest.fn().mockReturnValue(1),
}));

describe('/api/level 200', () => {
  const mockReq = {} as NextApiRequest;
  const mockRes = {} as NextApiResponse;
  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.method = 'GET'; // default 'GET'
    mockReq.headers = {
      'x-forwarded-for': ['http://localhost:3000'],
      origin: 'http://localhost:3000',
    };
    mockRes.status = jest.fn().mockReturnThis();
    mockRes.json = jest.fn();
    mockRes.end = jest.fn();
  });

  it('should return successful 200 response with levels object', async () => {
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      levels: [
        {
          author: 'test',
          createdAt: NaN,
          difficulty: 100,
          name: 'hello',
          new: undefined,
          words: [''],
        },
      ],
    });
  });

  it('should return successful response with nothing', async () => {
    mockReq.method = 'POST';
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(405);
  });
});

describe('/api/level 500', () => {
  const mockReq = {} as NextApiRequest;
  const mockRes = {} as NextApiResponse;
  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.method = 'GET'; // default 'GET'
    mockReq.headers = {
      'x-forwarded-for': ['http://localhost:3000'],
      origin: 'http://localhost:3000',
    };
    mockRes.status = jest.fn().mockReturnThis();
    mockRes.json = jest.fn();
    mockRes.end = jest.fn();
  });
  it('should return 500 response with levels object', async () => {
    (levelRepository.queryAllLevels as jest.Mock).mockRejectedValue(
      'some error'
    );
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'some error' });
  });
});
