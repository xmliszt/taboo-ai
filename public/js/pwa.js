console.log('Window loaded');
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
  console.log("Using PWA")
  dispatchEvent(new CustomEvent('closePWADrawer'));
  localStorage.setItem('pwa-user-choice', 'accepted');
} else {
  console.log("Using Browser");
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredprompt = e;
    const userChoice = localStorage.getItem('pwa-user-choice');
    dispatchEvent(new CustomEvent('showInstallButton'));
    if (userChoice === null) {
      dispatchEvent(new CustomEvent('openPWADrawer'));
    } else if (userChoice !== "cancelled") {
      // User uninstalled the app
      localStorage.removeItem('pwa-user-choice');
      dispatchEvent(new CustomEvent('openPWADrawer'));
    }
  });
  window.addEventListener('appinstalled', () => {
    dispatchEvent(new CustomEvent('closePWADrawer'));
    localStorage.setItem('pwa-user-choice', 'accepted');
    window.deferredprompt = undefined;
    console.log('PWA INSTALLED');
  });
}
window.addEventListener('InitPWAInstallation', () => {
  dispatchEvent(new CustomEvent('openPWADrawer'));
});