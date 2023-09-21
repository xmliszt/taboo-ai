export enum CustomEventKey {
  LOGIN_ERROR = 'login-error-event',
  LOGIN_REMINDER = 'login-reminder-event',
  TOGGLE_MENU = 'toggle-menu-event',
  SHARE_SCORE = 'share-score-event',
  OPEN_SCORE_INFO_DIALOG = 'toggle-score-info-dialog',
}

export class EventManager {
  static fireEvent(
    eventKey: CustomEventKey,
    detail: any | undefined = undefined
  ) {
    window.dispatchEvent(new CustomEvent(eventKey, { detail: detail }));
  }

  static bindEvent(
    eventKey: CustomEventKey,
    listener: (event: CustomEvent) => void
  ): (event: Event) => void {
    const bindedListener = (event: Event) => {
      const customEvent = event as CustomEvent;
      listener(customEvent);
    };
    window.addEventListener(eventKey, bindedListener);
    return bindedListener;
  }

  static removeListener(
    eventKey: CustomEventKey,
    listener: (event: Event) => void
  ) {
    window.removeEventListener(eventKey, listener);
  }
}
