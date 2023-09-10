interface Window {
  deferredprompt: BeforeInstallPromptEvent | undefined;
}

window.deferredprompt = window.deferredprompt || {};
