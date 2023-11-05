import { HeaderProps } from '@/components/header';

export enum TabooPathname {
  HOME = '/',
  ABOUT = '/about',
  AI_MODE = '/ai',
  ADD_LEVEL = '/add-level',
  BUY_ME_COFFEE = '/buymecoffee',
  AI_LEVEL = '/level/ai',
  LEVELS = '/levels',
  PWA = '/pwa',
  RESULT = '/result',
  ROADMAP = '/roadmap',
  RULE = '/rule',
  WHATSNEW = '/whatsnew',
  X_REVIEW_WORDS = '/x/review-words',
  SITEMAP = '/sitemap',
  PROFILE = '/profile',
}

export class RouteManager {
  static baseUrl = process.env.SITE_URL ?? 'https://taboo-ai.vercel.app';

  static getStaticRoutes = (): string[] => {
    return Object.values(TabooPathname).map((p) => this.baseUrl + p);
  };

  static getHeaderPropsFromPath(route: string): HeaderProps {
    switch (true) {
      case TabooPathname.HOME === route:
        return {
          isTransparent: true,
          hideDevToggle: false,
        };
      case TabooPathname.ADD_LEVEL === route:
        return {
          title: 'Contribute Topics',
        };
      case TabooPathname.AI_MODE === route:
        return {
          title: 'AI Generated Topic',
          hasBackButton: true,
          hideMenu: true,
        };
      case TabooPathname.BUY_ME_COFFEE === route:
        return {
          isTransparent: true,
        };
      case `/${route.split('/')[1]}` === '/level':
        return {
          title: 'Taboo AI',
          hasBackButton: true,
          customBackHref: TabooPathname.LEVELS,
          hideMenu: true,
          hideUserMenu: true,
          hideDevToggle: false,
        };
      case TabooPathname.LEVELS === route:
        return {
          title: 'Choose A Topic',
        };
      case TabooPathname.RESULT === route:
        return {
          title: 'Game Result',
          hideShareScoreButton: false,
          hideDevToggle: false,
        };
      case TabooPathname.PWA === route:
        return {
          isTransparent: true,
        };
      case TabooPathname.ROADMAP === route:
        return {
          isTransparent: true,
        };
      case TabooPathname.RULE === route:
        return {
          isTransparent: true,
        };
      case TabooPathname.WHATSNEW === route:
        return {
          isTransparent: true,
        };
      case TabooPathname.ABOUT === route:
        return {
          isTransparent: true,
        };
      case TabooPathname.X_REVIEW_WORDS === route:
        return {
          title: 'Review Topics & Words',
        };
      case TabooPathname.SITEMAP === route:
        return {
          title: 'Sitemap',
        };
      case TabooPathname.PROFILE === route:
        return {
          title: 'My Profile',
          hideMenu: true,
          hasBackButton: true,
        };
      default:
        return {
          title: '',
          hideUserMenu: false,
          isTransparent: false,
          hideMenu: false,
          hideThemeToggle: false,
          hideDevToggle: true,
          hideShareScoreButton: true,
          hasBackButton: false,
        };
    }
  }
}
