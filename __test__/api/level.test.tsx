import { NextApiRequest, NextApiResponse } from 'next';
import * as levelRepository from '../../lib/database/levelRespository';
import handler from '../../pages/api/levels/get';
import createHandler from '../../pages/api/levels/create';

jest.mock('../../lib/middleware/middlewareWrapper', () => jest.fn((fn) => fn));

jest.mock('../../lib/database/levelRespository', () => ({
  insertLevel: jest.fn().mockReturnValue({
    level: {
      name: 'hello',
      difficulty: 100,
      author: 'test',
      words: '',
      isverified: false,
    },
  }),
  fetchLevelByName: jest.fn().mockReturnValue({
    level: {
      name: 'hello',
      difficulty: 100,
      author: 'test',
      words: '',
      isverified: false,
    },
  }),
  queryAllLevels: jest.fn().mockReturnValue({
    levels: [
      {
        name: 'hello',
        difficulty: 100,
        author: 'test',
        words: '',
        isverified: false,
      },
    ],
  }),
}));

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  uniqueId: jest.fn().mockReturnValue(1),
}));

describe('/api/level/get?name=', () => {
  const mockReq = {} as NextApiRequest;
  const mockRes = {} as NextApiResponse;
  mockReq.query = {
    name: 'hello',
  };
  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.method = 'GET'; // default 'GET'
    mockReq.headers = {
      'x-forwarded-for': ['http://localhost:3000'],
      origin: 'http://localhost:3000',
    };
    mockReq.query = { name: 'hello' };
    mockRes.status = jest.fn().mockReturnThis();
    mockRes.json = jest.fn();
    mockRes.end = jest.fn();
  });

  it('should return successful 200 response with level object', async () => {
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      levels: [
        {
          name: 'hello',
          difficulty: 100,
          author: 'test',
          words: '',
          isverified: false,
        },
      ],
    });
  });

  it('should return successful 200 response with empty', async () => {
    (levelRepository.fetchLevelByName as jest.Mock).mockReturnValue({
      level: null,
    });
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      levels: [],
    });
  });
});

describe('/api/level/create', () => {
  const mockReq = { query: {} } as NextApiRequest;
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
  });

  it('should return successful 200 response with level object', async () => {
    await createHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      level: {
        name: 'hello',
        difficulty: 100,
        author: 'test',
        words: '',
        isverified: false,
      },
    });
  });

  it('should return 500 response', async () => {
    (levelRepository.insertLevel as jest.Mock).mockRejectedValue('some error');
    await createHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Unable to create new level.',
      details: undefined,
    });
  });

  it('should return 405 response', async () => {
    mockReq.method = 'GET';
    await createHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Method Not Allowed',
    });
  });
});

describe('/api/level 200', () => {
  const mockReq = { query: {} } as NextApiRequest;
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
          isVerified: false,
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
  const mockReq = { query: {} } as NextApiRequest;
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
