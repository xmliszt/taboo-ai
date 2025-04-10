import { HeaderProps } from '@/components/header';

export enum TabooPathname {
  HOME = '/',
  ABOUT = '/about',
  AI_MODE = '/ai',
  ADD_LEVEL = '/add-level',
  AI_LEVEL = '/level/ai',
  LEVELS = '/levels',
  PWA = '/pwa',
  RESULT = '/result',
  ROADMAP = '/roadmap',
  RULE = '/rule',
  RELEASE_NOTES = '/release-notes',
  X_REVIEW_WORDS = '/x/review-words',
  SITEMAP = '/sitemap',
  PROFILE = '/profile',
  PUBLICATIONS = '/publications',
  PRIVACY = '/privacy-policy',
  COOKIE = '/cookie-policy',
  TNC = '/terms-and-conditions',
  SIGN_IN = '/sign-in',
  COFFEE = '/coffee',
}

export class RouteManager {
  static baseUrl = process.env.SITE_URL ?? 'https://taboo-ai.com';

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
          title: 'Contribute topics',
        };
      case TabooPathname.AI_MODE === route:
        return {
          title: 'AI generated topics',
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
          title: 'Public topics',
        };
      case TabooPathname.RESULT === route:
        return {
          title: 'Game results',
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
          title: 'Game rules',
        };
      case TabooPathname.RELEASE_NOTES === route:
        return {
          title: 'New features',
        };
      case TabooPathname.ABOUT === route:
        return {
          title: 'About Taboo AI',
        };
      case TabooPathname.X_REVIEW_WORDS === route:
        return {
          title: 'Review topics',
        };
      case TabooPathname.SITEMAP === route:
        return {
          title: 'Sitemap',
        };
      case TabooPathname.PROFILE === route:
        return {
          title: 'My profile',
        };
      case TabooPathname.PUBLICATIONS === route:
        return {
          title: 'Publications',
        };
      case /^\/x\/review-words/.test(route):
        return {
          title: 'Review words',
          hasBackButton: true,
        };
      case TabooPathname.PRIVACY === route:
        return {
          title: 'Privacy policy',
          hasBackButton: true,
          hideMenu: true,
          customBackHref: '/',
        };
      case TabooPathname.COOKIE === route:
        return {
          title: 'Cookie policy',
          hasBackButton: true,
          hideMenu: true,
          customBackHref: '/',
        };
      case TabooPathname.TNC === route:
        return {
          title: 'Terms & conditions',
          hasBackButton: true,
          hideMenu: true,
          customBackHref: '/',
        };
      case TabooPathname.SIGN_IN === route:
        return {
          title: 'Sign in',
          hideUserMenu: true,
          hideMenu: false,
          hideDevToggle: true,
          hasBackButton: false,
        };
      default:
        return {
          title: '',
          hideUserMenu: false,
          hideMenu: false,
          hideThemeToggle: false,
          hideDevToggle: true,
          hasBackButton: false,
        };
    }
  }
}
