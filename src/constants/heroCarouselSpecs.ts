/**
 * Hero carousel export specs — use these when creating b1.png, b2.png, b3.png
 * and b1-mobile.png, b2-mobile.png, b3-mobile.png in public/images/
 */
export const HERO_CAROUSEL = {
  /** Breakpoint matches Tailwind `lg` and <picture> media queries */
  desktopMinWidthPx: 1024,

  desktop: {
    /** Frame & file aspect ratio (matches current b1–b3.png) */
    aspectRatio: '1336 / 409',
    aspectLabel: '1336∶409 (~3.27∶1)',
    /** Recommended export pixels */
    width: 3840,
    height: 1174,
    minimumWidth: 1920,
    minimumHeight: 587,
    files: ['b1.png', 'b2.png', 'b3.png'] as const,
  },

  mobile: {
    /** Frame aspect ratio on phones */
    aspectRatio: '390 / 338',
    aspectLabel: '390∶338 (~1.15∶1)',
    /** Recommended export pixels (@2x retina) */
    width: 1560,
    height: 1352,
    minimumWidth: 780,
    minimumHeight: 676,
    files: ['b1-mobile.png', 'b2-mobile.png', 'b3-mobile.png'] as const,
  },
} as const;
