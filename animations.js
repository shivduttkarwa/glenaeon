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

  
  window.addEventListener("scroll", function() {
   
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
  const sections = document.querySelectorAll(VIDEO_SECTION_SELECTOR + ', .moments-section');
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
  
  // For moments section: all cards in the carousel (nested inside .moments-card)
  const momentsCards = section.querySelectorAll('.moments-arc-carousel .swiper-slide .moments-card .video-card, .moments-arc-carousel .swiper-slide .moments-card .card, .moments-arc-carousel .swiper-slide .video-card, .moments-arc-carousel .swiper-slide .card');
  
  const allCards = [...desktopCards, ...momentsCards];
  
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
      card.classList.add('feature-reveal-animation', 'card-clip-reveal');
    });
  }
}

function setupMobileSlideAnimations(section) {
  // Support both video-testimonials-swiper and moments-arc-carousel
  // For video-testimonials: mobile swiper
  let sliderEl = section.querySelector('.video-testimonials-swiper .swiper');
  
  // For moments section: the arc carousel (works for all screen sizes)
  if (!sliderEl && section.classList.contains('moments-section')) {
    sliderEl = section.querySelector('.moments-arc-carousel');
  }
  
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
  const brandItems = document.querySelectorAll('.footer__brand-inner');
  if (!brandItems.length) {
    return;
  }

  brandItems.forEach((item) => {
    let textSpan = item.querySelector('.footer__brand-text');
    if (!textSpan) {
      const textContent = item.textContent;
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

    if (prefersReducedMotion) {
      gsap.set(chars, { yPercent: 0, clearProps: 'transform' });
      return;
    }

    gsap.set(chars, { yPercent: 120 });

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

  function animation_def({card, ease_default = 'power1.out', index = 0, is_static = false} = {}) {
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
          onStart: function() {
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
