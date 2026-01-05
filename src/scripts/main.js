/**
 * Glenaeon Concordia Kit - Main JavaScript
 * =========================================
 * Minimal, scoped JS for header interactions and UI enhancements.
 */

(function () {
  'use strict';

  // ==========================================================================
  // DOM READY
  // ==========================================================================

  document.addEventListener('DOMContentLoaded', function () {
    initMenuToggle();
    if (window.initMegaMenu) {
      window.initMegaMenu();
    }
    initStickyHeader();
    initSmoothScroll();
    initHeroSlider();
    initArcSlider();
    initVideoTestimonials();
    initCoCurricularCarousel();
    initStaffFilters();
    initLatestNewsFilters();
    initFiveAsTabs();
    initFAQAccordion();
    initLocalNavFilters();
    // initFeaturesCardsSlider();
   
  });

  // ==========================================================================
  // MENU TOGGLE (Hamburger Animation)
  // ==========================================================================

  function initMenuToggle() {
    // This function is now handled by initMegaMenu()
    // Keeping empty to avoid breaking existing function calls
    return;
  }

  // ==========================================================================
  // STICKY HEADER
  // ==========================================================================

  function initStickyHeader() {
    const MOBILE_BREAKPOINT = 1024; // px
    const MOBILE_HIDE_OFFSET = 120;
    const MOBILE_REVEAL_DELTA = 80;

    const header = document.querySelector('.site-header');
    const wrapper = document.querySelector('.wrapper');
    let headerHeight = header?.offsetHeight || 0;
    let isOffsetTop = false;
    let lastScrollTop = 0;
    let lastMobileTriggerScroll = 0;

    function applyHeaderCompensation(enable) {
      if (!wrapper || !headerHeight) return;
      // wrapper.style.paddingTop = enable ? `${headerHeight}px` : '';
    }

    function toggleOffsetTop(scroll) {
      if (scroll > 0) {
        if (!isOffsetTop) {
          document.body.classList.add('is-offset-top');
          applyHeaderCompensation(true);
          isOffsetTop = true;
        }
      } else if (isOffsetTop) {
        document.body.classList.remove('is-offset-top');
        applyHeaderCompensation(false);
        isOffsetTop = false;
      }
    }

    function shouldUseMobileBehavior() {
      return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches;
    }

    function handleScroll() {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      toggleOffsetTop(currentScrollY);

      const isMobile = shouldUseMobileBehavior();
      const isScrollingDown = currentScrollY > lastScrollTop;

      if (isMobile) {
        if (header) {
          header.classList.toggle('is-scrolled-mobile', currentScrollY > 0);
        }
        if (isScrollingDown && currentScrollY > MOBILE_HIDE_OFFSET) {
          document.body.classList.add('scroll-down');
          lastMobileTriggerScroll = currentScrollY;
        } else if (!isScrollingDown) {
          const scrolledUpDistance = lastMobileTriggerScroll - currentScrollY;
          if (scrolledUpDistance >= MOBILE_REVEAL_DELTA || currentScrollY <= MOBILE_HIDE_OFFSET) {
            document.body.classList.remove('scroll-down');
            lastMobileTriggerScroll = currentScrollY;
          }
        } else if (currentScrollY <= MOBILE_HIDE_OFFSET) {
          document.body.classList.remove('scroll-down');
          lastMobileTriggerScroll = currentScrollY;
        }
      } else {
        // Desktop behavior: hide header immediately on scroll down beyond 80px
        if (isScrollingDown && currentScrollY > 80) {
          document.body.classList.add('scroll-down');
        } else {
          document.body.classList.remove('scroll-down');
        }
      }

      lastScrollTop = currentScrollY <= 0 ? 0 : currentScrollY;
    }

    // Initial state
    toggleOffsetTop(window.scrollY);
    lastMobileTriggerScroll = window.scrollY;

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      headerHeight = header?.offsetHeight || headerHeight;
      applyHeaderCompensation(isOffsetTop);
      handleScroll();
    });
  }

 
  // ==========================================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================================================

  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        // Skip if just "#"
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  // ==========================================================================
  // HERO SLIDER (Swiper)
  // ==========================================================================

  function initHeroSlider() {
    // Check if Swiper is loaded
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper not loaded');
      return;
    }

    const heroSlider = document.querySelector('.hero__slider');
    if (!heroSlider) return;

    // Initialize Swiper with parallax and existing navigation
    const swiper = new Swiper('.hero__slider', {
      speed: 1600,
      parallax: true,
      autoplay: {
        delay: 10000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.arrow-navigation__arrow--right',
        prevEl: '.arrow-navigation__arrow--left',
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      loop: true,
    });
  }

  // ==========================================================================
  // ARC SLIDER
  // ==========================================================================

  function initArcSlider() {
    const slider = document.getElementById('arcSlider');
    if (!slider) return;

    const fallbackImages = [
      'assets/images/SteinerWilloughby_237.jpg',
      'assets/images/SteinerWilloughby_259.jpg',
      'assets/images/SteinerWilloughby_279.jpg',
      'assets/images/Steiner_MiddleCove_0277.jpg'
    ];

    const slides = [
      { name: 'Jordan', title: 'Year 12 Student', video: 'assets/videos/vt-1.mp4' },
      { name: 'Maya', title: 'Year 10 Student', video: 'assets/videos/vt-2.mp4' },
      { name: 'Isaac', title: 'Year 9 Student', video: 'assets/videos/vt-3.mp4' },
      { name: 'Leah', title: 'Year 11 Student', video: 'assets/videos/vt-4.mp4' },
      { name: 'Ethan', title: 'Year 8 Student', video: 'assets/videos/vt-1.mp4' },
      { name: 'Zara', title: 'Year 12 Student', video: 'assets/videos/vt-2.mp4' },
      { name: 'Noah', title: 'Year 9 Student', video: 'assets/videos/vt-3.mp4' },
      { name: 'Amelia', title: 'Year 10 Student', video: 'assets/videos/vt-4.mp4' },
      { name: 'Luca', title: 'Year 7 Student', video: 'assets/videos/vt-1.mp4' },
      { name: 'Ava', title: 'Year 11 Student', video: 'assets/videos/vt-2.mp4' },
      { name: 'Mia', title: 'Year 12 Student', video: 'assets/videos/vt-3.mp4' }
    ].map((slide, index) => ({
      ...slide,
      fallback: fallbackImages[index % fallbackImages.length]
    }));

    const track = slider.querySelector('.arc-slider__track');
    const ARC_KNOBS = {
      breakpoint: 768,
      desktop: {
        degrees: 2.5,
        originY: '485rem',
        cardWidth: '18.75rem',
        cardHeight: '31.48319rem',
        height: 'clamp(600px, 100vh, 500px)',
        translateY: '0px'
      },
      mobile: {
        degrees: 2.5,
        originY: '420rem',
        cardWidth: '66.6667vw',
        cardHeight: 'calc(66.6667vw * 1.6791)',
        height: 'clamp(420px, 80vh, 520px)',
        translateY: '0px'
      }
    };

    let degrees = ARC_KNOBS.desktop.degrees;
    let transformOriginY = ARC_KNOBS.desktop.originY;
    let slideWidth = 0;
    let denominator = 1;
    let minX = 0;
    let maxX = 0;

    let active = Math.floor(slides.length / 2);
    let currentX = 0;
    let isDragging = false;
    let startPointerX = 0;
    let startX = 0;
    let animId = null;
    let isMobile = window.innerWidth <= ARC_KNOBS.breakpoint;
    let touchId = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchDragging = false;
    let touchListenersAttached = false;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function formatOriginY(value) {
      if (typeof value === 'number') {
        return `${value}px`;
      }
      if (typeof value === 'string' && value.trim().length) {
        return value.trim();
      }
      return '7000px';
    }

    function isInteractiveTarget(event) {
      return Boolean(event.target.closest('.video-card-play-button, .video-card-play-wrapper, button, a'));
    }

    function rubberband(value) {
      if (value > maxX) {
        return maxX + (value - maxX) * 0.2;
      }
      if (value < minX) {
        return minX + (value - minX) * 0.2;
      }
      return value;
    }

    function applyOffset() {
      if (!denominator) return;
      slider.style.setProperty('--arc-offset', `${currentX / denominator}deg`);
    }

    function animateTo(targetX) {
      if (animId) {
        cancelAnimationFrame(animId);
      }

      const startTime = performance.now();
      const startX = currentX;
      const duration = 450;
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const step = (now) => {
        const elapsed = Math.min((now - startTime) / duration, 1);
        currentX = startX + (targetX - startX) * easeOut(elapsed);
        applyOffset();

        if (elapsed < 1) {
          animId = requestAnimationFrame(step);
        } else {
          animId = null;
        }
      };

      animId = requestAnimationFrame(step);
    }

    function snapTo(index) {
      active = clamp(index, 0, slides.length - 1);
      const targetX = -slideWidth * active;
      animateTo(targetX);
    }

    function handlePointerDown(event) {
      if (isMobile || event.pointerType === 'touch') return;
      if (isInteractiveTarget(event)) return;
      if (event.button !== undefined && event.button !== 0) return;
      slider.setPointerCapture(event.pointerId);
      isDragging = true;
      startPointerX = event.clientX;
      startX = currentX;
      slider.classList.add('is-dragging');
    }

    function handlePointerMove(event) {
      if (isMobile || event.pointerType === 'touch') return;
      if (!isDragging) return;
      const delta = event.clientX - startPointerX;
      currentX = rubberband(startX + delta);
      applyOffset();
    }

    function handlePointerUp(event) {
      if (isMobile || event.pointerType === 'touch') return;
      if (!isDragging) return;
      isDragging = false;
      slider.releasePointerCapture(event.pointerId);
      slider.classList.remove('is-dragging');

      const clampedX = clamp(currentX, minX, maxX);
      const nearest = Math.round(-clampedX / slideWidth);
      snapTo(nearest);
    }

    function getTouchById(touches, id) {
      if (!touches) return null;
      for (let i = 0; i < touches.length; i += 1) {
        if (touches[i].identifier === id) {
          return touches[i];
        }
      }
      return null;
    }

    function handleTouchStart(event) {
      if (!isMobile) return;
      if (isInteractiveTarget(event)) return;
      const touch = event.changedTouches && event.changedTouches[0];
      if (!touch) return;
      touchId = touch.identifier;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      startX = currentX;
      isTouchDragging = false;

      if (!touchListenersAttached) {
        touchListenersAttached = true;
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('touchcancel', handleTouchEnd);
      }
    }

    function handleTouchMove(event) {
      if (!isMobile || touchId === null) return;
      const touch = getTouchById(event.touches, touchId) || getTouchById(event.changedTouches, touchId);
      if (!touch) return;

      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      if (!isTouchDragging) {
        if (Math.abs(deltaX) < 6) return;
        if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
        isTouchDragging = true;
        slider.classList.add('is-dragging');
      }

      event.preventDefault();
      currentX = rubberband(startX + deltaX);
      applyOffset();
    }

    function handleTouchEnd(event) {
      if (!isMobile || touchId === null) return;
      const touch = getTouchById(event.changedTouches, touchId);
      if (!touch) return;

      if (isTouchDragging) {
        slider.classList.remove('is-dragging');
        const clampedX = clamp(currentX, minX, maxX);
        const nearest = Math.round(-clampedX / slideWidth);
        snapTo(nearest);
      }

      isTouchDragging = false;
      touchId = null;

      if (touchListenersAttached) {
        touchListenersAttached = false;
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('touchcancel', handleTouchEnd);
      }
    }

    function updateMetrics() {
      const card = track.querySelector('.video-card');
      if (!card) return;
      slideWidth = card.getBoundingClientRect().width;
      denominator = slideWidth / degrees;
      minX = -((slides.length - 1) * slideWidth);
      maxX = 0;
      currentX = -slideWidth * active;
      applyOffset();
    }

    function applyArcKnobs() {
      isMobile = window.innerWidth <= ARC_KNOBS.breakpoint;
      const settings = isMobile ? ARC_KNOBS.mobile : ARC_KNOBS.desktop;
      if (!settings) return;

      if (settings.cardWidth) {
        slider.style.setProperty('--card-width', settings.cardWidth);
      }
      if (settings.cardHeight) {
        slider.style.setProperty('--card-height', settings.cardHeight);
      }
      if (settings.height) {
        slider.style.setProperty('--arc-height', settings.height);
      }
      if (settings.translateY) {
        slider.style.setProperty('--arc-translate-y', settings.translateY);
      }

      degrees = settings.degrees;
      transformOriginY = settings.originY;

      const originYValue = formatOriginY(transformOriginY);
      track.querySelectorAll('.arc-slide').forEach((slide, index) => {
        slide.style.setProperty('--rotate-base', `${index * degrees}deg`);
        slide.style.setProperty('--origin-y', originYValue);
      });

      updateMetrics();
    }

    function createVideoCard({ name, title, video, fallback }) {
      const card = document.createElement('article');
      card.className = 'video-card card-clip-reveal';

      const inner = document.createElement('div');
      inner.className = 'video-card-inner';

      const media = document.createElement('div');
      media.className = 'video-card-media';

      if (fallback) {
        const fallbackImg = document.createElement('img');
        fallbackImg.className = 'video-card-fallback';
        fallbackImg.src = fallback;
        fallbackImg.alt = '';
        fallbackImg.setAttribute('aria-hidden', 'true');
        fallbackImg.setAttribute('loading', 'lazy');
        media.appendChild(fallbackImg);
        card.classList.add('has-fallback');
      }

      const clip = document.createElement('video');
      clip.className = 'testimonial-video';
      clip.setAttribute('playsinline', '');
      clip.setAttribute('muted', '');
      clip.setAttribute('loop', '');
      clip.setAttribute('preload', 'metadata');
      clip.setAttribute('aria-label', `${name} - ${title}`);
      if (fallback) {
        clip.setAttribute('poster', fallback);
      }

      const source = document.createElement('source');
      source.src = video;
      source.type = 'video/mp4';
      clip.appendChild(source);
      clip.appendChild(document.createTextNode('Your browser does not support the video tag.'));

      media.appendChild(clip);

      const overlay = document.createElement('div');
      overlay.className = 'video-card-overlay';

      const content = document.createElement('div');
      content.className = 'video-card-content';

      const info = document.createElement('div');
      info.className = 'video-card-info';

      const nameEl = document.createElement('p');
      nameEl.className = 'video-card-name';
      nameEl.textContent = name;

      const titleEl = document.createElement('p');
      titleEl.className = 'video-card-title';
      titleEl.textContent = title;

      info.appendChild(nameEl);
      info.appendChild(titleEl);

      const playWrapper = document.createElement('div');
      playWrapper.className = 'video-card-play-wrapper';

      const playButton = document.createElement('button');
      playButton.className = 'video-card-play-button';
      playButton.type = 'button';
      playButton.setAttribute('aria-label', 'Play video with sound');
      playButton.setAttribute('aria-pressed', 'false');

      const playCircle = document.createElement('div');
      playCircle.className = 'video-card-play-circle';

      const playIcon = document.createElement('div');
      playIcon.className = 'video-card-play-icon';
      playIcon.setAttribute('aria-hidden', 'true');
      playIcon.innerHTML = `
        <span class="icon icon-play">
         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20"
                                      fill="none">
                                      <path
                                        d="M13.4099 9.35357C13.4492 9.29972 13.5967 9.38306 13.6628 9.35375C13.9406 9.23232 14.0879 9.2641 14.3527 9.17748C14.7453 9.04917 15.6884 8.28326 16.1953 9.16117C16.1953 9.16119 16.1953 9.16121 16.1953 9.16123C16.2003 9.16984 16.2052 9.17861 16.2101 9.18753C16.303 9.35689 16.32 9.59049 16.4161 9.78722C16.5123 9.984 17.2274 11.1999 17.1415 11.3411C17.0118 11.5366 16.3945 11.4754 16.3054 11.5454C16.2446 11.5932 16.227 11.7514 16.1536 11.8202C15.9167 12.0416 15.7267 12.0431 15.6544 12.487C15.464 12.385 15.2736 12.2829 15.0833 12.1809C14.9972 12.3288 14.6812 12.2317 14.6097 12.2884C14.5511 12.3349 14.5861 12.4823 14.5227 12.5267C14.4519 12.5773 14.2585 12.508 14.134 12.6072C13.9295 12.7691 14.079 13.12 13.969 13.239C13.8548 13.3624 13.5357 13.309 13.4249 13.5268C13.4235 13.5758 13.4221 13.6247 13.4206 13.6736C13.4837 13.746 13.5467 13.8184 13.6098 13.8908C13.5423 13.9803 13.4074 13.8353 13.3235 13.8797C13.2248 13.9318 13.267 14.1188 13.2016 14.1556C13.1479 14.1856 13.0023 14.1002 12.9379 14.148C12.8435 14.2171 12.9715 14.3879 12.9371 14.4535C12.9232 14.4794 12.582 14.8114 12.5603 14.8258C12.393 14.9321 12.2331 14.6895 12.0837 14.7465C11.6699 14.9055 11.3978 15.3332 11.0913 15.6125C10.9544 15.7372 10.7826 15.817 10.6032 15.867C10.478 15.0821 9.64474 14.896 10.4292 15.7845C10.1728 15.7417 10.2063 16.0844 10.0151 16.1336C9.89125 16.1652 9.73698 16.0682 9.58694 16.1597C9.32124 16.323 9.25487 16.8899 8.76347 16.2181C8.51951 16.5274 8.09495 16.4259 8.346 17.1245C8.28659 17.2103 7.85961 16.9544 7.7384 16.9561C7.62388 16.958 6.86056 17.1718 6.74628 17.2251C6.63199 17.2784 6.43556 17.3781 6.37597 17.4865C6.3005 17.6216 6.59886 18.3242 5.95099 17.6754C5.74852 17.8751 5.65094 17.9021 5.37784 17.941C5.3284 17.948 5.25811 17.8368 5.23461 17.8502C5.18632 17.8781 5.15274 18.0097 5.07247 18.0697C4.94041 18.1684 4.72115 17.9754 4.94828 18.3323C4.89025 18.4477 4.83222 18.563 4.7742 18.6783C4.70062 18.6266 4.62705 18.5749 4.55348 18.5232C4.54796 18.629 4.54244 18.7348 4.53692 18.8407C4.2898 18.2771 4.11858 18.7927 4.40824 19.0307C4.1638 19.0258 3.91937 19.0208 3.67494 19.0158C3.35266 18.3992 3.23703 19.176 3.46163 19.4827C3.44062 19.4942 3.41962 19.5057 3.39861 19.5172C3.12475 19.462 3.03364 19.6891 2.75041 19.7094C2.68656 19.714 2.63643 19.714 2.59449 19.7084C1.5689 20.1998 0.537505 19.7051 0.624726 18.5712C0.713243 18.4559 0.809681 18.4568 1.05731 18.3966C1.039 18.3365 1.02069 18.2764 1.00238 18.2163C0.125861 17.9009 1.64344 17.9566 0.97107 17.4166C1.52196 17.244 1.23259 16.8187 1.06555 16.5366C1.04615 16.5038 0.939222 16.5033 0.90625 16.4596C0.826958 16.3527 0.964413 16.08 0.619506 16.0894C0.7193 15.995 0.819092 15.9006 0.918885 15.8062C0.856171 15.729 0.793457 15.6519 0.730744 15.5748C0.623077 15.5751 0.515411 15.5755 0.407745 15.5759C0.774693 15.4206 0.63367 15.1765 0.721405 15.0561C0.739189 15.0321 0.88771 15.0269 0.928223 14.9524C0.97631 14.8654 0.932361 14.7031 0.978761 14.5994C0.81424 14.5591 0.649719 14.5187 0.485198 14.4784C0.395965 14.2929 0.830214 14.2277 0.863953 14.1188C0.869819 14.0991 0.838622 13.7413 0.829346 13.722C0.755861 13.5642 0.385909 13.6089 0.465148 13.1524C0.479486 13.0711 0.607496 13.0053 0.61264 12.9319C0.621921 12.8021 0.331594 12.4109 0.0633234 12.3802C0.399085 12.2228 0.261838 11.8015 0.358856 11.6775C0.388683 11.64 0.602548 11.6316 0.648071 11.5165C0.68519 11.4232 0.513944 11.1828 0.542602 11.0645C0.573812 10.9389 0.753474 10.894 0.766175 10.8377C0.777985 10.7846 0.632949 10.7355 0.633789 10.6631C0.638851 10.4369 0.872291 10.232 0.876587 10.0532C0.883337 9.79468 0.453933 9.56628 0.263275 9.34994C0.291114 9.29624 0.383281 9.24348 0.384124 9.18718C0.397628 8.49075 0.476745 7.70512 0.568695 7.0066C0.610929 6.68233 1.1938 5.87594 0.221252 6.09117C0.0509317 5.97847 0.443039 5.15908 0.448944 5.00322C0.454792 4.8474 0.280405 4.72388 0.277832 4.60141C0.270239 4.23181 0.395901 3.97154 0.244049 3.52166C0.204349 3.40546 -0.00225081 3.28097 0.000152456 3.21215C0.00352656 3.12928 0.20334 3.04008 0.216034 2.9327C0.244715 2.67676 0.178989 2.19978 0.213562 1.95423C0.22031 1.9094 0.395758 1.89365 0.450592 1.82953C0.542835 1.72203 0.591923 1.60894 0.573219 1.51894C0.663862 0.340574 1.64507 -0.330593 2.62025 0.337093C2.73571 0.37519 2.87549 0.290353 3.01056 -1.05675e-05C3.12873 0.435424 3.53017 0.332235 3.79591 0.465144C4.35716 0.747293 5.2811 1.4317 5.87192 1.50103C6.24448 1.54468 6.36247 1.3227 6.6933 1.76403C6.76676 1.86196 6.8314 1.97417 6.92098 2.09212C7.13068 2.36905 7.15292 2.9178 7.64384 2.55545C7.87917 2.8588 8.17579 2.91128 8.16507 3.45737C8.24935 3.37357 8.33364 3.28977 8.41792 3.20597C8.45708 3.22531 8.49625 3.24464 8.53541 3.26397C8.49248 3.36552 8.44955 3.46707 8.40662 3.56861C8.66228 3.75024 9.23016 3.55886 9.4574 3.69385C9.83861 3.91978 10.7396 4.64172 11.0297 4.97966C11.1837 5.15908 11.3112 4.96216 11.181 5.44315C11.241 5.43908 11.3009 5.435 11.3609 5.43093C11.4407 5.3552 11.5204 5.27948 11.6002 5.20375C11.8502 5.34319 12.0622 5.65479 12.2992 5.78965C12.7311 6.03513 13.5223 6.15675 13.859 6.5713C13.9433 6.67548 13.97 6.94203 14.0773 7.00115C14.2334 7.08737 14.4514 6.79645 14.6507 6.90373C14.9939 7.0892 15.4131 7.81542 15.7483 7.97194C15.8478 8.01863 15.9591 7.92786 16.0318 7.95324C16.3371 8.05838 16.5569 8.19796 16.9239 8.17019C17.0336 8.6329 16.7859 9.00545 16.6483 9.44615C16.5447 9.77893 16.3542 10.5788 16.2342 10.8534C16.1499 11.0463 15.9396 11.2356 15.8528 11.4515C15.4223 11.4153 15.3813 11.1578 15.2683 10.7185C14.7541 10.4365 14.2399 10.1546 13.7257 9.87261C13.7424 9.73708 13.759 9.60155 13.7757 9.46602C13.7758 9.46578 13.776 9.46554 13.7761 9.46531C13.6537 9.2271 13.4092 9.45974 13.2673 9.46266C11.9087 9.49073 10.2025 7.86979 9.13382 7.16122C8.90342 7.00872 8.0418 6.70685 7.98 6.43543C7.96416 6.36489 8.04927 6.19022 8.00835 6.15685C7.54742 6.02383 7.08649 5.89081 6.62556 5.75779C5.94681 5.01815 4.96507 4.73855 4.10621 4.29626C3.13319 3.79526 2.16175 3.30066 1.1996 2.79773L3.41452 1.51895C3.47771 3.02471 3.51803 4.52299 3.49107 6.01565C3.48179 6.51193 3.62701 7.14171 3.53336 7.62756C3.49454 7.83033 3.18327 7.91482 3.41526 8.1812C3.3314 8.184 3.24753 8.18679 3.16367 8.18959C3.26491 8.42205 3.45573 8.57061 3.47514 8.83124C3.49116 9.05071 3.50362 9.63138 3.47156 9.82532C3.45554 9.92591 3.29883 9.88844 3.29963 9.98222C3.30216 10.1428 3.5188 10.4858 3.51881 10.7074C3.51881 10.9081 3.3383 11.2464 3.36445 11.4007C3.45725 11.9564 3.72482 12.5618 3.65311 13.1539C3.63283 13.3175 3.42964 13.5279 3.43531 13.5792C3.44712 13.6792 3.64449 13.7091 3.66987 13.7763C3.79809 14.1177 3.56354 14.6499 3.55424 14.9846C3.52387 16.0752 3.61001 17.2305 3.57374 18.3164C3.5711 18.3957 3.56924 18.4812 3.56777 18.5712L1.12297 17.1597C1.72457 16.8253 2.54681 16.3367 3.09753 16.1704C3.23184 16.1299 3.30843 16.3353 3.40775 16.278C3.51785 16.2144 3.50445 16.0534 3.55001 16.0135C3.8649 15.7362 4.57746 15.1543 4.98844 15.0895C5.06684 15.0773 5.19802 15.1972 5.23607 15.1745C5.25548 15.1633 5.24153 15.0378 5.29657 14.9924C5.7824 14.5911 6.20849 14.423 6.75562 14.1529C7.80306 13.6348 8.86566 12.773 9.98478 12.2613C10.2286 12.1497 10.5547 12.3484 10.5855 12.3267C10.6534 12.2797 10.5864 12.0581 10.703 11.9265C11.0918 11.4907 11.859 11.3255 12.2593 10.9639C12.4572 10.7854 12.6243 10.3585 12.8147 10.1755C12.9668 10.0292 13.4419 9.88451 13.4577 9.73032C13.4676 9.63697 13.3679 9.41308 13.4099 9.35357ZM9.3308 16.0904C9.16753 15.7346 8.99734 16.2069 9.22655 16.3161C9.27817 16.3407 9.37322 16.1827 9.3308 16.0904ZM1.06665 8.25516C0.955324 8.25867 0.843995 8.26218 0.732667 8.2657C0.778992 8.31605 0.825318 8.36639 0.871644 8.41674C0.938569 8.38845 1.00549 8.36015 1.07242 8.33185C1.0705 8.30629 1.06857 8.28072 1.06665 8.25516Z"
                                        fill="white" />
                                    </svg></span>
        <span class="icon icon-close">
         <svg class="paint-x" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">

      <!-- Stroke 1 -->
      <path
        d="
        M18 15
        C25 8, 40 10, 46 22
        L82 78
        C88 88, 76 94, 66 84
        L22 34
        C14 26, 12 20, 18 15
        Z"
        fill="white"/>

      <!-- Paint breakup -->
      <path d="M42 30 C38 34, 46 38, 49 33 C52 28, 45 26, 42 30 Z" fill="white" opacity=".5"/>
      <path d="M64 64 C60 69, 69 72, 72 66 C75 61, 68 60, 64 64 Z" fill="white" opacity=".45"/>

      <!-- Stroke 2 -->
      <path
        d="
        M15 82
        C8 90, 18 96, 30 86
        L78 40
        C88 30, 90 18, 80 16
        C72 14, 60 22, 52 30
        L26 54
        C18 62, 16 74, 15 82
        Z"
        fill="white"/>

      <!-- Dry edge texture -->
      <path d="M34 58 C30 62, 38 66, 41 61 C44 56, 37 54, 34 58 Z" fill="white" opacity=".4"/>

    </svg>
        </span>
      `;

      playCircle.appendChild(playIcon);
      playButton.appendChild(playCircle);
      playWrapper.appendChild(playButton);

      content.appendChild(info);
      content.appendChild(playWrapper);
      overlay.appendChild(content);

      inner.appendChild(media);
      inner.appendChild(overlay);
      card.appendChild(inner);

      return card;
    }

    function initArcReveal(cards) {
      if (!cards.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
      }

      gsap.set(cards, { '--clip-value': '100%' });

      ScrollTrigger.batch(cards, {
        start: 'top bottom-=100',
        once: true,
        onEnter: elements => {
          elements.forEach((card, index) => {
            gsap.fromTo(card, {
              '--clip-value': '100%'
            }, {
              duration: 1.1,
              ease: 'power3.out',
              '--clip-value': '0%',
              delay: index * 0.2,
              onComplete: () => {
                card.classList.add('clip-animation-complete', 'animation-finished');
              }
            });
          });
        }
      });
    }

    function build() {
      slides.forEach((slideData) => {
        const slide = document.createElement('div');
        slide.className = 'arc-slide';

        slide.appendChild(createVideoCard(slideData));
        track.appendChild(slide);
      });

      initArcReveal(Array.from(track.querySelectorAll('.video-card')));
      applyArcKnobs();
    }

    slider.addEventListener('pointerdown', handlePointerDown);
    slider.addEventListener('pointermove', handlePointerMove);
    slider.addEventListener('pointerup', handlePointerUp);
    slider.addEventListener('pointercancel', handlePointerUp);
    slider.addEventListener('pointerleave', handlePointerUp);
    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('resize', applyArcKnobs);

    build();
  }

  // ==========================================================================
  // VIDEO TESTIMONIALS
  // ==========================================================================

  function initVideoTestimonials() {
    // Initialize video cards universally - works for video-testimonials and moments sections
    const sections = document.querySelectorAll('.video-testimonials, .moments-section, .arc-slider-stage');
    if (!sections.length) return;

    sections.forEach(section => {
      // Support both old and new class names for backward compatibility
      let cards = section.querySelectorAll('.video-card, .card');
      if (!cards.length) return;

      // Initialize Swiper for Mobile (only for video-testimonials section)
      const videoTestimonialsSwiperContainer = section.querySelector('.video-testimonials-swiper .swiper');
      let mobileSwiper = null;
      if (videoTestimonialsSwiperContainer && typeof Swiper !== 'undefined') {
        const slideCount = videoTestimonialsSwiperContainer.querySelectorAll('.swiper-slide').length;
        mobileSwiper = new Swiper(videoTestimonialsSwiperContainer, {
          slidesPerView: 1.25,
          spaceBetween: 20,
          loop: slideCount >= 3,
          autoplay: false,
          breakpoints: {
            320: {
              slidesPerView: 1.25,
              spaceBetween: 16
            },
            768: {
              slidesPerView: 1.25,
              spaceBetween: 20
            }
          }
        });
        cards = section.querySelectorAll('.video-card, .card');
      }

      const cardList = Array.from(cards);

      // ==========================================================================
      // VIDEO CARD INLINE CONTROLS - START (Universal for all video cards)
      // ==========================================================================
      const activeState = {
        video: null,
        button: null
      };

      function markVideoReady(card) {
        if (card && card.classList.contains('has-fallback')) {
          card.classList.add('is-video-ready');
        }
      }

      function ensureVideoLoaded(video, card) {
        const needsReadyClass = Boolean(card && card.classList.contains('has-fallback') && !card.classList.contains('is-video-ready'));
        const onReady = () => markVideoReady(card);

        if (needsReadyClass) {
          video.addEventListener('loadeddata', onReady, { once: true });
          video.addEventListener('canplay', onReady, { once: true });
          video.addEventListener('loadedmetadata', onReady, { once: true });
          video.addEventListener('playing', onReady, { once: true });
          video.addEventListener('error', () => {
            if (card) {
              card.classList.remove('is-video-ready');
            }
          }, { once: true });
        }

        if (video.readyState === 0) {
          video.load();
        }

        if (needsReadyClass && video.readyState >= 2) {
          onReady();
        }
      }

      function playVideo(video, card) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(() => markVideoReady(card)).catch(() => {});
        }
      }

      cardList.forEach(card => {
      const video = card.querySelector('.testimonial-video, .learner-video');
      // Support both old and new class names
      const controlButton = card.querySelector('.video-card-play-button, .play-button');
      if (!video || !controlButton) return;

      controlButton.addEventListener('pointerdown', event => {
        event.stopPropagation();
      });

      const isDesktopCard = Boolean(card.closest('.desktop-only'));
      const isMomentsCard = Boolean(card.closest('.moments-section'));
      const isArcCard = Boolean(card.closest('.arc-slider-stage'));
      const shouldHaveHover = isDesktopCard || ((isMomentsCard || isArcCard) && window.innerWidth >= 1024);
      
      setupDefaultState(video, shouldHaveHover, card);

      if (shouldHaveHover) {
        card.addEventListener('mouseenter', () => handleDesktopHover(video, controlButton, true, card));
        card.addEventListener('mouseleave', () => handleDesktopHover(video, controlButton, false, card));
      }

      controlButton.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        const isActive = controlButton.classList.contains('is-active');
        if (isActive) {
          resetVideo(card, video, controlButton, shouldHaveHover);
        } else {
          playWithAudio(card, video, controlButton);
        }
      });

      video.addEventListener('ended', () => {
        if (controlButton.classList.contains('is-active')) {
          resetVideo(card, video, controlButton, shouldHaveHover);
        }
      });
    });

    if (mobileSwiper) {
      mobileSwiper.on('slideChangeTransitionEnd', () => {
        if (activeState.video && activeState.button) {
          const slide = activeState.video.closest('.swiper-slide');
          if (slide && !slide.classList.contains('swiper-slide-active')) {
            const activeCard = activeState.button.closest('.video-card, .card');
            resetVideo(activeCard, activeState.video, activeState.button, false);
          }
        }

        const activeSlide = section.querySelector('.video-testimonials-swiper .swiper-slide-active');
        if (activeSlide) {
          const slideVideo = activeSlide.querySelector('.testimonial-video');
          const slideButton = activeSlide.querySelector('.video-card-play-button, .play-button');
          if (slideVideo && slideButton && !slideButton.classList.contains('is-active')) {
            const slideCard = slideVideo.closest('.video-card, .card');
            ensureVideoLoaded(slideVideo, slideCard);
            playVideo(slideVideo, slideCard);
          }
        }
      });
    }

      function setupDefaultState(video, isDesktopCard, card) {
        video.muted = true;
        video.loop = true;

        if (isDesktopCard) {
          video.pause();
          video.currentTime = 0;
        } else {
          ensureVideoLoaded(video, card);
          requestAnimationFrame(() => {
            playVideo(video, card);
          });
        }
      }

      function handleDesktopHover(video, button, isHovering, card) {
        if (button.classList.contains('is-active')) return;

        if (isHovering) {
          video.muted = true;
          ensureVideoLoaded(video, card);
          playVideo(video, card);
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }

      function playWithAudio(card, video, button) {
        if (activeState.video && activeState.video !== video && activeState.button) {
          const activeCard = activeState.button.closest('.video-card, .card');
          const isDesktopActive = Boolean(activeCard && activeCard.closest('.desktop-only'));
          resetVideo(activeCard, activeState.video, activeState.button, isDesktopActive);
        }

        activeState.video = video;
        activeState.button = button;

        button.classList.add('is-active');
        button.setAttribute('aria-pressed', 'true');
        button.setAttribute('aria-label', 'Close video with sound');
        video.loop = false;
        video.muted = false;
        video.currentTime = 0;
        ensureVideoLoaded(video, card);
        playVideo(video, card);
      }

      function resetVideo(card, video, button, isDesktopCard) {
        if (!video || !button) return;

        button.classList.remove('is-active');
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-label', 'Play video with sound');
        video.muted = true;
        video.loop = true;
        video.pause();
        video.currentTime = 0;

        if (!isDesktopCard) {
          playVideo(video, card);
        }

        if (activeState.video === video) {
          activeState.video = null;
          activeState.button = null;
        }
      }
      // ==========================================================================
      // VIDEO CARD INLINE CONTROLS - END
      // ==========================================================================
    });
  }

  // ==========================================================================
  // CO-CURRICULAR OPPORTUNITIES CAROUSEL
  // ==========================================================================

  function initCoCurricularCarousel() {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded');
      return;
    }

    const section = document.querySelector('.co-curricular-carousel');
    if (!section) return;

    const sliderEl = section.querySelector('.slider');
    const slideElements = Array.from(section.querySelectorAll('.swiper-slide'));
    if (!sliderEl || !slideElements.length) return;

    const paginationDots = Array.from(section.querySelectorAll('.pagination-dot'));
    const prevArrow = section.querySelector('.navigation .arrow-navigation__arrow--left');
    const nextArrow = section.querySelector('.navigation .arrow-navigation__arrow--right');
    const counterCurrent = section.querySelector('.counter-current');
    const counterTotal = section.querySelector('.counter-total');
    const totalSlides = slideElements.length;

    if (counterTotal) {
      counterTotal.textContent = totalSlides;
    }

    class CarouselSlide {
      constructor(el) {
        this.DOM = {
          el,
          media: el.querySelector('.video'),
          content: el.querySelector('.slide-content')
        };
        this.config = { duration: 1, ease: 'expo.inOut' };
        gsap.set(this.DOM.el, { opacity: 0, zIndex: 1, xPercent: 0 });
        this.setCurrent(false);
      }

      setCurrent(state = true) {
        this.DOM.el.classList.toggle('current', state);
      }

      play() {
        if (this.DOM.media) {
          this.DOM.media.play().catch(() => {});
        }
      }

      pause() {
        if (this.DOM.media) {
          this.DOM.media.pause();
          this.DOM.media.currentTime = 0;
        }
      }

      show(direction) {
        return this.toggle('show', direction);
      }

      hide(direction) {
        return this.toggle('hide', direction);
      }

      toggle(action, direction) {
        const offset = direction === 'right' ? 100 : -100;
        const contentOffset = direction === 'right' ? -80 : 80;
        const mediaOffset = direction === 'right' ? -60 : 60;

        return new Promise(resolve => {
          if (action === 'hide') {
            gsap.set(this.DOM.el, { opacity: 0, zIndex: 1, xPercent: 0 });
            this.setCurrent(false);
            resolve();
            return;
          }

          this.setCurrent(true);
          gsap.set(this.DOM.el, { opacity: 1, zIndex: 11, xPercent: offset });

          const timeline = gsap.timeline({
            defaults: { duration: this.config.duration, ease: this.config.ease },
            onComplete: () => {
              gsap.set(this.DOM.el, { zIndex: 9, xPercent: 0 });
              resolve();
            }
          });

          timeline.to(this.DOM.el, { xPercent: 0 }, 0);

          if (this.DOM.media) {
            timeline.fromTo(
              this.DOM.media,
              { xPercent: mediaOffset, scale: 1.05 },
              { xPercent: 0, scale: 1 },
              0
            );
          }
          if (this.DOM.content) {
            timeline.fromTo(
              this.DOM.content,
              { xPercent: contentOffset, filter: 'blur(30px)', opacity: 0.2 },
              { xPercent: 0, filter: 'blur(0px)', opacity: 1 },
              0
            );
          }
        });
      }
    }

    const slides = slideElements.map(el => new CarouselSlide(el));
    let currentIndex = 0;
    let isAnimating = false;

    const updatePagination = index => {
      paginationDots.forEach((dot, dotIndex) => {
        dot.classList.toggle('pagination-dot--active', dotIndex === index);
      });
    };

    const updateCounter = index => {
      if (counterCurrent) {
        counterCurrent.textContent = index + 1;
      }
    };

    const preloadVideos = () => {
      section.querySelectorAll('video').forEach(video => {
        video.setAttribute('preload', 'auto');
        try {
          if (video.readyState < 2) {
            video.load();
          }
        } catch (error) {
          console.warn('Unable to preload video', error);
        }
      });
    };
    preloadVideos();
    window.addEventListener('load', preloadVideos, { once: true });

    async function goTo(targetIndex, direction) {
      const normalizedIndex = (targetIndex + totalSlides) % totalSlides;
      if (isAnimating || normalizedIndex === currentIndex) return;

      const travelDirection = direction || (normalizedIndex > currentIndex ? 'right' : 'left');
      isAnimating = true;

      const outgoing = slides[currentIndex];
      const incoming = slides[normalizedIndex];

      incoming.play();
      await incoming.show(travelDirection);
      outgoing.pause();
      await outgoing.hide(travelDirection);
      outgoing.setCurrent(false);
      currentIndex = normalizedIndex;
      updatePagination(currentIndex);
      updateCounter(currentIndex);
      isAnimating = false;
    }

    // Events
    if (prevArrow) {
      prevArrow.addEventListener('click', () => goTo(currentIndex - 1, 'left'));
    }
    if (nextArrow) {
      nextArrow.addEventListener('click', () => goTo(currentIndex + 1, 'right'));
    }
    paginationDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const direction = index > currentIndex ? 'right' : 'left';
        goTo(index, direction);
      });
    });

    const handlePointer = () => {
      const initialSlide = slides[currentIndex];
      initialSlide.setCurrent(true);
      gsap.set(initialSlide.DOM.el, { opacity: 1, zIndex: 9, xPercent: 0 });
      initialSlide.play();
      updatePagination(currentIndex);
      updateCounter(currentIndex);
    };

    const getPoint = event => {
      if (event.touches && event.touches.length) {
        return { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
      if (event.changedTouches && event.changedTouches.length) {
        return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
      }
      return { x: event.clientX, y: event.clientY };
    };

    let swipeStart = null;
    let isPointerDown = false;

    const onPointerDown = event => {
      swipeStart = getPoint(event);
      isPointerDown = true;
    };

    const onPointerUp = event => {
      if (!isPointerDown || !swipeStart) return;
      const { x, y } = getPoint(event);
      const deltaX = x - swipeStart.x;
      const deltaY = y - swipeStart.y;
      isPointerDown = false;
      swipeStart = null;

      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        const direction = deltaX < 0 ? 'right' : 'left';
        goTo(currentIndex + (deltaX < 0 ? 1 : -1), direction);
      }
    };

    sliderEl.addEventListener('touchstart', onPointerDown, { passive: true });
    sliderEl.addEventListener('touchend', onPointerUp);
    sliderEl.addEventListener('mousedown', event => {
      event.preventDefault();
      onPointerDown(event);
    });
    window.addEventListener('mouseup', onPointerUp);

    handlePointer();
  }


  // ==========================================================================
  // STAFF FILTERS
  // ==========================================================================

  function initStaffFilters() {
    // Check if jQuery and Isotope are available
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.isotope === 'undefined') {
      console.warn('jQuery or Isotope is not loaded. Staff filters will not work.');
      return;
    }

    const $staffSections = jQuery('.staff-section');
    if (!$staffSections.length) return;

    $staffSections.each(function() {
      const $section = jQuery(this);
      const $grid = $section.find('.staff-isotope-grid');
      const $filterButtons = $section.find('.filters .filter-tab');

      if (!$grid.length || !$filterButtons.length) return;

      // Convert data-filter attributes to classes for Isotope
      $grid.find('.staff-item').each(function() {
        const $item = jQuery(this);
        const filters = $item.attr('data-filter');
        if (filters) {
          const filterClasses = filters.split(' ').map(function(f) {
            return f.trim();
          }).filter(function(f) {
            return f.length > 0;
          });
          $item.addClass(filterClasses.join(' '));
        }
      });

      // Initialize Isotope - fitRows works with Bootstrap responsive columns
      // CSS will override Isotope positioning on mobile to preserve Bootstrap grid
      const $isoGrid = $grid.isotope({
        itemSelector: '.staff-item',
        layoutMode: 'fitRows',
        transitionDuration: '0.36s'
      });

      // Function to apply filter and refresh scroll
      const applyFilterAndRefresh = function(filterSelector) {
        $isoGrid.isotope({ filter: filterSelector });

        // Refresh scroll triggers after layout
        setTimeout(function() {
          try {
            const smootherInstance =
              window.ScrollSmoother &&
              typeof window.ScrollSmoother.get === 'function' &&
              window.ScrollSmoother.get();
            if (smootherInstance && typeof smootherInstance.refresh === 'function') {
              smootherInstance.refresh();
            }
          } catch (error) {
            console.warn('ScrollSmoother refresh failed:', error);
          }

          if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
            window.ScrollTrigger.refresh();
          }
        }, 400);
      };

      // Handle filter button clicks
      $filterButtons.on('click', function() {
        const $button = jQuery(this);
        const filterValue = $button.attr('data-filter') || 'all';

        // Update active state
        $filterButtons.removeClass('filter-tab--active');
        $button.addClass('filter-tab--active');

        // Create filter selector - '*' shows all, otherwise filter by class
        const filterSelector = filterValue === 'all' ? '*' : '.' + filterValue;

        // Apply filter
        applyFilterAndRefresh(filterSelector);
      });

      // Apply initial filter based on active button (or show all by default)
      const $activeButton = $filterButtons.filter('.filter-tab--active');
      const initialFilterValue = $activeButton.length ? ($activeButton.attr('data-filter') || 'all') : 'all';
      const initialFilterSelector = initialFilterValue === 'all' ? '*' : '.' + initialFilterValue;
      applyFilterAndRefresh(initialFilterSelector);
    });
  }

  // ==========================================================================
  // LATEST NEWS FILTERS
  // ==========================================================================

  function initLatestNewsFilters() {
    // Check if jQuery and Isotope are available
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.isotope === 'undefined') {
      console.warn('jQuery or Isotope is not loaded. Latest news filters will not work.');
      return;
    }

    const $filtersSection = jQuery('.latest-news-filters-section');
    if (!$filtersSection.length) return;

    const $filterButtons = $filtersSection.find('.latest-news-filters-section__filter-btn');
    if (!$filterButtons.length) return;

    // Find the isotope grid (will be added later when section details are provided)
    const $grid = jQuery('.latest-news-isotope-grid');
    
    // If grid exists, initialize Isotope
    if ($grid.length) {
      // Convert data-filter attributes to classes for Isotope
      $grid.find('.latest-news-item').each(function() {
        const $item = jQuery(this);
        const filters = $item.attr('data-filter');
        if (filters) {
          const filterClasses = filters.split(' ').map(function(f) {
            return f.trim();
          }).filter(function(f) {
            return f.length > 0;
          });
          $item.addClass(filterClasses.join(' '));
        }
      });

      // Initialize Isotope
      const $isoGrid = $grid.isotope({
        itemSelector: '.latest-news-item',
        layoutMode: 'fitRows',
        transitionDuration: '0.36s'
      });

      // Function to apply filter and refresh scroll
      const applyFilterAndRefresh = function(filterSelector) {
        $isoGrid.isotope({ filter: filterSelector });

        // Refresh scroll triggers after layout
        setTimeout(function() {
          try {
            const smootherInstance =
              window.ScrollSmoother &&
              typeof window.ScrollSmoother.get === 'function' &&
              window.ScrollSmoother.get();
            if (smootherInstance && typeof smootherInstance.refresh === 'function') {
              smootherInstance.refresh();
            }
          } catch (error) {
            console.warn('ScrollSmoother refresh failed:', error);
          }

          if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
            window.ScrollTrigger.refresh();
          }
        }, 400);
      };

      // Handle filter button clicks
      $filterButtons.on('click', function() {
        const $button = jQuery(this);
        const filterValue = $button.attr('data-filter') || 'all';

        // Update active state
        $filterButtons.removeClass('latest-news-filters-section__filter-btn--active');
        $button.addClass('latest-news-filters-section__filter-btn--active');

        // Create filter selector - '*' shows all, otherwise filter by class
        const filterSelector = filterValue === 'all' ? '*' : '.' + filterValue;

        // Apply filter
        applyFilterAndRefresh(filterSelector);
      });

      // Apply initial filter based on active button (or show all by default)
      const $activeButton = $filterButtons.filter('.latest-news-filters-section__filter-btn--active');
      const initialFilterValue = $activeButton.length ? ($activeButton.attr('data-filter') || 'all') : 'all';
      const initialFilterSelector = initialFilterValue === 'all' ? '*' : '.' + initialFilterValue;
      applyFilterAndRefresh(initialFilterSelector);
    } else {
      // Grid doesn't exist yet, just handle button active states
      $filterButtons.on('click', function() {
        const $button = jQuery(this);
        $filterButtons.removeClass('latest-news-filters-section__filter-btn--active');
        $button.addClass('latest-news-filters-section__filter-btn--active');
      });
    }
  }

  // ==========================================================================
  // FIVE A'S SECTION TABS
  // ==========================================================================

  function initFiveAsTabs() {
    const fiveAsSection = document.querySelector('.five-as-section');
    if (!fiveAsSection) return;

    const filterButtons = Array.from(fiveAsSection.querySelectorAll('.five-as-section__nav-item'));
    const tabContents = Array.from(fiveAsSection.querySelectorAll('.five-as-section__tab-content'));
    if (!filterButtons.length || !tabContents.length) return;

    const animationTimers = new WeakMap();
    const animationDuration = 360;
    let refreshTimeoutId = null;

    const scheduleScrollRefresh = (delay = 0) => {
      if (refreshTimeoutId) {
        clearTimeout(refreshTimeoutId);
      }

      refreshTimeoutId = setTimeout(() => {
        try {
          const smootherInstance =
            window.ScrollSmoother &&
            typeof window.ScrollSmoother.get === 'function' &&
            window.ScrollSmoother.get();
          if (smootherInstance && typeof smootherInstance.refresh === 'function') {
            smootherInstance.refresh();
          }
        } catch (error) {
          console.warn('ScrollSmoother refresh failed:', error);
        }

        if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
          window.ScrollTrigger.refresh();
        }
      }, delay);
    };

    let activeFilter =
      fiveAsSection.querySelector('.five-as-section__nav-item--active')?.getAttribute('data-filter') || 'active-wilderness';

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter') || 'active-wilderness';
        if (filterValue === activeFilter) return;
        activeFilter = filterValue;
        filterButtons.forEach(btn => btn.classList.toggle('five-as-section__nav-item--active', btn === button));
        applyFilter(filterValue);
      });
    });

    applyFilter(activeFilter, { skipAnimation: true });

    function clearTimer(content) {
      const timer = animationTimers.get(content);
      if (timer) {
        clearTimeout(timer);
        animationTimers.delete(content);
      }
    }

    function showContent(content, skipAnimation) {
      clearTimer(content);
      content.classList.remove('is-hidden');
      content.style.display = '';

      if (skipAnimation) {
        content.classList.remove('is-filtering-in', 'is-filtering-out');
        content.classList.add('is-active');
        return;
      }

      content.classList.remove('is-filtering-out');
      content.classList.add('is-filtering-in', 'is-active');
      const timer = setTimeout(() => {
        content.classList.remove('is-filtering-in');
        animationTimers.delete(content);
      }, animationDuration);
      animationTimers.set(content, timer);
    }

    function hideContent(content, skipAnimation) {
      clearTimer(content);

      if (skipAnimation) {
        content.classList.add('is-hidden');
        content.classList.remove('is-filtering-in', 'is-filtering-out', 'is-active');
        content.style.display = 'none';
        return;
      }

      content.classList.remove('is-filtering-in', 'is-active');
      content.classList.add('is-filtering-out');
      const timer = setTimeout(() => {
        content.classList.remove('is-filtering-out');
        content.classList.add('is-hidden');
        content.style.display = 'none';
        animationTimers.delete(content);
      }, animationDuration);
      animationTimers.set(content, timer);
    }

    function applyFilter(filterValue, options = {}) {
      const { skipAnimation = false } = options;

      if (skipAnimation) {
        tabContents.forEach(content => {
          const contentFilter = content.getAttribute('data-tab');
          const shouldShow = contentFilter === filterValue;

          if (shouldShow) {
            showContent(content, true);
          } else {
            hideContent(content, true);
          }
        });
        scheduleScrollRefresh(0);
        return;
      }

      const contentsToHide = tabContents.filter(content => {
        const contentFilter = content.getAttribute('data-tab');
        return contentFilter !== filterValue && content.classList.contains('is-active');
      });
      const contentsToShow = tabContents.filter(content => {
        const contentFilter = content.getAttribute('data-tab');
        return contentFilter === filterValue;
      });

      if (!contentsToShow.length && !contentsToHide.length) return;

      contentsToHide.forEach(content => hideContent(content, false));

      const startShow = () => {
        tabContents.forEach(content => {
          const contentFilter = content.getAttribute('data-tab');
          const shouldShow = contentsToShow.includes(content);
          if (shouldShow) {
            showContent(content, false);
          } else {
            content.classList.add('is-hidden');
            content.style.display = 'none';
          }
        });
      };

      setTimeout(() => {
        startShow();
        scheduleScrollRefresh(animationDuration + 50);
      }, animationDuration);
    }
  }


  // ==========================================================================
  // FEATURES CARDS SWIPER SLIDER
  // ==========================================================================

  // function initFeaturesCardsSlider() {
  //   if (typeof Swiper === 'undefined') {
  //     console.warn('Swiper is required for the features cards slider');
  //     return;
  //   }

  //   const sliders = document.querySelectorAll('.what-we-do-section .features-cards-carousel');
  //   if (!sliders.length) return;

  //   sliders.forEach(slider => {
  //     if (slider.swiper) return;

  //     const paginationEl = slider.querySelector('.features-cards-pagination');
  //     const slideCount = slider.querySelectorAll('.swiper-slide').length;

  //     const swiperConfig = {
  //       speed: 600,
  //       loop: slideCount >= 3,
  //       centeredSlides: false,
  //       spaceBetween: 12,
  //       slidesPerView: 1.25,
  //       breakpoints: {
  //         576: {
  //           slidesPerView: 1.35
  //         },
  //         768: {
  //           slidesPerView: 1.6,
  //           centeredSlides: true,
  //           spaceBetween: 20
  //         },
  //         1024: {
  //           slidesPerView: 3,
  //           centeredSlides: true,
  //           spaceBetween: 10
  //         },
  //         1400: {
  //           slidesPerView: 4,
  //           centeredSlides: true,
  //           spaceBetween: 8
  //         }
  //       }
  //     };

  //     if (paginationEl) {
  //       swiperConfig.pagination = {
  //         el: paginationEl,
  //         clickable: true
  //       };
  //     }

  //     new Swiper(slider, swiperConfig);
  //   });
  // }

  // ==========================================================================
  // FAQ ACCORDION
  // ==========================================================================

  function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;

    let faqToggles = [];
    let arrowAnimations = [];

    // Create GSAP animations for each FAQ item
    faqItems.forEach(function(item, index) {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const arrow = item.querySelector('.faq-arrow');
      
      // Initialize answer state - completely hidden when closed
      answer.style.overflow = 'hidden';
      
      // Create inner wrapper for content to handle padding properly
      const innerContent = answer.querySelector('p');
      if (innerContent && !answer.querySelector('.faq-inner-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'faq-inner-wrapper';
        wrapper.style.padding = '0 1.5625rem 1.25rem 1.5625rem';
        
        // Move content into wrapper
        while (answer.firstChild) {
          wrapper.appendChild(answer.firstChild);
        }
        answer.appendChild(wrapper);
        
        // Remove padding from answer
        answer.style.padding = '0';
      }
      
      // Set up GSAP content animation
      gsap.set(answer, { height: "auto" });
      
      let contentAnimation = gsap.timeline()
        .from(answer, { 
          height: 0, 
          duration: 0.3, 
          ease: "power2.inOut",
          onReverseComplete: function() {
            // Ensure completely hidden when animation completes
            gsap.set(answer, { height: 0 });
          }
        })
        .reverse();

      // Store animation functions
      faqToggles.push(function(clickedQuestion) {
        if (clickedQuestion === question) {
          contentAnimation.reversed(!contentAnimation.reversed());
        } else {
          contentAnimation.reverse();
        }
      });

      // Store arrow animation function with proper rotation direction
      arrowAnimations.push(function(clickedQuestion, isOpening) {
        if (clickedQuestion === question) {
          if (isOpening) {
            // Opening: rotate clockwise to 180°
            gsap.to(arrow, {
              rotation: 180,
              duration: 0.4,
              ease: "power2.inOut"
            });
          } else {
            // Closing: rotate counter-clockwise back to 0°
            gsap.to(arrow, {
              rotation: 0,
              duration: 0.4,
              ease: "power2.inOut"
            });
          }
        } else {
          // Close other arrows
          gsap.to(arrow, {
            rotation: 0,
            duration: 0.4,
            ease: "power2.inOut"
          });
        }
      });

      // Set initial state (first item open)
      if (index === 0) {
        question.setAttribute('aria-expanded', 'true');
        contentAnimation.play();
        gsap.set(arrow, { rotation: 180 });
      } else {
        question.setAttribute('aria-expanded', 'false');
        gsap.set(answer, { height: 0 });
        gsap.set(arrow, { rotation: 0 });
      }
    });

    // Add click event listeners
    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', function(e) {
        e.preventDefault();
        
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQ items
        faqItems.forEach(function(otherItem) {
          const otherQuestion = otherItem.querySelector('.faq-question');
          if (otherQuestion !== question) {
            otherQuestion.setAttribute('aria-expanded', 'false');
          }
        });
        
        // Toggle current item
        const willBeOpen = !isExpanded;
        this.setAttribute('aria-expanded', willBeOpen ? 'true' : 'false');
        
        // Execute all toggle functions
        faqToggles.forEach(function(toggleFn) {
          toggleFn(question);
        });
        
        // Execute arrow animations with direction
        arrowAnimations.forEach(function(arrowFn) {
          arrowFn(question, willBeOpen);
        });
      });
    });
  }

  // ==========================================================================
  // LOCAL NAVIGATION / FILTER SECTION - ISOTOPE
  // ==========================================================================

  function initLocalNavFilters() {
    // Check if Isotope is available
    if (typeof Isotope === 'undefined') {
      console.warn('Isotope is not loaded. Local navigation filters will not work.');
      return;
    }

    const filterButtons = document.querySelectorAll('.local-nav-item');
    const contentContainer = document.querySelector('.local-nav-content-container');
    
    if (!contentContainer || filterButtons.length === 0) return;
    
    // Get the default filter from the active button
    const activeButton = document.querySelector('.local-nav-item.is-active');
    const defaultFilter = activeButton ? activeButton.getAttribute('data-filter') : '.welcome-head';
    
    // Initialize Isotope on the content container (not the buttons)
    const iso = new Isotope(contentContainer, {
      itemSelector: '.local-nav-content-item',
      layoutMode: 'vertical',
      transitionDuration: '0.4s',
      filter: defaultFilter // Show only the default/active content
    });
    
    // Filter button click handlers
    filterButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(function(btn) {
          btn.classList.remove('is-active');
        });
        
        // Add active class to clicked button
        this.classList.add('is-active');
        
        // Get filter value
        const filterValue = this.getAttribute('data-filter');
        
        // Filter Isotope content (not buttons)
        iso.arrange({ 
          filter: filterValue 
        });
      });
    });
    
    // Re-layout on window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        iso.layout();
      }, 250);
    });
  }

  // ==========================================================================
  // END LOCAL NAVIGATION / FILTER SECTION - ISOTOPE
  // ==========================================================================

 
  
})();
