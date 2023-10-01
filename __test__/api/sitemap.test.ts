// Test /api/sitemap.ts
// Path: pages/api/sitemap

import handler from '@/pages/api/sitemap';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllLevels } from '@/lib/services/levelService';

jest.mock('../../lib/middleware/withMiddleware', () => jest.fn((fn) => fn));

// Mock @/lib/utils/routeUtils RouteManager
jest.mock('../../lib/utils/routeUtils', () => ({
  RouteManager: {
    baseUrl: 'http://example.com',
    getStaticRoutes: jest.fn(() => ['/level/1', '/level/2']),
  },
}));

// mock @/lib/services/levelService getAllLevels
// each level conforms to ILevel interface from @/lib/types/level.type.ts
jest.mock('../../lib/services/levelService', () => ({
  getAllLevels: jest.fn(() => [
    { id: 1, name: 'level 1' },
    { id: 2, name: 'level 2' },
  ]),
}));

describe('/api/sitemap', () => {
  const mockReq = {} as NextApiRequest;
  const mockRes = {} as NextApiResponse;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.method = 'GET'; // default 'GET'
    mockReq.headers = {
      'x-forwarded-for': ['http://localhost:3000'],
      origin: 'http://localhost:3000',
    };
    mockRes.send = jest.fn();
    mockRes.status = jest.fn().mockReturnThis();
    mockRes.json = jest.fn();
    mockRes.end = jest.fn();
  });

  it('should return error 405 response when method is not GET', async () => {
    mockReq.method = 'POST';
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Method Not Allowed',
    });
  });

  it('should return successful 200 response with sitemap', async () => {
    mockReq.query = { type: 'txt' };
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith(
      '/level/1\n/level/2\nhttp://example.com/level/1\nhttp://example.com/level/2\n'
    );
  });

  it('should return successful 200 response if file type is not provided as it will default to txt', async () => {
    mockReq.query = {};
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith(
      '/level/1\n/level/2\nhttp://example.com/level/1\nhttp://example.com/level/2\n'
    );
  });

  it('should return error 500 response when getAllLevels from @/lib/services/levelService throws error', async () => {
    (getAllLevels as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Error');
    });
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error',
    });
  });

  it('should return error 400 with unrecognized file type', async () => {
    mockReq.query = { type: 'html' };
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'sitemap file type not recognised',
    });
  });
});

export {};
