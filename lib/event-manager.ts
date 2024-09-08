export enum CustomEventKey {
  SIGN_IN_REMINDER = 'sign-in-reminder-event',
  TOGGLE_MENU = 'toggle-menu-event',
  SHARE_SCORE = 'share-score-event',
  NEWLETTER_DIALOG = 'toggle-newsletter-dialog',
  STORAGE_UPDATE = 'storage-update-event',
  GENERIC_ALERT_DIALOG = 'toggle-generic-alert-dialog',
  GENERIC_FEEDBACK_DIALOG = 'toggle-generic-feedback-dialog',
  CLOSE_FEATURE_POPUP = 'close-feature-popup',
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
