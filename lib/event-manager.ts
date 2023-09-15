export enum CustomEventKey {
  LOGIN_ERROR = 'login-error-event',
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
  ) {
    window.addEventListener(eventKey, (event) => {
      const customEvent = event as CustomEvent;
      listener(customEvent);
    });
  }
}
