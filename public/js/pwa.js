console.log('Window loaded');
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
  console.log("Using PWA")
  dispatchEvent(new CustomEvent('closePWADrawer'));
  localStorage.setItem('pwa-user-choice', 'accepted');
} else {
  console.log("Using Browser")
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredprompt = e;
    localStorage.removeItem('pwa-user-choice');
    dispatchEvent(new CustomEvent('openPWADrawer'));
    dispatchEvent(new CustomEvent('showInstallButton'));
  });
  window.addEventListener('appinstalled', () => {
    dispatchEvent(new CustomEvent('closePWADrawer'));
    localStorage.setItem('pwa-user-choice', 'accepted');
    window.deferredprompt = undefined;
    dispatchEvent(new CustomEvent('hideInstallButton'));
    console.log('PWA INSTALLED');
  });
}
window.addEventListener('InitPWAInstallation', () => {
  dispatchEvent(new CustomEvent('openPWADrawer'));
});