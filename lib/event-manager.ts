export enum CustomEventKey {
  SIGN_IN_ERROR = 'sign-in-error-event',
  SIGN_IN_REMINDER = 'sign-in-reminder-event',
  TOGGLE_MENU = 'toggle-menu-event',
  SHARE_SCORE = 'share-score-event',
  NEWLETTER_DIALOG = 'toggle-newsletter-dialog',
  STORAGE_UPDATE = 'storage-update-event',
  SUBSCRIPTION_LOCK_DIALOG = 'toggle-subscription-lock-dialog',
  GENERIC_ALERT_DIALOG = 'toggle-generic-alert-dialog',
  GENERIC_FEEDBACK_DIALOG = 'toggle-generic-feedback-dialog',
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
