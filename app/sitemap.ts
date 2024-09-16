import { MetadataRoute } from 'next';
import { compact } from 'lodash';

import { RouteManager } from '@/lib/utils/routeUtils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = RouteManager.getStaticRoutes();
  const staticSites = compact(
    staticRoutes.map((route) => {
      if (route.includes('/x/review-words')) return;
      return {
        url: route,
        lastModified: new Date(),
      };
    })
  );
  staticSites.push({
    url: '/levels?rank=true',
    lastModified: new Date(),
  });
  return staticSites;
}
