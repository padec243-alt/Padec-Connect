// Logo Configuration and Usage Guide
// ===========================================

import { Logo } from './components/Logo';

// USAGE EXAMPLES:

// 1. Default logo (medium size)
// <Logo />

// 2. Logo with text for header
// <Logo size="md" showText={true} />

// 3. Favicon logo (small)
// <Logo size="sm" variant="primary" />

// 4. Large logo for splash screen
// <Logo size="xl" variant="primary" className="mx-auto" />

// Props:
// - size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
// - variant: 'primary' | 'white' | 'dark' (default: 'primary')
// - showText: boolean (default: false) - Shows "PADEC Connect" text
// - className: string - Additional Tailwind classes

// Asset Organization:
// /public
//   /assets
//     /logo
//       - logo.png (main logo)
//     /icons
//       - favicon.ico (browser tab)
//       - apple-touch-icon.png (iOS)
//       - android-chrome-192x192.png
//       - android-chrome-512x512.png

export {};
