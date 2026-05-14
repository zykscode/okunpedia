/**
 * Client injection component registering the local service worker script supporting progressive web app offline resilience.
 * @returns {React.ReactNode} Inline registration script wrapper nodes.
 */
export const PwaRegistration = () => {
  const code = `
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').catch(function() {
          // Fail gracefully in restricted sandbox testing environments
        });
      });
    }
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
};
