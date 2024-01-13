import { MetadataRoute } from 'next';

import { fetchAllLevelsAndRanks } from '@/lib/services/levelService';
import { RouteManager } from '@/lib/utils/routeUtils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = RouteManager.getStaticRoutes();
  const levels = await fetchAllLevelsAndRanks();
  const staticSites = staticRoutes.map((route) => {
    return {
      url: route,
      lastModified: new Date(),
    };
  });
  const levelSites = levels.map((level) => {
    return {
      url: `${RouteManager.baseUrl}/level/${level.id}`,
      lastModified: new Date(),
    };
  });
  return [...staticSites, ...levelSites];
}
