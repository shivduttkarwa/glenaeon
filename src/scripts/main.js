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
  // VIDEO TESTIMONIALS
  // ==========================================================================

  function initVideoTestimonials() {
    // Initialize video cards universally - works for video-testimonials and moments sections
    const sections = document.querySelectorAll('.video-testimonials, .moments-section');
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

      cardList.forEach(card => {
      const video = card.querySelector('.testimonial-video, .learner-video');
      // Support both old and new class names
      const controlButton = card.querySelector('.video-card-play-button, .play-button');
      if (!video || !controlButton) return;

      const isDesktopCard = Boolean(card.closest('.desktop-only'));
      const isMomentsCard = Boolean(card.closest('.moments-section'));
      const shouldHaveHover = isDesktopCard || (isMomentsCard && window.innerWidth >= 1024);
      
      setupDefaultState(video, shouldHaveHover);

      if (shouldHaveHover) {
        card.addEventListener('mouseenter', () => handleDesktopHover(video, controlButton, true));
        card.addEventListener('mouseleave', () => handleDesktopHover(video, controlButton, false));
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
            slideVideo.play().catch(() => {});
          }
        }
      });
    }

      function setupDefaultState(video, isDesktopCard) {
        video.muted = true;
        video.loop = true;

        if (isDesktopCard) {
          video.pause();
          video.currentTime = 0;
        } else {
          requestAnimationFrame(() => {
            video.play().catch(() => {});
          });
        }
      }

      function handleDesktopHover(video, button, isHovering) {
        if (button.classList.contains('is-active')) return;

        if (isHovering) {
          video.muted = true;
          video.play().catch(() => {});
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
        video.play().catch(() => {});
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
          video.play().catch(() => {});
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
