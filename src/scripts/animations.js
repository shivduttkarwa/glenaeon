//Marqeee Animation Script

// Variables for scroll tracking
let currentScroll = 0;
let isScrollingDown = true;


function initMarqueeAnimation() {

  let tween = gsap.to(".marquee__part", {
    xPercent: -100,
    repeat: -1,
    duration: 10,
    ease: "linear"
  }).totalProgress(0.5);


  gsap.set(".marquee__inner", { xPercent: -50 });


  window.addEventListener("scroll", function () {

    if (window.pageYOffset > currentScroll) {
      isScrollingDown = true;
    } else {
      isScrollingDown = false;
    }


    gsap.to(tween, {
      timeScale: isScrollingDown ? 1 : -1,
      duration: 0.3,
      ease: "power2.out"
    });

    currentScroll = window.pageYOffset;
  });
}


// ==========================================================================
// VIDEO TESTIMONIALS CLIP/SLIDE ANIMATIONS - START

// ==========================================================================
const VIDEO_SECTION_SELECTOR = '.video-testimonials';
const CLIP_REVEAL_DURATION = 0.9;
const CARD_STAGGER = 0.1;
let videoTestimonialsAnimationsInitialized = false;
const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';

if (hasScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollSmoother !== 'undefined') {
    gsap.registerPlugin(ScrollSmoother);
  }
}

const SCROLL_SMOOTHER_BREAKPOINT = 1024;
let scrollSmootherInstance = null;
let scrollSmootherWatchersAttached = false;
let desktopMediaQuery = null;
let pointerFineMediaQuery = null;
let reduceMotionMediaQuery = null;

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  desktopMediaQuery = window.matchMedia(`(min-width: ${SCROLL_SMOOTHER_BREAKPOINT}px)`);
  pointerFineMediaQuery = window.matchMedia('(pointer: fine)');
  reduceMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
}

function shouldEnableScrollSmoother() {
  if (typeof ScrollSmoother === 'undefined') return false;

  const matchesDesktop = desktopMediaQuery ? desktopMediaQuery.matches : window.innerWidth >= SCROLL_SMOOTHER_BREAKPOINT;
  const hasFinePointer = pointerFineMediaQuery ? pointerFineMediaQuery.matches : true;
  const prefersReducedMotion = reduceMotionMediaQuery ? reduceMotionMediaQuery.matches : false;

  // Additional check to prevent ScrollSmoother on touch devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return matchesDesktop && hasFinePointer && !prefersReducedMotion && !isTouchDevice;
}

function setScrollSmootherBodyState(isEnabled) {
  const body = document.body;
  if (!body) return;
  body.classList.toggle('smoother-enabled', Boolean(isEnabled));
}

function updateScrollSmootherInstance() {
  if (!shouldEnableScrollSmoother()) {
    if (scrollSmootherInstance) {
      scrollSmootherInstance.kill();
      scrollSmootherInstance = null;
      setScrollSmootherBodyState(false);
      // Remove inline props so native scrolling feels normal again
      gsap.set('#smooth-wrapper, #smooth-content', { clearProps: 'all' });
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    } else {
      setScrollSmootherBodyState(false);
    }
    return;
  }

  if (!scrollSmootherInstance) {
    scrollSmootherInstance = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1,
      effects: true,
      smoothTouch: false
    });
    setScrollSmootherBodyState(true);

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }
}

function initScrollSmootherManager() {
  if (typeof ScrollSmoother === 'undefined') {
    return;
  }

  updateScrollSmootherInstance();

  if (scrollSmootherWatchersAttached) {
    return;
  }

  const mediaQueries = [desktopMediaQuery, pointerFineMediaQuery, reduceMotionMediaQuery].filter(Boolean);

  mediaQueries.forEach(mq => {
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', updateScrollSmootherInstance);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(updateScrollSmootherInstance);
    }
  });

  window.addEventListener('resize', updateScrollSmootherInstance);
  window.addEventListener('orientationchange', updateScrollSmootherInstance);

  scrollSmootherWatchersAttached = true;
}

function initVideoTestimonialsAnimations() {
  if (videoTestimonialsAnimationsInitialized) return;
  // Support both video-testimonials and moments sections
  const sections = document.querySelectorAll(VIDEO_SECTION_SELECTOR + ', .moments-section, .arc-slider-stage');
  if (!sections.length || typeof gsap === 'undefined') return;
  videoTestimonialsAnimationsInitialized = true;

  sections.forEach(section => {
    // Setup reveal animations for desktop cards
    setupVideoCardsReveal(section);

    // Keep mobile and text animations as they work fine
    setupMobileSlideAnimations(section);
    setupTextHideOnPlay(section);
  });

  // Setup reveal animations for feature cards (only once)
  setupFeatureCardsReveal();
}

function setupVideoCardsReveal(section) {
  // Support both video-testimonials and moments sections
  // For video-testimonials: desktop cards
  const desktopCards = section.querySelectorAll('.cards.desktop-only .video-card, .cards.desktop-only .card');

  const allCards = [...desktopCards];

  if (allCards.length > 0) {
    allCards.forEach(card => {
      card.classList.add('video-reveal-animation', 'card-clip-reveal');
    });
  }
}

function setupFeatureCardsReveal() {
  const featureCards = document.querySelectorAll('.features-cards-slider .feature-card');

  if (featureCards.length > 0) {
    featureCards.forEach(card => {
      // Skip clip animation for cards in what-we-do-section
      const isInWhatWeDoSection = card.closest('.what-we-do-section');

      if (isInWhatWeDoSection) {
        // Only add the reveal animation, not the clip animation
        card.classList.add('feature-reveal-animation');
      } else {
        // Add both reveal and clip animations for other pages
        card.classList.add('feature-reveal-animation', 'card-clip-reveal');
      }
    });
  }
}

function setupMobileSlideAnimations(section) {
  // For video-testimonials: mobile swiper
  let sliderEl = section.querySelector('.video-testimonials-swiper .swiper');

  if (!sliderEl) return;

  // Support both old and new class names
  const cardContents = sliderEl.querySelectorAll('.video-card-content, .card-content');
  cardContents.forEach(content => {
    gsap.set(content, { y: 70, opacity: 0 });
  });

  const animateActiveSlide = () => {
    const activeSlide = sliderEl.querySelector('.swiper-slide-active');
    if (!activeSlide) return;
    // Support both old and new class names
    // For moments section, content is nested inside .moments-card
    const cardContent = activeSlide.querySelector('.moments-card .video-card-content, .moments-card .card-content, .video-card-content, .card-content');
    if (!cardContent) return;

    gsap.to(cardContent, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'back.out(1.7)'
    });
  };
  const hideContent = content => {
    if (!content) return;
    gsap.to(content, {
      y: 40,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.inOut'
    });
  };

  let currentSlideContent = null;

  const attachToSwiper = () => {
    const swiperInstance = sliderEl.swiper;
    if (!swiperInstance) return false;
    const setCurrentContent = () => {
      const activeSlide = sliderEl.querySelector('.swiper-slide-active');
      if (!activeSlide) {
        currentSlideContent = null;
        return;
      }
      // Support both old and new class names
      // For moments section, content is nested inside .moments-card
      currentSlideContent = activeSlide.querySelector('.moments-card .video-card-content, .moments-card .card-content, .video-card-content, .card-content') || null;
    };

    setCurrentContent();
    if (currentSlideContent) {
      gsap.set(currentSlideContent, { y: 0, opacity: 1 });
    }

    swiperInstance.on('slideChangeTransitionStart', () => {
      hideContent(currentSlideContent);
    });

    swiperInstance.on('slideChangeTransitionEnd', () => {
      setCurrentContent();
      animateActiveSlide();
    });

    // Animate initial active slide
    setCurrentContent();
    animateActiveSlide();

    return true;
  };

  if (!attachToSwiper()) {
    const poll = setInterval(() => {
      if (attachToSwiper()) {
        clearInterval(poll);
      }
    }, 200);
  } else {
    // If swiper is already available, animate initial slide immediately
    const activeSlide = sliderEl.querySelector('.swiper-slide-active');
    if (activeSlide) {
      const cardContent = activeSlide.querySelector('.moments-card .video-card-content, .moments-card .card-content, .video-card-content, .card-content');
      if (cardContent) {
        gsap.set(cardContent, { y: 0, opacity: 1 });
      }
    }
  }
}

