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
  PUBLICATIONS = '/publications',
  PRIVACY = '/privacy-policy',
  COOKIE = '/cookie-policy',
  TNC = '/terms-and-conditions',
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
          title: 'Contribute topics',
        };
      case TabooPathname.AI_MODE === route:
        return {
          title: 'AI generated topic',
        };
      case TabooPathname.BUY_ME_COFFEE === route:
        return {
          title: 'Buy me a coffee',
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
          title: 'Choose a topic',
        };
      case TabooPathname.RESULT === route:
        return {
          title: 'Game result',
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
      case TabooPathname.WHATSNEW === route:
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
      case TabooPathname.PRICING === route:
        return {
          title: 'Pricing',
          hasBackButton: false,
        };
      case /^\/checkout\/success/.test(route):
        return {
          title: 'Checkout success',
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
