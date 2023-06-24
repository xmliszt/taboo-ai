console.log('Window loaded');
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
  console.log("Using PWA")
  dispatchEvent(new CustomEvent('closePWADrawer'));
  localStorage.setItem('pwa-user-choice', 'accepted');
} else {
  console.log("Using Browser");
  const userChoice = localStorage.getItem('pwa-user-choice');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredprompt = e;
    dispatchEvent(new CustomEvent('showInstallButton'));
    if (!userChoice || userChoice !== "cancelled") {
      localStorage.removeItem('pwa-user-choice');
      dispatchEvent(new CustomEvent('openPWADrawer'));
    }
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