function setupTextHideOnPlay(section) {
  // Support both old and new class names for backward compatibility
  const buttons = section.querySelectorAll('.video-card-play-button, .play-button');
  if (!buttons.length) return;
  buttons.forEach(button => {
    // Support both old and new class names
    const card = button.closest('.video-card, .card');
    const cardInfo = card?.querySelector('.video-card-info, .card-info');
    if (cardInfo) {
      gsap.set(cardInfo, { x: 0, opacity: 1 });
    }
  });

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') return;
      const button = mutation.target;
      // Support both old and new class names
      const card = button.closest('.video-card, .card');
      const cardInfo = card?.querySelector('.video-card-info, .card-info');
      if (!cardInfo) return;

      const isActive = button.classList.contains('is-active');
      gsap.to(cardInfo, {
        x: isActive ? -40 : 0,
        opacity: isActive ? 0 : 1,
        duration: 0.35,
        ease: 'power2.out'
      });
    });
  });

  buttons.forEach(button => {
    observer.observe(button, { attributes: true, attributeFilter: ['class'] });
  });
}
// ==========================================================================
// VIDEO TESTIMONIALS CLIP/SLIDE ANIMATIONS - END
// ==========================================================================



// ==========================================================================
// FEATURED CARDS SCROLL EFFECT - START
// ==========================================================================

function initFeaturedCardsScrollEffect() {
  const featuresSlider = document.querySelector('.features-cards-slider');
  if (!featuresSlider) return;

  const cards = featuresSlider.querySelectorAll('.feature-card');
  if (!cards.length) return;

  // Add subtle scroll-based parallax effect to cards
  cards.forEach((card, index) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1, // Smooth scrubbing
        onUpdate: (self) => {
          // Create subtle inward movement effect on scroll
          const progress = self.progress;
          const moveAmount = (progress - 0.5) * 20; // Subtle 20px movement

          gsap.set(card, {
            y: moveAmount,
            scale: 1 - Math.abs(progress - 0.5) * 0.05, // Slight scale effect
          });
        }
      }
    });
  });

  console.log(`Added scroll effect to ${cards.length} feature cards`);
}

// ==========================================================================
// FEATURED CARDS SCROLL EFFECT - END
// ==========================================================================

// ==========================================================================
// PARALLAX BACKGROUND - START
// ==========================================================================
function initParallaxBackgrounds() {
  if (typeof gsap === 'undefined' || !hasScrollTrigger) {
    return;
  }

  const parallaxItems = document.querySelectorAll('.parallax-custom-js');
  if (!parallaxItems.length) {
    return;
  }

  parallaxItems.forEach(item => {
    const container = item.closest('.parallax-custom-container-js');
    if (!container) return;

    const startValue = item.classList.contains('parallax-custom-hero-js') ? 'top top' : 'top bottom';

    ScrollTrigger.create({
      trigger: container,
      start: startValue,
      end: 'bottom top',
      pin: item,
      pinSpacing: false,
    });
  });
}
// ==========================================================================
// PARALLAX BACKGROUND - END
// ==========================================================================

// ==========================================================================
// FOOTER BRAND TEXT REVEAL - START
// ==========================================================================
function initFooterBrandReveal() {
  if (typeof gsap === 'undefined' || !hasScrollTrigger) {
    return;
  }

  const prefersReducedMotion = reduceMotionMediaQuery ? reduceMotionMediaQuery.matches : false;
  const innerItems = Array.from(document.querySelectorAll('.footer__brand-inner'));
  const outerItems = Array.from(document.querySelectorAll('.footer__brand'))
    .filter((item) => !item.querySelector('.footer__brand-inner'));
  const brandItems = [...innerItems, ...outerItems];
  if (!brandItems.length) {
    return;
  }

  brandItems.forEach((item) => {
    if (item.dataset.footerBrandAnimated === 'true') {
      return;
    }

    const mediaEl = item.querySelector('object, svg, img');
    if (mediaEl) {
      item.dataset.footerBrandAnimated = 'true';

      // Check mobile once for all mobile-specific logic
      const isMobile = window.innerWidth <= 768;

      // Don't set overflow hidden on mobile to prevent text clipping
      if (!isMobile) {
        gsap.set(item, { overflow: 'hidden' });
      }

      if (prefersReducedMotion) {
        gsap.set(mediaEl, { yPercent: 0, clearProps: 'transform' });
        return;
      }

      // Mobile animation values - easy to tweak
      const mobileStart = 100;    // Starting position (yPercent)
      const mobileEnd = 0;        // Ending position (yPercent) - changed from -10 to prevent top clipping

      // Desktop animation values
      const desktopStart = 120;
      const desktopEnd = 0;

      const initialYPercent = isMobile ? mobileStart : desktopStart;
      const finalYPercent = isMobile ? mobileEnd : desktopEnd;

      gsap.set(mediaEl, { yPercent: initialYPercent });

      // Different trigger points for mobile vs desktop
      const mobileScrollStart = 'top 90%';   // Mobile start trigger - easy to tweak
      const mobileScrollEnd = 'top 40%';     // Mobile end trigger - easy to tweak
      const desktopScrollStart = 'top 90%';
      const desktopScrollEnd = 'top 30%';

      const scrollStart = isMobile ? mobileScrollStart : desktopScrollStart;
      const scrollEnd = isMobile ? mobileScrollEnd : desktopScrollEnd;

      gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: scrollStart,
          end: scrollEnd,
          scrub: true
        }
      }).to(mediaEl, {
        yPercent: finalYPercent,
        duration: 2.6,
        ease: 'back.out(1)'
      });
      return;
    }

    let textSpan = item.querySelector('.footer__brand-text');
    if (!textSpan) {
      const textContent = item.textContent;
      if (!textContent || !textContent.trim()) {
        return;
      }
      item.textContent = '';
      textSpan = document.createElement('span');
      textSpan.className = 'footer__brand-text';
      textSpan.textContent = textContent;
      item.appendChild(textSpan);
    }

    if (textSpan.dataset.split !== 'true') {
      const text = textSpan.textContent || '';
      textSpan.textContent = '';
      const fragment = document.createDocumentFragment();
      Array.from(text).forEach((char) => {
        const wrap = document.createElement('span');
        wrap.className = 'footer__brand-char-wrap';
        const inner = document.createElement('span');
        inner.className = 'footer__brand-char';
        inner.textContent = char;
        wrap.appendChild(inner);
        fragment.appendChild(wrap);
      });
      textSpan.appendChild(fragment);
      textSpan.dataset.split = 'true';
    }

    const chars = textSpan.querySelectorAll('.footer__brand-char');

    item.dataset.footerBrandAnimated = 'true';
    if (prefersReducedMotion) {
      gsap.set(chars, { yPercent: 0, clearProps: 'transform' });
      return;
    }

    // Use different initial positioning for mobile vs desktop
    const isMobile = window.innerWidth <= 768;
    const initialYPercent = isMobile ? 80 : 120;

    gsap.set(chars, { yPercent: initialYPercent });

    gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 90%',
        end: 'top 30%',
        scrub: true
      }
    }).to(chars, {
      yPercent: 0,
      duration: 2.6,
      stagger: 0,
      ease: 'back.out(1)'
    });
  });
}
// ==========================================================================
// FOOTER BRAND TEXT REVEAL - END
// ==========================================================================

