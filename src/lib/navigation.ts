/**
 * Navigation deep links for Waze and Google Maps
 */

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
}

export function openWaze(lat: number, lng: number): void {
  const webUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

  if (isIOS() || isAndroid()) {
    // Try native app first, fall back to web
    const appUrl = `waze://?ll=${lat},${lng}&navigate=yes`;
    const timeout = setTimeout(() => {
      window.location.href = webUrl;
    }, 500);

    window.location.href = appUrl;

    // If app opened, clear fallback
    window.addEventListener(
      'blur',
      () => clearTimeout(timeout),
      { once: true }
    );
  } else {
    window.open(webUrl, '_blank');
  }
}

export function openGoogleMaps(lat: number, lng: number): void {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  window.open(url, '_blank');
}

export function openAppleMaps(lat: number, lng: number): void {
  const url = `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
  window.open(url, '_blank');
}
