import { getAllLevels } from '@/lib/services/levelService';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL ?? 'https://taboo-ai.vercel.app';
  const staticRoutes = [
    '/',
    '/levels',
    '/ai',
    '/level/ai',
    '/rule',
    '/pwa',
    '/whatsnew',
    '/roadmap',
    '/buymecoffee',
    '/add-level',
    '/privacy',
    '/cookie-policy',
  ];
  const levels = await getAllLevels();
  const staticSites = staticRoutes.map((route) => {
    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    };
  });
  const levelSites = levels.map((level) => {
    return {
      url: `${baseUrl}/level/${level.id}`,
      lastModified: new Date(),
    };
  });
  return [...staticSites, ...levelSites];
}
