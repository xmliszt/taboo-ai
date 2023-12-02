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
  PRICING = '/pricing',
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
          title: 'Buy Me A Coffee',
        };
      case /^\/level\//.test(route):
        return {
          title: 'Taboo AI',
          hasBackButton: true,
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
          title: 'Install Taboo AI',
        };
      case TabooPathname.ROADMAP === route:
        return {
          title: 'Roadmap',
        };
      case TabooPathname.RULE === route:
        return {
          title: 'Taboo AI Game Rules',
        };
      case TabooPathname.WHATSNEW === route:
        return {
          title: 'New Features',
        };
      case TabooPathname.ABOUT === route:
        return {
          title: 'About Taboo AI',
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
        };
      case TabooPathname.PRICING === route:
        return {
          hasBackButton: true,
        };
      case /^\/checkout\/success/.test(route):
        return {
          title: 'Checkout Success',
        };
      default:
        return {
          title: '',
          hideUserMenu: false,
          hideMenu: false,
          hideThemeToggle: false,
          hideDevToggle: true,
          hideShareScoreButton: true,
          hasBackButton: false,
        };
    }
  }
}
