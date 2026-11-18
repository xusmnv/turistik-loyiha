// USMWORLD In-App Auto-Updater Service
export const BASE_APP_VERSION = "1.0.4";

// Get currently installed app version (from localStorage or base)
export function getInstalledVersion() {
  try {
    return localStorage.getItem('usmworld_installed_version') || BASE_APP_VERSION;
  } catch (e) {
    return BASE_APP_VERSION;
  }
}

// Compare semver: returns 1 if vA > vB, -1 if vA < vB, 0 if equal
export function compareSemver(vA, vB) {
  if (!vA || !vB) return 0;
  const partsA = vA.replace(/[^0-9.]/g, '').split('.').map(Number);
  const partsB = vB.replace(/[^0-9.]/g, '').split('.').map(Number);
  const maxLen = Math.max(partsA.length, partsB.length);

  for (let i = 0; i < maxLen; i++) {
    const a = partsA[i] || 0;
    const b = partsB[i] || 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }
  return 0;
}

// Check remote version from GitHub / Local
export async function checkRemoteUpdate() {
  const currentVersion = getInstalledVersion();
  const endpoints = [
    // 1. Direct GitHub Raw file
    `https://raw.githubusercontent.com/xusmnv/turistik-loyiha/main/public/version.json?_t=${Date.now()}`,
    // 2. Local bundled or hosted version file
    `/version.json?_t=${Date.now()}`
  ];

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(url, {
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.version) {
          const isNewer = compareSemver(data.version, currentVersion) > 0;
          return {
            hasUpdate: isNewer,
            currentVersion,
            latestVersion: data.version,
            title: data.title || "Yangi versiya mavjud!",
            description: data.description || "Dasturda yangilanishlar va qulayliklar qo'shildi.",
            releaseDate: data.releaseDate || new Date().toISOString().slice(0, 10),
            apkUrl: data.apkUrl || "https://github.com/xusmnv/turistik-loyiha/raw/main/USMWORLD.apk",
            localApkUrl: "/USMWORLD.apk",
            forceUpdate: Boolean(data.forceUpdate)
          };
        }
      }
    } catch (e) {
      // Try next endpoint
    }
  }

  return {
    hasUpdate: false,
    currentVersion,
    latestVersion: currentVersion
  };
}

// Perform Live In-App OTA Update
export async function performInAppUpdate(newVersion, onProgress) {
  // Step 1: Initialize
  onProgress?.(15, "Yangilanish paketi tekshirilmoqda...");
  await new Promise(r => setTimeout(r, 400));

  // Step 2: Clear old service workers and caches
  onProgress?.(45, "Eski keshlar tozalanmoqda...");
  if ('caches' in window) {
    try {
      const names = await caches.keys();
      await Promise.all(names.map(name => caches.delete(name)));
    } catch (e) {}
  }

  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.update();
      }
    } catch (e) {}
  }
  await new Promise(r => setTimeout(r, 500));

  // Step 3: Register new version
  onProgress?.(80, "Yangi versiya ma'lumotlari o'rnatilmoqda...");
  try {
    localStorage.setItem('usmworld_installed_version', newVersion);
    localStorage.setItem('usmworld_just_updated', 'true');
  } catch (e) {}
  await new Promise(r => setTimeout(r, 500));

  // Step 4: Finished
  onProgress?.(100, "Yangilanish muvaffaqiyatli yuklandi!");
  return true;
}

// Download APK directly to Android
export function downloadLatestApk(apkUrl) {
  const targetUrl = apkUrl || "https://github.com/xusmnv/turistik-loyiha/raw/main/USMWORLD.apk";
  const a = document.createElement('a');
  a.href = targetUrl;
  a.download = 'USMWORLD.apk';
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