// ==========================================================================
// DIVIDER LINE REVEAL - START
// ==========================================================================
function initDeviderLineAnimation() {
  if (typeof gsap === 'undefined') {
    return;
  }

  const sections = document.querySelectorAll('.devider');
  if (!sections.length) {
    return;
  }

  sections.forEach((section, index) => {
    if (section.dataset.deviderAnimated === 'true') {
      return;
    }

    const svg = section.querySelector('svg');
    const clipPath = svg ? svg.querySelector('clipPath') : null;
    const revealRect = svg ? svg.querySelector('.devider__reveal') : null;
    const clipTarget = svg ? svg.querySelector('[clip-path]') : null;
    if (!svg || !clipPath || !revealRect || !clipTarget) {
      return;
    }

    section.dataset.deviderAnimated = 'true';

    const viewBox = svg.viewBox && svg.viewBox.baseVal;
    const maxWidth = viewBox && viewBox.width ? viewBox.width : 0;
    const maxHeight = viewBox && viewBox.height ? viewBox.height : 0;
    const targetWidth = maxWidth || 1239;
    const targetHeight = maxHeight || 22;

    const clipId = `devider-clip-${index}`;
    clipPath.id = clipId;
    clipTarget.setAttribute('clip-path', `url(#${clipId})`);

    if (typeof ScrollTrigger === 'undefined') {
      revealRect.setAttribute('width', targetWidth);
      revealRect.setAttribute('height', targetHeight);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    gsap.set(revealRect, {
      attr: {
        width: 0,
        height: targetHeight
      }
    });

    const smoother = typeof ScrollSmoother !== 'undefined' ? ScrollSmoother.get() : null;
    const scrollerEl = smoother ? smoother.wrapper() : null;

    gsap.to(revealRect, {
      attr: {
        width: targetWidth
      },
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        scroller: scrollerEl || undefined,
        start: 'top bottom',
        end: 'bottom 30%',
        scrub: true
      }
    });
  });
}
// ==========================================================================
// DIVIDER LINE REVEAL - END
// ==========================================================================

// ==========================================================================
// ABOUT SEPARATOR ANIMATION - START
// ==========================================================================
function initAboutSeparatorAnimation() {
  if (typeof gsap === 'undefined' || !hasScrollTrigger) {
    return;
  }

  const separator = document.querySelector('.about-glenaeon-section__separator');
  const separatorSvg = separator ? separator.querySelector('svg') : null;
  const revealRect = separator ? separator.querySelector('.about-glenaeon-section__separator-reveal') : null;
  if (!separatorSvg || !revealRect) return;

  const viewBox = separatorSvg.viewBox && separatorSvg.viewBox.baseVal;
  const maxWidth = viewBox && viewBox.width ? viewBox.width : 0;
  const maxHeight = viewBox && viewBox.height ? viewBox.height : 0;

  gsap.set(revealRect, {
    attr: {
      width: 0,
      height: maxHeight || 22
    }
  });

  const smoother = typeof ScrollSmoother !== 'undefined' ? ScrollSmoother.get() : null;
  const scrollerEl = smoother ? smoother.wrapper() : null;

  gsap.to(revealRect, {
    attr: {
      width: maxWidth || 1239
    },
    ease: 'none',
    scrollTrigger: {
      trigger: separator,
      scroller: scrollerEl || undefined,
      start: 'top bottom',
      end: 'bottom 30%',
      scrub: true
    }
  });
}
// ==========================================================================
// ABOUT SEPARATOR ANIMATION - END
// ==========================================================================

function initAnimations() {
  if (typeof gsap === 'undefined') {
    return;
  }
  // Create the ScrollSmoother (desktop/fine pointer only) before ScrollTriggers
  initScrollSmootherManager();
  initMarqueeAnimation();
  initVideoTestimonialsAnimations();
  initRevealAnimations();
  initFooterBrandReveal();
  initDeviderLineAnimation();
  initAboutSeparatorAnimation();
  initParallaxBackgrounds();
  // Featured cards now use swiper instead of GSAP scroll effect

  // Safe ScrollTrigger refresh after animations are set up
  if (typeof ScrollTrigger !== 'undefined') {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }

}

// Card reveal animation system
function initRevealAnimations() {
  const videoItems = document.querySelectorAll('.video-reveal-animation');
  const featureItems = document.querySelectorAll('.feature-reveal-animation');

  const allAnimationItems = [...videoItems, ...featureItems];
  if (!allAnimationItems.length) return;

  // Set initial state for clip reveal items
  const clipItems = document.querySelectorAll('.card-clip-reveal');
  if (clipItems.length > 0) {
    gsap.set('.card-clip-reveal', {
      '--clip-value': '100%',
    });
  }

  function animation_def({ card, ease_default = 'power1.out', index = 0, is_static = false } = {}) {
    if (!is_static) {
      gsap.to(card, {
        duration: 0.7, ease: ease_default, x: 0, y: 0, delay: index * 0.1
      });
    }
    gsap.to(card, {
      duration: 0.5, ease: ease_default, autoAlpha: 1, delay: index * 0.1 + 0.1
    });
  }

  function animateRevealElements(elements) {
    elements.forEach((card, index) => {
      if (card.classList.contains('card-clip-reveal')) {
        // Smooth clip reveal animation for cards
        gsap.fromTo(card, {
          '--clip-value': '100%',
        }, {
          duration: 1.1,
          ease: 'power3.out',
          '--clip-value': '0%',
          delay: index * 0.2,
          onStart: function () {
            card.classList.add('animation-started');
          },
          onComplete: function () {
            card.classList.add('clip-animation-complete', 'animation-finished');
          }
        });
      }
    });
  }

  // ScrollTrigger reveal animation for all elements
  ScrollTrigger.batch('.video-reveal-animation, .feature-reveal-animation', {
    start: 'top bottom-=100',
    once: true,
    onEnter: elements => {
      animateRevealElements(elements);
    }
  });
}


if (typeof ScrollTrigger !== 'undefined') {
  // Refresh on window resize (already standard practice)
  window.addEventListener('resize', () => {
    // ScrollTrigger.refresh();
  });

  // Gentle refresh on page visibility change (handles soft refresh)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      requestAnimationFrame(() => {
        // ScrollTrigger.refresh();
      });
    }
  });
}



document.addEventListener('DOMContentLoaded', initAnimations);


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}




//==========================================================================
// GSAP AUTO-ANIMATIONS CLASS
//==========================================================================


//======Documentation======//

// GSAP Auto-Animations - One-time scroll animations
// Just add data-gsap="animation-name" to any element to animate it
//

// DEFAULT VALUES (customize in constructor):
// - delay: 0 (seconds)
// - duration: 1.25 (seconds)
// - start: 'top 80%' (when animation triggers - ideal for one-time animations)
//
// Note: stagger has no default - only applies when explicitly set via data-gsap-stagger
//
// Usage examples:
// <div data-gsap="fade-up">Content</div>
// <img data-gsap="zoom-out" data-gsap-start="top 80%">
// <div data-gsap="clip-reveal" data-gsap-duration="1.5">Card</div>
// <h2 data-gsap="chars">Animated Title</h2>
// <div data-gsap="slide-up">Slide from bottom</div>
// <h1 data-gsap="scale-up">Scale from 0 to normal size</h1>
// <p data-gsap="lines">Line by line animation - auto-detects lines</p>
// <p data-gsap="lines" data-gsap-stagger="0.2">Custom stagger between lines</p>
//
// Stagger children (automatically animates all direct children):
// <div data-gsap="fade-up" data-gsap-stagger="0.2">
//   <div>Child 1</div>
//   <div>Child 2</div>
//   <div>Child 3</div>
// </div>
//
// Available animations:
// - fade-up, fade-down, fade-left, fade-right, fade-in (subtle movement + fade)
// - slide-up, slide-down, slide-left, slide-right (dramatic movement + fade)
// - zoom-in (scale from 0 with bounce), zoom-out (scale down from 1.3x)
// - scale-up (scale from 0 to 1 at center, no movement)
// - clip-reveal (mask reveal effect)
// - clip-reveal-center (center-out clip reveal effect)
// - writing-text (handwriting-style clip reveal)
// - chars (character-by-character text animation)
// - lines (line-by-line slide up - auto-detects lines on any device)
// - what-we-do-header (section title + logo scrub animation)
// - what-we-do-cards (feature card circles + content reveal)
// - hero-about (about hero line slide-in, waits for body.loaded when data-gsap-wait-loaded is set)
// - hero-home (home hero script reveal + bold character rise)
// - hero-learning (script clip reveal + bold character rise)
// - hero-preschool (script tracking reveal + bold character rise + optional description/play button)
// - hero-wellbeing (scroll-triggered hero character reveal)
//
// Optional attributes:
// - data-gsap-delay="0.5" (delay in seconds)
// - data-gsap-duration="1" (duration in seconds)
// - data-gsap-stagger="0.2" (animates direct children with stagger delay)
// - data-gsap-start="top 80%" (ScrollTrigger start position)
// - data-gsap-ease="power2.out" (custom easing function)

