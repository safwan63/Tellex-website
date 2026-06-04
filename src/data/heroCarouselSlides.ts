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
    desktop: '/images/b2.png',
    mobile: '/images/b2mobile.png',
    alt: 'Handpicked books wrapped for a Tellex surprise',
    desktopWidth: D.minimumWidth,
    desktopHeight: D.minimumHeight,
    mobileWidth: M.minimumWidth,
    mobileHeight: M.minimumHeight,
  },
  {
    desktop: '/images/b3.png',
    mobile: '/images/b3mobile.png',
    alt: 'Cozy reading moment with a personalised Tellex pick',
    desktopWidth: D.minimumWidth,
    desktopHeight: D.minimumHeight,
    mobileWidth: M.minimumWidth,
    mobileHeight: M.minimumHeight,
  },
];
