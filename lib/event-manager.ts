export enum CustomEventKey {
  LOGIN_ERROR = 'login-error-event',
  LOGIN_REMINDER = 'login-reminder-event',
  TOGGLE_MENU = 'toggle-menu-event',
  SHARE_SCORE = 'share-score-event',
  NEWLETTER_DIALOG = 'toggle-newsletter-dialog',
  OPEN_SCORE_INFO_DIALOG = 'toggle-score-info-dialog',
  STORAGE_UPDATE = 'storage-update-event',
}

export class EventManager {
  static fireEvent<T>(eventKey: CustomEventKey, detail: T | undefined = undefined) {
    window.dispatchEvent(new CustomEvent(eventKey, { detail: detail }));
  }

  static bindEvent<T>(
    eventKey: CustomEventKey,
    listener: (event: CustomEvent<T>) => void
  ): (event: Event) => void {
    const bindedListener = (event: Event) => {
      const customEvent = event as CustomEvent<T>;
      listener(customEvent);
    };
    window.addEventListener(eventKey, bindedListener);
    return bindedListener;
  }

  static removeListener(eventKey: CustomEventKey, listener: (event: Event) => void) {
    window.removeEventListener(eventKey, listener);
  }
}