class GSAPAnimations {
  constructor() {
    // Default configuration - customize these values as needed
    this.defaults = {
      delay: 0,
      duration: 1.25,
      start: 'top 80%',  // Ideal for one-time animations - triggers when element is ~20% visible
      ease: {
        fade: 'power2.out',
        zoom: 'power2.out',
        zoomIn: 'back.out(1.4)',
        slide: 'power2.out',
        clip: 'power3.out',
        chars: 'expo.out'
      }
    };

    this.init();
  }

  init() {
    if (typeof gsap === 'undefined' || !gsap.registerPlugin) {
      console.warn('GSAP not loaded');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.setupAnimations();
  }

  setupAnimations() {
    // Find all elements with data-gsap attribute
    const elements = document.querySelectorAll('[data-gsap]');

    elements.forEach(el => {
      const animationType = el.getAttribute('data-gsap');

      // Get values from attributes or use defaults
      const staggerAttr = el.getAttribute('data-gsap-stagger');
      const config = {
        delay: parseFloat(el.getAttribute('data-gsap-delay')) || this.defaults.delay,
        duration: parseFloat(el.getAttribute('data-gsap-duration')) || this.defaults.duration,
        stagger: staggerAttr ? parseFloat(staggerAttr) : null, // Only use stagger if explicitly set
        start: el.getAttribute('data-gsap-start') || this.defaults.start,
        ease: el.getAttribute('data-gsap-ease') || null
      };

      switch (animationType) {
        case 'fade-up':
          this.fadeUp(el, config);
          break;
        case 'fade-down':
          this.fadeDown(el, config);
          break;
        case 'fade-left':
          this.fadeLeft(el, config);
          break;
        case 'fade-right':
          this.fadeRight(el, config);
          break;
        case 'fade-in':
          this.fadeIn(el, config);
          break;
        case 'zoom-in':
          this.zoomIn(el, config);
          break;
        case 'zoom-out':
          this.zoomOut(el, config);
          break;
        case 'clip-reveal':
          this.clipReveal(el, config);
          break;
        case 'clip-reveal-center':
          this.clipRevealCenter(el, config);
          break;
        case 'writing-text':
          this.writingText(el, config);
          break;
        case 'chars':
          this.charsAnimation(el, config);
          break;
        case 'lines':
          this.linesAnimation(el, config);
          break;
        case 'slide-left':
          this.slideLeft(el, config);
          break;
        case 'slide-right':
          this.slideRight(el, config);
          break;
        case 'slide-up':
          this.slideUp(el, config);
          break;
        case 'slide-down':
          this.slideDown(el, config);
          break;
        case 'scale-up':
          this.scaleUp(el, config);
          break;
        case 'what-we-do-header':
          this.whatWeDoHeader(el, config);
          break;
        case 'what-we-do-cards':
          this.whatWeDoCards(el, config);
          break;
        case 'hero-about':
          this.heroAbout(el, config);
          break;
        case 'hero-home':
          this.heroHome(el, config);
          break;
        case 'hero-learning':
          this.heroLearning(el, config);
          break;
        case 'hero-preschool':
          this.heroPreschool(el, config);
          break;
        case 'hero-wellbeing':
          this.heroWellbeing(el, config);
          break;
        default:
          console.warn(`Unknown animation type: ${animationType}`);
      }
    });
  }

  // Helper to build ScrollTrigger config for one-time animations
  buildScrollTrigger(el, config) {
    return {
      trigger: el,
      start: config.start,
      toggleActions: 'play none none none'
    };
  }

  // Fade animations
  fadeUp(el, config) {
    // Check if stagger is defined and has children
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    // Set initial state immediately to prevent flash of visible content (FOUC)
    gsap.set(target, { y: 50, autoAlpha: 0 });

    gsap.to(target,
      {
        y: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.fade,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  fadeDown(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { y: -50, autoAlpha: 0 });

    gsap.to(target,
      {
        y: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.fade,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  fadeLeft(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { x: -50, autoAlpha: 0 });

    gsap.to(target,
      {
        x: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.fade,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  fadeRight(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { x: 50, autoAlpha: 0 });

    gsap.to(target,
      {
        x: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.fade,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  fadeIn(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { autoAlpha: 0 });

    gsap.to(target,
      {
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.fade,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  // Zoom animations
  zoomIn(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { scale: 0, autoAlpha: 0 });

    gsap.to(target,
      {
        scale: 1,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.zoomIn,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  zoomOut(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { scale: 1.3 });

    gsap.to(target,
      {
        scale: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.zoom,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  // Slide animations
  slideLeft(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { x: -100, autoAlpha: 0 });

    gsap.to(target,
      {
        x: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.slide,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  slideRight(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { x: 100, autoAlpha: 0 });

    gsap.to(target,
      {
        x: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.slide,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  slideUp(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { y: 100, autoAlpha: 0 });

    gsap.to(target,
      {
        y: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.slide,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  slideDown(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { y: -100, autoAlpha: 0 });

    gsap.to(target,
      {
        y: 0,
        autoAlpha: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.slide,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  // Scale animation
  scaleUp(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    gsap.set(target, { scale: 0, transformOrigin: 'center center' });

    gsap.to(target,
      {
        scale: 1,
        duration: config.duration,
        ease: config.ease || this.defaults.ease.zoom,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config)
      }
    );
  }

  // Clip reveal animation
  clipReveal(el, config) {
    const children = el.children.length > 0 ? Array.from(el.children) : null;
    const target = children && config.stagger ? children : el;

    if (children && config.stagger) {
      children.forEach(child => child.classList.add('card-clip-reveal'));
    } else {
      el.classList.add('card-clip-reveal');
    }

    gsap.set(target, { '--clip-value': '100%' });

    gsap.to(target,
      {
        '--clip-value': '0%',
        duration: config.duration,
        ease: config.ease || this.defaults.ease.clip,
        delay: config.delay,
        stagger: children && config.stagger ? config.stagger : 0,
        scrollTrigger: this.buildScrollTrigger(el, config),
        onComplete: () => {
          if (children && config.stagger) {
            children.forEach(child => child.classList.add('clip-animation-complete'));
          } else {
            el.classList.add('clip-animation-complete');
          }
        }
      }
    );
  }

  // Clip reveal animation from center to both sides
  clipRevealCenter(el, config) {
    if (!el) return;

    const targets = el.querySelectorAll(`
.three-campuses-section__card-image-wrapper img,
.three-campuses-section .masked-image-content-block-wrap .image-wrap img
`);

    if (!targets.length) return;

    const hasStartAttr = el.hasAttribute('data-gsap-start');
    const hasDurationAttr = el.hasAttribute('data-gsap-duration');
    const hasEaseAttr = el.hasAttribute('data-gsap-ease');
    const hasDelayAttr = el.hasAttribute('data-gsap-delay');

    const start = hasStartAttr ? config.start : 'top 55%';
    const duration = hasDurationAttr && Number.isFinite(config.duration) ? config.duration : 0.9;
    const ease = hasEaseAttr ? config.ease : 'none';
    const delay = hasDelayAttr && Number.isFinite(config.delay) ? config.delay : 0;

    targets.forEach((img) => {
      if (img.dataset.clipRevealInit === 'true') return;
      img.dataset.clipRevealInit = 'true';

      const triggerElement = img.closest('.three-campuses-section__card') || img.closest('.col-lg-4') || img;
      gsap.set(img, { willChange: 'transform, clip-path' });

      gsap.fromTo(img,
        {
          clipPath: 'inset(50% 0 50% 0)',
          y: 30,
          opacity: 1
        },
        {
          clipPath: 'inset(0% 0 0% 0)',
          y: 0,
          opacity: 1,
          duration,
          ease,
          delay,
          scrollTrigger: {
            trigger: triggerElement,
            start,
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    });
  }

  // Writing text animation (clip reveal)
  writingText(el, config) {
    if (!el) return;

    const prefersReducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    const scriptWrite = this.prepareHeroScriptWriting(el);
    const target = scriptWrite && scriptWrite.text
      ? scriptWrite.text
      : el.querySelector('.hero-script-text') || el;

    const hasDurationAttr = el.hasAttribute('data-gsap-duration');
    const hasEaseAttr = el.hasAttribute('data-gsap-ease');
    const hasDelayAttr = el.hasAttribute('data-gsap-delay');

    const duration = hasDurationAttr && Number.isFinite(config.duration) ? config.duration : 1.1;
    const ease = hasEaseAttr ? config.ease : 'power2.out';
    const delay = hasDelayAttr && Number.isFinite(config.delay) ? config.delay : 0;

    const clipStart = 'inset(-0.4em 100% -0.4em 0)';
    const clipEnd = 'inset(-0.4em 0% -0.4em 0)';

    gsap.set(target, {
      clipPath: clipStart,
      webkitClipPath: clipStart,
      opacity: 0,
      y: 6,
      willChange: 'clip-path, transform, opacity'
    });

    if (prefersReducedMotion) {
      gsap.set(target, {
        opacity: 1,
        y: 0,
        clearProps: 'clip-path,webkitClipPath,transform,opacity'
      });
      return;
    }

    gsap.to(target, {
      clipPath: clipEnd,
      webkitClipPath: clipEnd,
      opacity: 1,
      y: 0,
      duration,
      ease,
      delay,
      scrollTrigger: this.buildScrollTrigger(el, config),
      onComplete: () => {
        gsap.set(target, { clearProps: 'will-change' });
      }
    });
  }

  // Character animation for titles
  charsAnimation(el, config) {
    const chars = this.splitChars(el);
    if (chars.length === 0) return;

    const hasStartAttr = el.hasAttribute('data-gsap-start');
    const hasDurationAttr = el.hasAttribute('data-gsap-duration');
    const hasStaggerAttr = el.hasAttribute('data-gsap-stagger');
    const hasEaseAttr = el.hasAttribute('data-gsap-ease');

    const start = hasStartAttr ? config.start : 'top 75%';
    const duration = hasDurationAttr && Number.isFinite(config.duration) ? config.duration : 0.9;
    const stagger = hasStaggerAttr && Number.isFinite(config.stagger) ? config.stagger : 0.02;
    const ease = hasEaseAttr ? config.ease : this.defaults.ease.chars;

    gsap.set(chars, {
      opacity: 0,
      yPercent: 90,
      rotateX: 70,
      transformOrigin: '50% 100%'
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        end: 'bottom 50%',
        scrub: 1,
        toggleActions: 'play none none reverse'
      }
    });

    timeline.to(chars, {
      opacity: 1,
      yPercent: 0,
      rotateX: 0,
      ease,
      duration,
      stagger,
      delay: config.delay
    });
  }

  // Line-by-line animation - auto-detects lines on any device
  linesAnimation(el, config) {
    const lines = this.splitLines(el);
    if (lines.length === 0) return;

    // Set initial state for all lines - hidden and slightly down
    gsap.set(lines, {
      y: 30,
      autoAlpha: 0
    });

    const timeline = gsap.timeline({
      scrollTrigger: this.buildScrollTrigger(el, config)
    });

    timeline.to(lines, {
      y: 0,
      autoAlpha: 1,
      ease: config.ease || this.defaults.ease.fade,
      duration: config.duration,
      stagger: config.stagger || 0.15, // Default 0.15s between lines
      delay: config.delay
    });
  }


  // What we do section header animation (titles + logo)
  whatWeDoHeader(el, config) {
    if (!el) return;

    const leftTitle = el.querySelector('.section-title-left');
    const rightTitle = el.querySelector('.section-title-right');
    const logo = el.querySelector('.masked-logo-group img');

    if (!leftTitle || !rightTitle || !logo) return;

    gsap.set(leftTitle, { x: -window.innerWidth, opacity: 0 });
    gsap.set(rightTitle, { x: window.innerWidth, opacity: 0 });
    gsap.set(logo, { scale: 0, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 60%',
        end: 'bottom 40%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.to(leftTitle, {
      x: 0,
      opacity: 1,
      duration: 1,
      ease: 'power2.out'
    }, 0);

    tl.to(rightTitle, {
      x: 0,
      opacity: 0.5,
      duration: 1,
      ease: 'power2.out'
    }, 0);

    tl.to(logo, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: 'back.out(1.7)'
    }, 0.3);
  }

  // What we do feature card circle + content reveal animation
  whatWeDoCards(el, config) {
    if (!el) return;

    const cards = el.classList.contains('feature-card')
      ? [el]
      : Array.from(el.querySelectorAll('.feature-card'));

    if (!cards.length) return;

    cards.forEach((card, index) => {
      const outerFrame = card.querySelector('.five-as-section__image-outer-circle img');
      const innerCircle = card.querySelector('.five-as-section__image-inner-circle img');

      if (outerFrame && innerCircle) {
        gsap.set([outerFrame, innerCircle], {
          scale: 0.4,
          opacity: 0
        });

        gsap.to([outerFrame, innerCircle], {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: card,
            start: 'top 70%',
            once: true
          },
          delay: index * 0.15
        });
      }

      const contentElements = card.querySelectorAll('.feature-card-title, .feature-card-description');
      if (contentElements.length > 0) {
        gsap.set(contentElements, {
          y: 20,
          autoAlpha: 0
        });

        gsap.to(contentElements, {
          y: 0,
          autoAlpha: 1,
          duration: 1.25,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 70%',
            once: true
          },
          delay: (index * 0.15) + 0.3
        });
      }
    });
  }
  // Hero text animations
  heroAbout(el, config) {
    if (!el) return;

    const lines = [
      el.querySelector('.about-hero__line--handwritten'),
      el.querySelector('.about-hero__line--creative'),
      el.querySelector('.about-hero__line--individuals')
    ].filter(Boolean);

    if (!lines.length) return;

    const waitForLoaded = el.hasAttribute('data-gsap-wait-loaded');
    const hasDurationAttr = el.hasAttribute('data-gsap-duration');
    const hasStaggerAttr = el.hasAttribute('data-gsap-stagger');
    const hasEaseAttr = el.hasAttribute('data-gsap-ease');
    const hasDelayAttr = el.hasAttribute('data-gsap-delay');

    const duration = hasDurationAttr && Number.isFinite(config.duration) ? config.duration : 0.8;
    const stagger = hasStaggerAttr && Number.isFinite(config.stagger) ? config.stagger : 0.55;
    const ease = hasEaseAttr ? config.ease : 'circ.inOut';
    const delay = hasDelayAttr && Number.isFinite(config.delay) ? config.delay : 0;
    const offsets = [-100, 100, -100];

    const setInitialState = () => {
      gsap.set(lines, {
        opacity: 0,
        xPercent: index => offsets[index % offsets.length],
        willChange: 'transform, opacity'
      });
    };

    const play = () => {
      if (el.dataset.heroAnimated === 'true') return;

      const tl = gsap.timeline({
        defaults: { ease },
        delay
      });

      tl.to(lines, {
        opacity: 1,
        xPercent: 0,
        duration,
        stagger
      }, 0);

      tl.eventCallback('onComplete', () => {
        el.dataset.heroAnimated = 'true';
      });
    };

    setInitialState();

    if (waitForLoaded && document.body && !document.body.classList.contains('loaded')) {
      const observer = new MutationObserver(() => {
        if (document.body.classList.contains('loaded')) {
          observer.disconnect();
          play();
        }
      });

      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      return;
    }

    play();
  }

  heroHome(el, config) {
    if (!el) return;

    const slide = this.getActiveHeroSlide(el);
    if (!slide) return;

    const waitForLoaded = el.hasAttribute('data-gsap-wait-loaded');
    const prefersReducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    const elements = {
      title: slide.querySelector('.hero__title-line'),
      script: slide.querySelector('.hero__title-script'),
      main: slide.querySelector('.hero__title-main'),
      description: slide.querySelector('.hero__description')
    };

    if (elements.script) {
      elements.script.style.display = 'block';
      elements.script.style.overflow = 'visible';
    }
    if (elements.main) {
      elements.main.style.display = 'block';
      elements.main.style.overflow = 'visible';
    }

    const HERO_BOLD_ANIM = {
      yFromPercent: 100,
      duration: .6,
      stagger: 0.05,
      ease: 'power4.out'
    };

    const scriptWrite = elements.script ? this.prepareHeroScriptWriting(elements.script) : null;
    const boldChars = elements.main
      ? this.splitHeroChars(elements.main, { includeInner: true, includeSrOnly: true })
      : [];

    if (elements.title) {
      gsap.set(elements.title, { perspective: 800 });
    }

    if (scriptWrite && scriptWrite.text) {
      const clipStart = 'inset(-0.4em 100% -0.4em 0)';
      gsap.set(scriptWrite.text, {
        clipPath: clipStart,
        webkitClipPath: clipStart,
        opacity: 0,
        y: 6,
        willChange: 'clip-path, transform, opacity'
      });
    }

    if (boldChars.length) {
      gsap.set(boldChars, {
        yPercent: HERO_BOLD_ANIM.yFromPercent,
        opacity: 0,
        willChange: 'transform, opacity'
      });
    }

    const play = () => {
      if (el.dataset.heroAnimated === 'true') return;

      if (prefersReducedMotion) {
        const reducedTargets = [elements.title, elements.description].filter(Boolean);
        if (reducedTargets.length) {
          gsap.set(reducedTargets, { opacity: 1, clearProps: 'transform' });
        }
        if (scriptWrite && scriptWrite.text) {
          gsap.set(scriptWrite.text, {
            opacity: 1,
            y: 0,
            clearProps: 'clip-path,webkitClipPath,transform,opacity'
          });
        }
        if (boldChars.length) {
          gsap.set(boldChars, {
            yPercent: 0,
            opacity: 1,
            clearProps: 'will-change'
          });
        }
        el.dataset.heroAnimated = 'true';
        return;
      }

      if (!scriptWrite && !boldChars.length) {
        el.dataset.heroAnimated = 'true';
        return;
      }

      const delay = el.hasAttribute('data-gsap-delay') ? config.delay : 0;
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        delay
      });

      const scriptDuration = 1.1;
      const scriptGap = 0;
      const scriptEnd = scriptWrite ? scriptDuration + scriptGap : 0;

      if (scriptWrite && scriptWrite.text) {
        const clipEnd = 'inset(-0.4em 0% -0.4em 0)';
        tl.to(scriptWrite.text, {
          duration: scriptDuration,
          ease: 'power2.out',
          opacity: 1,
          y: 0,
          clipPath: clipEnd,
          webkitClipPath: clipEnd
        }, 0);
      }

      if (boldChars.length) {
        tl.add(() => {
          gsap.killTweensOf(boldChars);
          gsap.to(boldChars, {
            duration: HERO_BOLD_ANIM.duration,
            opacity: 1,
            ease: HERO_BOLD_ANIM.ease,
            yPercent: 0,
            stagger: HERO_BOLD_ANIM.stagger,
            onComplete: () => {
              gsap.set(boldChars, { clearProps: 'will-change' });
            }
          });
        }, scriptEnd);
      }

      const clearTargets = [];
      if (scriptWrite && scriptWrite.text) {
        clearTargets.push(scriptWrite.text);
      }
      if (elements.description) {
        clearTargets.push(elements.description);
      }
      if (clearTargets.length) {
        tl.set(clearTargets, { clearProps: 'will-change' });
      }

      gsap.delayedCall(4, () => {
        if (el.dataset.heroAnimated === 'true') return;

        if (scriptWrite && scriptWrite.text) {
          gsap.set(scriptWrite.text, {
            opacity: 1,
            y: 0,
            clearProps: 'clip-path,webkitClipPath,transform,opacity'
          });
        }
        if (boldChars.length) {
          gsap.set(boldChars, {
            yPercent: 0,
            opacity: 1,
            clearProps: 'will-change'
          });
        }
        if (elements.description) {
          gsap.set(elements.description, { opacity: 1, clearProps: 'transform' });
        }
        el.dataset.heroAnimated = 'true';
      });

      tl.eventCallback('onComplete', () => {
        el.dataset.heroAnimated = 'true';
      });
    };

    if (waitForLoaded && document.body && !document.body.classList.contains('loaded')) {
      const observer = new MutationObserver(() => {
        if (document.body.classList.contains('loaded')) {
          observer.disconnect();
          play();
        }
      });

      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      return;
    }

    play();
  }

  heroPreschool(el, config) {
    if (!el || el.dataset.heroAnimated === 'true') return;

    const slide = this.getActiveHeroSlide(el);
    if (!slide) return;

    const prefersReducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    const script = slide.querySelector('.hero__title-script');
    const main = slide.querySelector('.hero__title-main');
    const scriptLine = script ? script.querySelector('.preschool-hero-line') : null;
    const mainLine = main ? main.querySelector('.preschool-hero-line') : null;

    const scriptTarget = scriptLine || script;
    const mainTarget = mainLine || main;

    const description = slide.querySelector('.hero__description');
    const playButton = el.querySelector('.play-button');

    const HERO_TEXT_KNOBS = {
      scriptDuration: 1.4,
      scriptGap: 0,
      scriptEase: 'power3.out',
      scriptTrackingFrom: '0.22em',
      scriptTrackingTo: '-0.009em',
      boldStartRatio: 0.5,
      boldDuration: 0.9,
      boldStagger: 0.06,
      boldEase: 'back.inOut(2.7)',
      boldFromY: 100,
      descriptionDuration: 0.8,
      descriptionGap: 0.3,
      descriptionEase: 'power3.out',
      descriptionFromY: 34,
      playButtonDuration: 0.7,
      playButtonGap: 0.1,
      playButtonEase: 'power2.out',
      playButtonScaleFrom: 0.08,
      playButtonOpacityFrom: 0
    };

    const boldChars = mainTarget ? this.splitHeroChars(mainTarget) : [];
    if (!scriptTarget && !boldChars.length && !description && !playButton) {
      el.dataset.heroAnimated = 'true';
      return;
    }

    if (script && scriptTarget !== script) {
      gsap.set(script, { opacity: 1 });
    }
    if (main) {
      gsap.set(main, { opacity: 1 });
    }

    if (prefersReducedMotion) {
      if (scriptTarget) {
        gsap.set(scriptTarget, { opacity: 1, clearProps: 'letter-spacing' });
      }
      if (boldChars.length) {
        gsap.set(boldChars, { yPercent: 0, opacity: 1, clearProps: 'will-change' });
      }
      if (description) {
        gsap.set(description, { opacity: 1, clearProps: 'transform' });
      }
      if (playButton) {
        gsap.set(playButton, { opacity: 1, scale: 1, clearProps: 'transform' });
      }
      el.dataset.heroAnimated = 'true';
      return;
    }

    const delay = el.hasAttribute('data-gsap-delay') ? config.delay : 0;
    const tl = gsap.timeline({ delay });

    const boldStart = scriptTarget
      ? (HERO_TEXT_KNOBS.scriptDuration * HERO_TEXT_KNOBS.boldStartRatio) + HERO_TEXT_KNOBS.scriptGap
      : 0;

    if (scriptTarget) {
      gsap.set(scriptTarget, {
        opacity: 0,
        letterSpacing: HERO_TEXT_KNOBS.scriptTrackingFrom,
        willChange: 'letter-spacing, opacity'
      });

      tl.to(scriptTarget, {
        duration: HERO_TEXT_KNOBS.scriptDuration,
        opacity: 1,
        letterSpacing: HERO_TEXT_KNOBS.scriptTrackingTo,
        ease: HERO_TEXT_KNOBS.scriptEase
      }, 0);
    }

    if (boldChars.length) {
      gsap.set(boldChars, {
        yPercent: HERO_TEXT_KNOBS.boldFromY,
        opacity: 0,
        willChange: 'transform, opacity'
      });

      tl.to(boldChars, {
        duration: HERO_TEXT_KNOBS.boldDuration,
        opacity: 1,
        yPercent: 0,
        stagger: HERO_TEXT_KNOBS.boldStagger,
        ease: HERO_TEXT_KNOBS.boldEase
      }, boldStart);
    }

    if (description) {
      gsap.set(description, {
        opacity: 0,
        y: HERO_TEXT_KNOBS.descriptionFromY,
        willChange: 'transform, opacity'
      });

      tl.to(description, {
        duration: HERO_TEXT_KNOBS.descriptionDuration,
        opacity: 1,
        y: 0,
        ease: HERO_TEXT_KNOBS.descriptionEase
      }, `-=${HERO_TEXT_KNOBS.descriptionGap}`);
    }

    if (playButton) {
      gsap.set(playButton, {
        opacity: HERO_TEXT_KNOBS.playButtonOpacityFrom,
        scale: HERO_TEXT_KNOBS.playButtonScaleFrom,
        transformOrigin: '50% 50%',
        willChange: 'transform, opacity'
      });

      tl.to(playButton, {
        duration: HERO_TEXT_KNOBS.playButtonDuration,
        opacity: 1,
        scale: 1,
        ease: HERO_TEXT_KNOBS.playButtonEase
      }, `>+${HERO_TEXT_KNOBS.playButtonGap}`);
    }

    tl.eventCallback('onComplete', () => {
      if (scriptTarget) {
        gsap.set(scriptTarget, { clearProps: 'will-change' });
      }
      if (boldChars.length) {
        gsap.set(boldChars, { clearProps: 'will-change' });
      }
      if (description) {
        gsap.set(description, { clearProps: 'will-change' });
      }
      if (playButton) {
        gsap.set(playButton, { clearProps: 'will-change' });
      }
      el.dataset.heroAnimated = 'true';
    });
  }

  heroLearning(el, config) {
    if (!el || el.dataset.heroAnimated === 'true') return;

    const slide = this.getActiveHeroSlide(el);
    if (!slide) return;

    const prefersReducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    const elements = {
      title: slide.querySelector('.hero__title-line'),
      script: slide.querySelector('.hero__title-script'),
      main: slide.querySelector('.hero__title-main'),
      description: slide.querySelector('.hero__description')
    };

    if (elements.title) {
      elements.title.style.opacity = '1';
    }
    if (elements.script) {
      elements.script.style.display = 'block';
      elements.script.style.overflow = 'visible';
    }
    if (elements.main) {
      elements.main.style.display = 'block';
      elements.main.style.overflow = 'visible';
    }

    const HERO_BOLD_ANIM = {
      yFromPercent: 100,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power4.out'
    };

    const scriptWrite = elements.script ? this.prepareHeroScriptWriting(elements.script) : null;
    const boldChars = elements.main
      ? this.splitHeroChars(elements.main, { includeInner: true, includeSrOnly: true })
      : [];

    if (elements.title) {
      gsap.set(elements.title, { perspective: 800 });
    }

    if (scriptWrite && scriptWrite.text) {
      const clipStart = 'inset(-0.4em 100% -0.4em 0)';
      gsap.set(scriptWrite.text, {
        clipPath: clipStart,
        webkitClipPath: clipStart,
        opacity: 0,
        y: 6,
        willChange: 'clip-path, transform, opacity'
      });
    }

    if (boldChars.length) {
      gsap.set(boldChars, {
        yPercent: HERO_BOLD_ANIM.yFromPercent,
        opacity: 0,
        willChange: 'transform, opacity'
      });
    }

    if (elements.description) {
      gsap.set(elements.description, {
        opacity: 0,
        y: 14,
        scale: 0.98,
        transformOrigin: 'left top',
        willChange: 'transform, opacity'
      });
    }

    if (prefersReducedMotion) {
      const reducedTargets = [elements.title, elements.description].filter(Boolean);
      if (reducedTargets.length) {
        gsap.set(reducedTargets, { opacity: 1, clearProps: 'transform' });
      }
      if (scriptWrite && scriptWrite.text) {
        gsap.set(scriptWrite.text, {
          opacity: 1,
          y: 0,
          clearProps: 'clip-path,webkitClipPath,transform,opacity'
        });
      }
      if (boldChars.length) {
        gsap.set(boldChars, {
          yPercent: 0,
          opacity: 1,
          clearProps: 'will-change'
        });
      }
      el.dataset.heroAnimated = 'true';
      return;
    }

    if (!scriptWrite && !boldChars.length && !elements.description) {
      el.dataset.heroAnimated = 'true';
      return;
    }

    const delay = el.hasAttribute('data-gsap-delay') ? config.delay : 0;
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      delay
    });

    const scriptDuration = 1.1;
    const scriptGap = 0.2;
    const scriptEnd = scriptWrite ? scriptDuration + scriptGap : 0;

    if (scriptWrite && scriptWrite.text) {
      const clipEnd = 'inset(-0.4em 0% -0.4em 0)';
      tl.to(scriptWrite.text, {
        duration: scriptDuration,
        ease: 'power2.out',
        opacity: 1,
        y: 0,
        clipPath: clipEnd,
        webkitClipPath: clipEnd
      }, 0);
    }

    if (boldChars.length) {
      tl.add(() => {
        gsap.killTweensOf(boldChars);
        gsap.to(boldChars, {
          duration: HERO_BOLD_ANIM.duration,
          opacity: 1,
          ease: HERO_BOLD_ANIM.ease,
          yPercent: 0,
          stagger: HERO_BOLD_ANIM.stagger,
          onComplete: () => {
            gsap.set(boldChars, { clearProps: 'will-change' });
          }
        });
      }, scriptEnd);
    }

    if (elements.description) {
      tl.to(elements.description, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power2.out'
      }, scriptEnd ? scriptEnd + 0.25 : 0.2);
    }

    const clearTargets = [];
    if (scriptWrite && scriptWrite.text) {
      clearTargets.push(scriptWrite.text);
    }
    if (elements.description) {
      clearTargets.push(elements.description);
    }
    if (clearTargets.length) {
      tl.set(clearTargets, { clearProps: 'will-change' });
    }

    gsap.delayedCall(4, () => {
      if (el.dataset.heroAnimated === 'true') return;

      if (scriptWrite && scriptWrite.text) {
        gsap.set(scriptWrite.text, {
          opacity: 1,
          y: 0,
          clearProps: 'clip-path,webkitClipPath,transform,opacity'
        });
      }
      if (boldChars.length) {
        gsap.set(boldChars, {
          yPercent: 0,
          opacity: 1,
          clearProps: 'will-change'
        });
      }
      if (elements.description) {
        gsap.set(elements.description, { opacity: 1, clearProps: 'transform' });
      }
      el.dataset.heroAnimated = 'true';
    });

    tl.eventCallback('onComplete', () => {
      el.dataset.heroAnimated = 'true';
    });
  }

  heroWellbeing(el, config) {
    if (!el) return;

    const textBlocks = el.querySelectorAll('.wellbeing-hero-text');
    if (!textBlocks.length) return;

    const prefersReducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    const allChars = [];

    textBlocks.forEach((block) => {
      const chars = this.splitWellbeingChars(block);
      block.style.opacity = '1';
      if (chars.length) {
        allChars.push(...chars);
      }
    });

    if (!allChars.length) return;

    if (prefersReducedMotion || typeof ScrollTrigger === 'undefined') {
      allChars.forEach((char) => {
        char.style.opacity = '1';
        char.style.transform = 'none';
      });
      return;
    }

    const hasStartAttr = el.hasAttribute('data-gsap-start');
    const hasDurationAttr = el.hasAttribute('data-gsap-duration');
    const hasStaggerAttr = el.hasAttribute('data-gsap-stagger');
    const hasEaseAttr = el.hasAttribute('data-gsap-ease');
    const hasDelayAttr = el.hasAttribute('data-gsap-delay');

    const start = hasStartAttr ? config.start : 'top 80%';
    const duration = hasDurationAttr && Number.isFinite(config.duration) ? config.duration : 0.6;
    const stagger = hasStaggerAttr && Number.isFinite(config.stagger) ? config.stagger : 0.05;
    const ease = hasEaseAttr ? config.ease : 'power2.out';
    const delay = hasDelayAttr && Number.isFinite(config.delay) ? config.delay : 0;

    gsap.set(allChars, { opacity: 0, y: 20 });

    gsap.to(allChars, {
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play reverse play reverse'
      },
      opacity: 1,
      y: 0,
      stagger,
      duration,
      ease,
      delay
    });
  }

  // Hero text helpers
  normalizeWhitespace(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

  getActiveHeroSlide(el) {
    if (!el) return null;
    const heroSlider = el.querySelector('.hero__slider');
    if (!heroSlider) return null;
    return heroSlider.querySelector('.swiper-slide-active') || heroSlider.querySelector('.swiper-slide');
  }

  splitHeroChars(element, options = {}) {
    if (!element) return [];
    if (element.dataset.split === 'true' && Array.isArray(element.__heroChars)) {
      return element.__heroChars;
    }

    const text = this.normalizeWhitespace(element.textContent || '');
    if (!text) return [];

    element.textContent = '';
    element.dataset.split = 'true';
    element.classList.add('hero-anim-text');
    element.setAttribute('role', 'text');
    element.setAttribute('aria-label', text);

    if (options.includeSrOnly) {
      const srText = document.createElement('span');
      srText.className = options.srClass || 'visually-hidden';
      srText.textContent = text;
      element.appendChild(srText);
    }

    const container = options.includeInner ? document.createElement('span') : element;
    if (options.includeInner) {
      container.className = 'hero-anim-text__inner';
      container.setAttribute('aria-hidden', 'true');
      element.appendChild(container);
    }

    const chars = [];
    const words = text.split(' ');

    words.forEach((word, index) => {
      const wordEl = document.createElement('span');
      wordEl.className = 'hero-anim-text__word';
      wordEl.setAttribute('aria-hidden', 'true');

      Array.from(word).forEach((char) => {
        const charEl = document.createElement('span');
        charEl.className = 'hero-anim-text__char';
        charEl.textContent = char;
        charEl.setAttribute('aria-hidden', 'true');
        wordEl.appendChild(charEl);
        chars.push(charEl);
      });

      container.appendChild(wordEl);
      if (index < words.length - 1) {
        container.appendChild(document.createTextNode(' '));
      }
    });

    element.__heroChars = chars;
    return chars;
  }

  prepareHeroScriptWriting(element) {
    if (!element || element.dataset.scriptWrite === 'true') return null;

    const text = this.normalizeWhitespace(element.textContent || '');
    if (!text) return null;

    element.textContent = '';
    element.dataset.scriptWrite = 'true';
    element.setAttribute('aria-label', text);
    element.setAttribute('role', 'text');

    const textSpan = document.createElement('span');
    textSpan.className = 'hero-script-text';
    textSpan.textContent = text;
    textSpan.setAttribute('aria-hidden', 'true');
    element.appendChild(textSpan);

    return { container: element, text: textSpan };
  }

  splitWellbeingChars(element) {
    if (!element) return [];

    if (element.querySelector('.wellbeing-hero-char')) {
      return Array.from(element.querySelectorAll('.wellbeing-hero-char'));
    }

    const text = element.textContent || '';
    const tokens = text.split(/(\s+)/);
    const fragment = document.createDocumentFragment();

    tokens.forEach((token) => {
      if (!token) return;

      if (/^\s+$/.test(token)) {
        fragment.appendChild(document.createTextNode(token));
        return;
      }

      const word = document.createElement('span');
      word.className = 'wellbeing-hero-word';

      for (let i = 0; i < token.length; i += 1) {
        const span = document.createElement('span');
        span.className = 'wellbeing-hero-char';
        span.textContent = token[i];
        word.appendChild(span);
      }

      fragment.appendChild(word);
    });

    element.textContent = '';
    element.appendChild(fragment);

    return Array.from(element.querySelectorAll('.wellbeing-hero-char'));
  }

  // Helper: Split text into characters
  splitChars(el) {
    if (!el) return [];
    if (el.querySelector('.gsap-char')) {
      return Array.from(el.querySelectorAll('.gsap-char'));
    }

    const text = el.textContent || '';
    el.textContent = '';
    const chars = [];
    let wordWrapper = null;

    [...text].forEach((char) => {
      const isSpace = /\s/.test(char);
      if (isSpace) {
        wordWrapper = null;
        el.appendChild(document.createTextNode(' '));
        return;
      }

      if (!wordWrapper) {
        wordWrapper = document.createElement('span');
        wordWrapper.className = 'gsap-word';
        wordWrapper.style.display = 'inline-block';
        wordWrapper.style.whiteSpace = 'nowrap';
        wordWrapper.style.transformOrigin = '50% 100%';
        el.appendChild(wordWrapper);
      }

      const span = document.createElement('span');
      span.className = 'gsap-char';
      span.textContent = char;
      span.style.display = 'inline-block';
      span.style.transformOrigin = '50% 100%';
      wordWrapper.appendChild(span);
      chars.push(span);
    });

    return chars;
  }

  // Helper: Split text into lines (auto-detects based on layout)
  splitLines(el) {
    if (!el) return [];

    // Check if already split
    if (el.querySelector('.gsap-line')) {
      return Array.from(el.querySelectorAll('.gsap-line'));
    }

    const text = el.textContent || '';
    const words = text.split(/\s+/).filter(word => word.length > 0);

    // Clear element and add words as spans to detect their positions
    el.textContent = '';
    const wordElements = [];

    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word;
      span.style.display = 'inline-block';
      wordElements.push(span);
      el.appendChild(span);

      // Add space after word (except last word)
      if (index < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });

    // Detect lines by comparing offsetTop positions
    const lines = [];
    let currentLine = [];
    let currentTop = null;

    wordElements.forEach((wordEl) => {
      const top = wordEl.offsetTop;

      if (currentTop === null || top === currentTop) {
        // Same line
        currentLine.push(wordEl);
        currentTop = top;
      } else {
        // New line detected
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }
        currentLine = [wordEl];
        currentTop = top;
      }
    });

    // Push the last line
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    // Clear element and rebuild with line wrappers
    el.textContent = '';
    const lineElements = [];

    lines.forEach((lineWords, lineIndex) => {
      const lineWrapper = document.createElement('span');
      lineWrapper.className = 'gsap-line';
      lineWrapper.style.display = 'block';
      lineWrapper.style.overflow = 'hidden';

      lineWords.forEach((wordEl, wordIndex) => {
        lineWrapper.appendChild(wordEl);

        // Add space between words (except after last word)
        if (wordIndex < lineWords.length - 1) {
          lineWrapper.appendChild(document.createTextNode(' '));
        }
      });

      el.appendChild(lineWrapper);
      lineElements.push(lineWrapper);
    });

    return lineElements;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new GSAPAnimations();
});
