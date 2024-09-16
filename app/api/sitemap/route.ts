import { NextRequest } from 'next/server';

import { RouteManager } from '@/lib/utils/routeUtils';

const generateTxtSitemap = async (): Promise<string> => {
  let sitemap = '';
  const staticRoutes = RouteManager.getStaticRoutes();
  staticRoutes.forEach((r) => (sitemap += r + '\n'));
  sitemap += `${RouteManager.baseUrl}/levels?rank=true\n`;
  return sitemap;
};

export async function GET(request: NextRequest) {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  const { searchParams } = new URL(request.url);
  const fileType = searchParams.get('type') ?? 'txt';
  switch (fileType) {
    case 'txt':
      try {
        const content = await generateTxtSitemap();
        return new Response(content, {
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
      }
    default:
      break;
  }
  return new Response('sitemap file type not recognised', { status: 400 });
}
