import { getAllLevels } from '@/lib/services/levelService';
import { RouteManager } from '@/lib/utils/routeUtils';
import { NextApiRequest, NextApiResponse } from 'next';

const sitemapHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const fileType = req.query.type ?? 'txt';
  switch (fileType) {
    case 'txt':
      try {
        const content = await generateTxtSitemap();
        return res.status(200).send(content);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
      }
    default:
      break;
  }
  return res.status(400).json({ error: 'sitemap file type not recognised' });
};

const generateTxtSitemap = async (): Promise<string> => {
  let sitemap = '';
  const staticRoutes = RouteManager.getStaticRoutes();
  const levels = await getAllLevels();
  const dynamicRoutes = levels.map(
    (level) => `${RouteManager.baseUrl}/level/${level.id}`
  );
  const routes = [...staticRoutes, ...dynamicRoutes];
  routes.forEach((r) => (sitemap += r + '\n'));
  return sitemap;
};

export default sitemapHandler;
