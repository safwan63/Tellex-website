import { HERO_CAROUSEL } from '../constants/heroCarouselSpecs';

const { desktop: D, mobile: M } = HERO_CAROUSEL;

export type HeroCarouselSlide = {
  desktop: string;
  mobile: string;
  alt: string;
  desktopWidth: number;
  desktopHeight: number;
  mobileWidth: number;
  mobileHeight: number;
};
export const heroCarouselSlides: HeroCarouselSlide[] = [
  {
    desktop: '/images/D1.png',
    mobile: '/images/M1.png',
    alt: 'Curated mystery books and reading atmosphere',
    desktopWidth: D.minimumWidth,
    desktopHeight: D.minimumHeight,
    mobileWidth: M.minimumWidth,
    mobileHeight: M.minimumHeight,
  },
  {
    desktop: '/images/IMG1DESKTOP.png',
    mobile: '/images/IMG1MOBILE.PNG',
    alt: 'Tellex mystery book experience',
    desktopWidth: D.minimumWidth,
    desktopHeight: D.minimumHeight,
    mobileWidth: M.minimumWidth,
    mobileHeight: M.minimumHeight,
  },
  {
    desktop: '/images/IMG2DESKTOP.png',
    mobile: '/images/IMG2MOBILE.png',
    alt: 'Handpicked books wrapped for a Tellex surprise',
    desktopWidth: D.minimumWidth,
    desktopHeight: D.minimumHeight,
    mobileWidth: M.minimumWidth,
    mobileHeight: M.minimumHeight,
  },
  {
    desktop: '/images/IMG3DESKTOP.png',
    mobile: '/images/IMG3MOBILE.PNG',
    alt: 'Cozy reading moment with a personalised Tellex pick',
    desktopWidth: D.minimumWidth,
    desktopHeight: D.minimumHeight,
    mobileWidth: M.minimumWidth,
    mobileHeight: M.minimumHeight,
  },
  {
    desktop: '/images/IMG4DESKTOP.png',
    mobile: '/images/IMG4MOBILE.png',
    alt: 'Discover your next favorite book',
    desktopWidth: D.minimumWidth,
    desktopHeight: D.minimumHeight,
    mobileWidth: M.minimumWidth,
    mobileHeight: M.minimumHeight,
  },
];
