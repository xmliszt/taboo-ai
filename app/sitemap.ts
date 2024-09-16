import { MetadataRoute } from 'next';

import { RouteManager } from '@/lib/utils/routeUtils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = RouteManager.getStaticRoutes();
  const staticSites = staticRoutes.map((route) => {
    return {
      url: route,
      lastModified: new Date(),
    };
  });
  return staticSites;
}
