/**
 * Reserved region for Google Identity Services One Tap (`google.accounts.id`).
 * Mount GIS into `#google-one-tap-mount` when the API is wired; until then the node stays empty.
 */
const GoogleOneTapPlaceholder = () => (
  <div
    id="google-one-tap-mount"
    className="fixed bottom-6 right-6 z-60 min-h-12 w-[min(400px,calc(100vw-2rem))] max-w-full"
    aria-hidden
  />
);

export default GoogleOneTapPlaceholder;
