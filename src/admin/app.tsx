import type { StrapiApp } from '@strapi/strapi/admin';
import AuthLogo from '../extensions/auth-logo.png';
import MenuLogo from '../extensions/menu-logo.png';
import Favicon from '../extensions/favicon.png';

export default {
  config: {
    auth: {
      logo: AuthLogo,
    },
    menu: {
      logo: MenuLogo,
    },
    head: {
      favicon: Favicon,
      title: 'RRISL - Admin Dashboard',
    },
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
    translations: {
      en: {
        'Auth.form.welcome.title': 'Welcome to Rubber Research Institute of Sri Lanka',
        'Auth.form.welcome.subtitle': 'Log in to your admin account',
        'app.components.LeftMenu.navbrand.title': 'RRISL Admin Dashboard',
        'app.components.LeftMenu.navbrand.workplace': 'Rubber Research Institute',
      },
    },
    tutorials: false,
    notifications: {
      releases: false,
    },
  },
  bootstrap(app: StrapiApp) {
    // Function to replace "Strapi" in title with "RRISL - Admin Dashboard"
    const updateTitle = () => {
      if (typeof document !== 'undefined') {
        const titleElement = document.querySelector('title');
        if (titleElement && titleElement.textContent) {
          let title = titleElement.textContent;
          
          // Handle different title formats
          if (title === 'Strapi Admin' || title === 'Strapi') {
            title = 'RRISL - Admin Dashboard';
          } else if (title.includes('| Strapi')) {
            title = title.replace('| Strapi', '| RRISL - Admin Dashboard');
          } else if (title.includes('Strapi Admin')) {
            title = title.replace('Strapi Admin', 'RRISL - Admin Dashboard');
          } else if (title.includes('Strapi') && !title.includes('RRISL')) {
            // Replace any remaining "Strapi" references
            title = title.replace(/Strapi/g, 'RRISL - Admin Dashboard');
          }
          
          if (title !== titleElement.textContent) {
            titleElement.textContent = title;
          }
        }
      }
    };

    // Run immediately if DOM is ready, otherwise wait for it
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateTitle);
      } else {
        updateTitle();
      }

      // Override document.title setter
      const originalDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'title') || 
                                  Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'title');
      
      if (originalDescriptor && originalDescriptor.set) {
        const originalSet = originalDescriptor.set;
        Object.defineProperty(document, 'title', {
          set: function(value: string) {
            if (typeof value === 'string') {
              // Handle different title formats
              if (value === 'Strapi Admin' || value === 'Strapi') {
                value = 'RRISL - Admin Dashboard';
              } else if (value.includes('| Strapi')) {
                value = value.replace('| Strapi', '| RRISL - Admin Dashboard');
              } else if (value.includes('Strapi Admin')) {
                value = value.replace('Strapi Admin', 'RRISL - Admin Dashboard');
              } else if (value.includes('Strapi') && !value.includes('RRISL')) {
                // Replace any remaining "Strapi" references
                value = value.replace(/Strapi/g, 'RRISL - Admin Dashboard');
              }
            }
            originalSet.call(this, value);
          },
          get: originalDescriptor.get,
          configurable: true,
          enumerable: true,
        });
      }

      // Watch for direct DOM changes to title element
      const titleElement = document.querySelector('title');
      if (titleElement) {
        const observer = new MutationObserver(updateTitle);
        observer.observe(titleElement, { childList: true, characterData: true, subtree: true });
      }
      
      // Also set an interval to catch any titles set after page load
      setInterval(updateTitle, 100);
    }
  },
};
