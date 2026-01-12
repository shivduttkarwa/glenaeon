// Story page scripts

document.addEventListener('DOMContentLoaded', function () {
    const heroSwiperEl = document.querySelector('.student-story-hero-swiper');
    if (!heroSwiperEl || typeof Swiper === 'undefined') return;

    const prefersReducedMotion = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    const supportsClipPath = typeof CSS !== 'undefined'
        && typeof CSS.supports === 'function'
        && (CSS.supports('clip-path', 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)')
            || CSS.supports('-webkit-clip-path', 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'));
    let isHeroAnimating = false;
    let heroTimeline = null;

    const getSlideElements = (slide) => ({
        bgMain: slide.querySelector('.student-story-hero-bg-main'),
        bgImg: slide.querySelector('.student-story-hero-bg-main img'),
        bgWhite: slide.querySelector('.student-story-hero-bg-white'),
        bgDark: slide.querySelector('.student-story-hero-bg-dark-overlay'),
        rotatedWrap: slide.querySelector('.student-story-hero-rotated-image-wrapper'),
        rotatedImg: slide.querySelector('.student-story-hero-rotated-image-wrapper img'),
        title: slide.querySelector('.student-story-hero-title'),
        quote: slide.querySelector('.student-story-hero-quote'),
        buttons: slide.querySelector('.student-story-hero-buttons')
    });

    const setVisibleSlides = (swiper, activeIndex, prevIndex) => {
        swiper.slides.forEach((slide, index) => {
            const shouldShow = index === activeIndex || index === prevIndex;
            slide.style.visibility = shouldShow ? 'visible' : 'hidden';
            slide.style.opacity = shouldShow ? '1' : '';
            slide.style.pointerEvents = shouldShow ? '' : 'none';
        });
    };

    const setClipStart = (el, direction, isMain) => {
        if (!el || !supportsClipPath) return;
        const downStart = isMain
            ? 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
            : 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)';
        const upStart = isMain
            ? 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
            : 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)';
        const clipStart = direction === 1 ? downStart : upStart;
        gsap.set(el, {
            clipPath: clipStart,
            webkitClipPath: clipStart,
            willChange: 'clip-path'
        });
    };

    const clearClip = (el) => {
        if (!el || !supportsClipPath) return;
        gsap.set(el, { clearProps: 'clip-path,webkitClipPath,will-change' });
    };

    const resetSlideState = (slide) => {
        if (!slide || typeof gsap === 'undefined') return;
        if (slide.bgMain) {
            gsap.set(slide.bgMain, { clearProps: 'transform,will-change' });
        }
        if (slide.bgWhite) {
            gsap.set(slide.bgWhite, { clearProps: 'transform,opacity,will-change' });
        }
        if (slide.bgDark) {
            gsap.set(slide.bgDark, { clearProps: 'transform,opacity,will-change' });
        }
        clearClip(slide.rotatedWrap);
        [slide.bgImg, slide.rotatedImg, slide.title, slide.quote, slide.buttons].forEach((el) => {
            if (el) gsap.set(el, { clearProps: 'transform,opacity,visibility' });
        });
    };

    const animateHeroTransition = (swiper) => {
        if (typeof gsap === 'undefined') return;

        const prevSlide = swiper.slides[swiper.previousIndex];
        const nextSlide = swiper.slides[swiper.activeIndex];
        if (!prevSlide || !nextSlide) return;

        const direction = swiper.swipeDirection === 'prev' ? -1 : 1;
        const prev = getSlideElements(prevSlide);
        const next = getSlideElements(nextSlide);
        const prevTitle = prev.title;
        const prevQuote = prev.quote;
        const prevButtons = prev.buttons;
        const nextTitle = next.title;
        const nextQuote = next.quote;
        const nextButtons = next.buttons;
        const prevText = [prevTitle, prevQuote, prevButtons].filter(Boolean);
        const nextText = [nextTitle, nextQuote, nextButtons].filter(Boolean);
        const movingNextBg = [next.bgWhite, next.bgMain, next.bgDark].filter(Boolean);

        const prevTargets = [
            prev.bgMain,
            prev.bgWhite,
            prev.bgDark,
            prev.bgImg,
            prev.rotatedWrap,
            prev.rotatedImg,
            prev.title,
            prev.quote,
            prev.buttons
        ].filter(Boolean);
        const nextTargets = [
            next.bgMain,
            next.bgWhite,
            next.bgDark,
            next.rotatedWrap,
            next.rotatedImg,
            next.title,
            next.quote,
            next.buttons
        ].filter(Boolean);

        gsap.killTweensOf([...prevTargets, ...nextTargets]);
        if (heroTimeline) {
            heroTimeline.kill();
            heroTimeline = null;
        }

        resetSlideState(prev);
        resetSlideState(next);

        if (prefersReducedMotion) {
            prevSlide.style.opacity = '';
            nextSlide.style.opacity = '';
            prevSlide.style.zIndex = '';
            nextSlide.style.zIndex = '';
            resetSlideState(next);
            setVisibleSlides(swiper, swiper.activeIndex, swiper.previousIndex);
            return;
        }

        prevSlide.style.opacity = '1';
        nextSlide.style.opacity = '1';
        prevSlide.style.zIndex = '1';
        nextSlide.style.zIndex = '2';
        setVisibleSlides(swiper, swiper.activeIndex, swiper.previousIndex);

        if (movingNextBg.length) {
            gsap.set(movingNextBg, {
                xPercent: direction === 1 ? 100 : -100,
                willChange: 'transform'
            });
        }
        if (next.rotatedWrap) {
            setClipStart(next.rotatedWrap, direction, true);
        }

        if (next.rotatedImg) {
            gsap.set(next.rotatedImg, { y: direction === 1 ? '-50%' : '50%' });
        }
        if (prevText.length) {
            gsap.set(prevText, { y: 0, scale: 1, autoAlpha: 1, transformOrigin: '50% 50%' });
        }
        if (nextText.length) {
            gsap.set(nextText, { y: 40, scale: 1.08, autoAlpha: 0, transformOrigin: '50% 50%' });
        }

        isHeroAnimating = true;

        const tl = gsap.timeline({
            defaults: { ease: 'cubic-bezier(0.87, 0, 0.13, 1)' },
            onComplete: () => {
                clearClip(next.rotatedWrap);
                if (next.bgMain) {
                    gsap.set(next.bgMain, { clearProps: 'transform,will-change' });
                }
                if (next.bgWhite) {
                    gsap.set(next.bgWhite, { clearProps: 'transform,opacity,will-change' });
                }
                if (next.bgDark) {
                    gsap.set(next.bgDark, { clearProps: 'transform,opacity,will-change' });
                }
                if (next.bgImg) {
                    gsap.set(next.bgImg, { clearProps: 'transform,opacity,visibility' });
                }
                if (next.rotatedImg) {
                    gsap.set(next.rotatedImg, { clearProps: 'transform,opacity,visibility' });
                }
                [next.title, next.quote, next.buttons].forEach((el) => {
                    if (el) gsap.set(el, { clearProps: 'transform,opacity,visibility' });
                });
                [prev.title, prev.quote, prev.buttons].forEach((el) => {
                    if (el) gsap.set(el, { clearProps: 'transform,opacity,visibility' });
                });
                prevSlide.style.opacity = '';
                prevSlide.style.zIndex = '';
                nextSlide.style.opacity = '';
                nextSlide.style.zIndex = '';
                setVisibleSlides(swiper, swiper.activeIndex, null);
                isHeroAnimating = false;
            }
        });

        heroTimeline = tl;

        if (movingNextBg.length) {
            tl.to(movingNextBg, {
                xPercent: 0,
                duration: 1.25
            }, 0);
        }
        if (next.rotatedWrap) {
            tl.to(next.rotatedWrap, {
                clipPath: supportsClipPath
                    ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                    : 'none',
                webkitClipPath: supportsClipPath
                    ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                    : 'none',
                duration: 1.25
            }, 0);
        }
        if (next.rotatedImg) {
            tl.to(next.rotatedImg, {
                y: 0,
                duration: 1.25
            }, 0);
        }
        if (prevTitle) {
            tl.to(prevTitle, {
                y: -40,
                scale: 0.9,
                autoAlpha: 0,
                duration: 0.5,
                ease: 'power2.in'
            }, 0);
        }
        if (prevQuote) {
            tl.to(prevQuote, {
                y: -30,
                scale: 0.9,
                autoAlpha: 0,
                duration: 0.5,
                ease: 'power2.in'
            }, 0.12);
        }
        if (prevButtons) {
            tl.to(prevButtons, {
                y: -30,
                scale: 0.9,
                autoAlpha: 0,
                duration: 0.5,
                ease: 'power2.in'
            }, 0.2);
        }
        if (nextTitle) {
            tl.to(nextTitle, {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.8,
                ease: 'power2.out'
            }, 0.55);
        }
        if (nextQuote) {
            tl.to(nextQuote, {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.8,
                ease: 'power2.out'
            }, 0.7);
        }
        if (nextButtons) {
            tl.to(nextButtons, {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.8,
                ease: 'power2.out'
            }, 0.78);
        }
    };

    const heroSwiper = new Swiper(heroSwiperEl, {
        speed: 0,
        loop: true,
        // autoplay: {
        //     delay: 5200,
        //     disableOnInteraction: false,
        // },
        effect: 'fade',
        fadeEffect: {
            crossFade: false
        },
        navigation: {
            nextEl: '.student-story-hero-navigation .arrow-navigation__arrow--right',
            prevEl: '.student-story-hero-navigation .arrow-navigation__arrow--left',
        },
        allowTouchMove: true,
        grabCursor: true,
        on: {
            init: function () {
                const slide = this.slides[this.activeIndex];
                if (slide) {
                    const els = getSlideElements(slide);
                    resetSlideState(els);
                }
                setVisibleSlides(this, this.activeIndex, null);
            },
            slideChangeTransitionStart: function () {
                animateHeroTransition(this);
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger is not loaded. Horizontal scroll will not work.');
        return;
    }

    const horizontalSection = document.querySelector('.horizontal-story-section');
    const pinWrapper = document.querySelector('.horizontal-story-pin-wrapper');
    const scrollContainer = document.querySelector('.horizontal-story-scroll-container');

    // Get all direct children (hero section + panels)
    const allSections = Array.from(scrollContainer.children);

    if (!horizontalSection || !pinWrapper || !scrollContainer || !allSections.length) {
        return;
    }

    function initHorizontalScroll() {
        // Get current window width
        const vw = window.innerWidth;

        // Simple calculation: each section naturally takes its content width
        // Let the browser calculate the natural width with existing CSS gaps
        scrollContainer.style.width = 'auto';

        // Force a layout calculation
        const actualWidth = scrollContainer.scrollWidth;

        // Calculate how far to move (actual width minus one viewport width)
        const moveDistance = actualWidth - vw;

        // Clear existing ScrollTrigger instances
        ScrollTrigger.getAll().forEach(st => {
            if (st.trigger === horizontalSection) st.kill();
        });

        // Create horizontal scroll animation
        gsap.to(scrollContainer, {
            x: -moveDistance,
            ease: 'none',
            scrollTrigger: {
                trigger: horizontalSection,
                start: 'top top',
                end: () => `+=${moveDistance}`,
                pin: pinWrapper,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: function (self) {
                    // Simple parallax for background images
                    const bgImages = document.querySelectorAll('.student-story-hero-bg-main img, .horizontal-story-card-image img');
                    bgImages.forEach(img => {
                        gsap.set(img, { x: self.progress * 30 - 15 });
                    });

                    // Parallax for testimonial cards
                    const cards = document.querySelectorAll('.horizontal-story-testimonial-card');
                    cards.forEach(card => {
                        gsap.set(card, { y: Math.sin(self.progress * Math.PI) * 10 });
                    });

                    // Subtle rotation for rotated elements
                    const rotatedElements = document.querySelectorAll('.student-story-hero-rotated-image, .horizontal-story-card-image');
                    rotatedElements.forEach(element => {
                        gsap.set(element, { rotation: self.progress * 10 - 5 });
                    });
                }
            }
        });
    }

    // Initialize on load
    initHorizontalScroll();

    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initHorizontalScroll();
            ScrollTrigger.refresh();
        }, 250);
    });
});

// Story Card Slider Script (exact copy from test.html)
let currentIndex = 0;
// Scope to panel-3 only by selecting within the first slider-container (not panel5)
const sliderContainer = document.querySelector('.horizontal-story-panel-3 .slider-container');
const slides = sliderContainer ? sliderContainer.querySelectorAll('.slide-card') : [];
const totalSlides = slides.length;

// Your fixed positions (used by the slider permanently)
const positions = {
    0: { x: 0, y: 0, r: 0, s: 1, z: 40 },
    1: { x: -22, y: 19, r: -2.5, s: 0.98, z: 30 },
    2: { x: 30, y: -29, r: 5, s: 0.96, z: 20 },
    3: { x: 28, y: -56, r: 2.5, s: 0.94, z: 10 }
};

function updateSlider() {
    slides.forEach((slide, index) => {
        const relativePosition = (index - currentIndex + totalSlides) % totalSlides;
        const pos = positions[relativePosition];

        slide.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${pos.r}deg) scale(${pos.s})`;
        slide.style.zIndex = pos.z;
        slide.style.opacity = 1;
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
}

// Button navigation - scoped to slider container only
if (sliderContainer) {
    sliderContainer.addEventListener('click', (e) => {
        if (e.target.closest('.next-btn') || e.target.closest('.arrow-navigation__arrow--right')) nextSlide();
        if (e.target.closest('.prev-btn') || e.target.closest('.arrow-navigation__arrow--left')) prevSlide();
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

if (slides.length) updateSlider();

// Story Card Slider Script for Panel 5
let currentIndexPanel5 = 0;
const slidesPanel5 = document.querySelectorAll('.slide-card-panel5');
const totalSlidesPanel5 = slidesPanel5.length;

// Your fixed positions (used by the slider permanently)
const positionsPanel5 = {
    0: { x: 0, y: 0, r: 0, s: 1, z: 40 },
    1: { x: -22, y: 19, r: -2.5, s: 0.98, z: 30 },
    2: { x: 30, y: -29, r: 5, s: 0.96, z: 20 },
    3: { x: 28, y: -56, r: 2.5, s: 0.94, z: 10 }
};

function updateSliderPanel5() {
    slidesPanel5.forEach((slide, index) => {
        const relativePosition = (index - currentIndexPanel5 + totalSlidesPanel5) % totalSlidesPanel5;
        const pos = positionsPanel5[relativePosition];

        slide.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${pos.r}deg) scale(${pos.s})`;
        slide.style.zIndex = pos.z;
        slide.style.opacity = 1;
    });
}

function nextSlidePanel5() {
    currentIndexPanel5 = (currentIndexPanel5 + 1) % totalSlidesPanel5;
    updateSliderPanel5();
}

function prevSlidePanel5() {
    currentIndexPanel5 = (currentIndexPanel5 - 1 + totalSlidesPanel5) % totalSlidesPanel5;
    updateSliderPanel5();
}

// Button navigation - scoped to slider container only
const sliderContainerPanel5 = document.querySelector('.slider-container-panel5');
if (sliderContainerPanel5) {
    sliderContainerPanel5.addEventListener('click', (e) => {
        if (e.target.closest('.next-btn') || e.target.closest('.arrow-navigation__arrow--right')) nextSlidePanel5();
        if (e.target.closest('.prev-btn') || e.target.closest('.arrow-navigation__arrow--left')) prevSlidePanel5();
    });
}

updateSliderPanel5();

// Moments That Made Me Swiper Initialization
document.addEventListener('DOMContentLoaded', function () {
    const momentsSwiper = new Swiper('.moments-swiper', {
        // Innovative creative effect with depth and rotation
        effect: 'creative',
        creativeEffect: {
            prev: {
                shadow: true,
                translate: ['-120%', 0, -500],
                rotate: [0, 0, -15],
                opacity: 0,
            },
            next: {
                shadow: true,
                translate: ['120%', 0, -500],
                rotate: [0, 0, 15],
                opacity: 0,
            },
        },

        // Speed and smoothness
        speed: 900,

        // Loop through slides
        loop: true,

        // Grab cursor for better UX
        grabCursor: true,

        // Allow touch/mouse drag
        allowTouchMove: true,

        // Pagination
        pagination: {
            el: '.moments-swiper .moments-pagination-fraction',
            type: 'fraction',
            formatFractionCurrent: function (number) {
                return number;
            },
            formatFractionTotal: function (number) {
                return number;
            },
            renderFraction: function (currentClass, totalClass) {
                return '<span class="' + currentClass + '"></span>' +
                    ' / ' +
                    '<span class="' + totalClass + '"></span>';
            },
        },

        // Navigation arrows - scoped to moments swiper only
        navigation: {
            nextEl: '.moments-swiper .moments-next',
            prevEl: '.moments-swiper .moments-prev',
        },

        // Auto height
        autoHeight: false,

        // Parallax effect on images
        on: {
            init: function () {
                updateMomentsParallax(this);
            },
            slideChange: function () {
                updateMomentsParallax(this);
            },
            progress: function (swiper, progress) {
                // Add progressive parallax during transition
                for (let i = 0; i < swiper.slides.length; i++) {
                    const slide = swiper.slides[i];
                    const slideProgress = slide.progress;
                    const img = slide.querySelector('.horizontal-story-moments-image img');
                    const overlay = slide.querySelector('.horizontal-story-moments-overlay');

                    if (img) {
                        // Parallax image movement
                        const translateX = slideProgress * 30;
                        const scale = 1 - Math.abs(slideProgress) * 0.1;
                        img.style.transform = `translateX(${translateX}px) scale(${scale})`;

                    }

                    if (overlay) {
                        // Fade overlay based on position
                        const opacity = 0.3 + Math.abs(slideProgress) * 0.3;
                        overlay.style.opacity = opacity;
                    }
                }
            },
        },
    });

    function updateMomentsParallax(swiper) {
        const activeSlide = swiper.slides[swiper.activeIndex];
        const img = activeSlide.querySelector('.horizontal-story-moments-image img');
        const overlay = activeSlide.querySelector('.horizontal-story-moments-overlay');

        if (img) {
            img.style.transform = 'translateX(0) scale(1)';
        }

        if (overlay) {
            overlay.style.opacity = 0.3;
        }
    }
});

// Hero intro: start the pill off-screen (top-left), fade in, rotate slowly, and glide to its resting tilt
document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const clearIntroPending = () => {
        if (body) body.classList.remove('hero-intro-pending');
    };

    if (typeof gsap === 'undefined') {
        clearIntroPending();
        return;
    }

    const prefersReducedMotion = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    if (prefersReducedMotion) {
        clearIntroPending();
        return;
    }

    const heroSwiperEl = document.querySelector('.student-story-hero-swiper');
    if (!heroSwiperEl) {
        clearIntroPending();
        return;
    }

    const runHeroPillIntro = () => {
        const activeSlide = heroSwiperEl.querySelector('.swiper-slide-active')
            || heroSwiperEl.querySelector('.swiper-slide');
        if (!activeSlide) {
            clearIntroPending();
            return;
        }

        const pill = activeSlide.querySelector('.student-story-hero-rotated-image');
        const heroTextMain = activeSlide.querySelector('.student-story-hero-title');
        const quote = activeSlide.querySelector('.student-story-hero-quote');
        const buttons = activeSlide.querySelector('.student-story-hero-buttons');
        const navigation = heroSwiperEl.querySelector('.student-story-hero-navigation');
        const contentTargets = [heroTextMain, quote, buttons].filter(Boolean);
        const introTargets = navigation ? [...contentTargets, navigation] : contentTargets;
        if (!pill) {
            clearIntroPending();
            return;
        }

        const pillRect = pill.getBoundingClientRect();
        const offscreenPadding = 48;
        const offsetX = (-pillRect.width - offscreenPadding) - pillRect.left;
        const offsetY = (-pillRect.height - offscreenPadding) - pillRect.top;
        // Capture the current transforms so we return to the exact designed tilt/position.
        const targetX = gsap.getProperty(pill, 'x') || 0;
        const targetY = gsap.getProperty(pill, 'y') || 0;
        const targetRotation = gsap.getProperty(pill, 'rotation') || 0;
        const spinTurns = 0.5;

        gsap.killTweensOf([pill, ...introTargets]);
        gsap.set(pill, {
            x: targetX + offsetX,
            y: targetY + offsetY,
            rotation: targetRotation - (360 * spinTurns),
            autoAlpha: 0,
            transformOrigin: '50% 50%',
            willChange: 'transform,opacity'
        });
        if (introTargets.length) {
            gsap.set(introTargets, {
                y: 40,
                scale: 1.08,
                autoAlpha: 0,
                transformOrigin: '50% 50%',
                willChange: 'transform,opacity'
            });
        }

        const glideDuration = 2.8;
        const introTimings = {
            pillIn: 0,
            titleIn: 0.55,
            quoteIn: 2,
            buttonsIn: 2.3,
            navIn: 2.5
        };

        const introTimeline = gsap.timeline();

        introTimeline
            .to(pill, {
                autoAlpha: 1,
                duration: 0.8,
                ease: 'sine.out'
            }, introTimings.pillIn)
            .to(pill, {
                x: targetX,
                y: targetY,
                rotation: targetRotation,
                duration: glideDuration,
                ease: 'sine.inOut'
            }, introTimings.pillIn);

        clearIntroPending();

        if (heroTextMain) {
            introTimeline.to(heroTextMain, {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.8,
                ease: 'power2.out'
            }, introTimings.titleIn);
        }

        if (quote) {
            introTimeline.to(quote, {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.8,
                ease: 'power2.out'
            }, introTimings.quoteIn);
        }

        if (buttons) {
            introTimeline.to(buttons, {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.8,
                ease: 'power2.out'
            }, introTimings.buttonsIn);
        }
        if (navigation) {
            introTimeline.to(navigation, {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.8,
                ease: 'power2.out'
            }, introTimings.navIn);
        }

        introTimeline
            .set(pill, { clearProps: 'will-change' })
            .set(introTargets, { clearProps: 'transform,opacity,visibility,will-change' });
    };

    requestAnimationFrame(runHeroPillIntro);
});

// ==========================================================================
// STORY PANEL SCROLL ANIMATIONS - START
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const horizontalSection = document.querySelector('.horizontal-story-section');
    const pinWrapper = document.querySelector('.horizontal-story-pin-wrapper');
    const testimonialCard = document.querySelector('.horizontal-story-testimonial-card');
    const panelTwoLeft = document.querySelector('.horizontal-story-panel-2 .horizontal-story-moments .left-block');
    const panelTwoLead = document.querySelector('.horizontal-story-panel-2 .right-block .lead');
    const panelTwoSvg = document.querySelector('.horizontal-story-panel-2 .svg-object');
    const panelThree = document.querySelector('.horizontal-story-panel-3');
    const panelFourImageWrap = document.querySelector('.horizontal-story-panel-4 .image-width-play-btn .image-wrap');
    const panelFourDesc = document.querySelector('.horizontal-story-panel-4 .image-description');
    const storyDescWraps = document.querySelectorAll('.story-desc-wrap');
    if (!horizontalSection) return;

    const getHorizontalScrollAnimation = () => {
        const triggers = ScrollTrigger.getAll();
        for (let i = 0; i < triggers.length; i += 1) {
            const trigger = triggers[i];
            if (trigger.trigger === horizontalSection && (!pinWrapper || trigger.vars.pin === pinWrapper)) {
                return trigger.animation || null;
            }
        }
        return null;
    };

    const initTestimonialCardScroll = (containerAnimation) => {
        if (!testimonialCard) return;

        const existing = ScrollTrigger.getById('story-testimonial-card');
        if (existing) existing.kill();

        gsap.set(testimonialCard, {
            x: 520,
            autoAlpha: 1,
            willChange: 'transform,opacity'
        });

        gsap.to(testimonialCard, {
            x: 0,
            autoAlpha: 1,
            duration: 2,
            ease: 'back.out(1.4)',
            scrollTrigger: {
                id: 'story-testimonial-card',
                trigger: testimonialCard,
                containerAnimation,
                start: 'left 90%',
                end: 'left 25%',
                scrub: true
            },
            onComplete: () => {
                gsap.set(testimonialCard, { clearProps: 'will-change' });
            }
        });
    };

    const splitLeadChars = (element) => {
        if (!element) return [];
        if (element.dataset.storyLeadSplit === 'true') {
            return Array.from(element.querySelectorAll('.story-lead-char'));
        }

        const rawText = element.textContent || '';
        const labelText = rawText.replace(/\s+/g, ' ').trim();
        if (!labelText) return [];

        element.dataset.storyLeadSplit = 'true';
        element.setAttribute('role', 'text');
        element.setAttribute('aria-label', labelText);
        element.textContent = '';

        const fragment = document.createDocumentFragment();
        const chars = [];
        const tokens = rawText.split(/(\s+)/);

        tokens.forEach((token) => {
            if (!token) return;
            if (/^\s+$/.test(token)) {
                fragment.appendChild(document.createTextNode(token));
                return;
            }

            const wordEl = document.createElement('span');
            wordEl.className = 'story-lead-word';
            wordEl.setAttribute('aria-hidden', 'true');
            wordEl.style.display = 'inline-block';
            wordEl.style.whiteSpace = 'nowrap';

            Array.from(token).forEach((char) => {
                const charEl = document.createElement('span');
                charEl.className = 'story-lead-char';
                charEl.textContent = char;
                charEl.setAttribute('aria-hidden', 'true');
                charEl.style.display = 'inline-block';
                wordEl.appendChild(charEl);
                chars.push(charEl);
            });

            fragment.appendChild(wordEl);
        });

        element.appendChild(fragment);
        return chars;
    };

    const initPanelTwoDrop = (containerAnimation) => {
        if (!panelTwoLeft) return;

        const existing = ScrollTrigger.getById('story-panel-2-left-drop');
        if (existing) existing.kill();

        const dropOffset = Math.max(window.innerHeight * 0.8, panelTwoLeft.offsetHeight + 180);
        gsap.set(panelTwoLeft, {
            y: -dropOffset,
            autoAlpha: 0,
            willChange: 'transform,opacity'
        });

        gsap.to(panelTwoLeft, {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                id: 'story-panel-2-left-drop',
                trigger: panelTwoLeft,
                containerAnimation,
                start: 'left 90%',
                end: 'left 55%',
                scrub: 0.9
            },
            onComplete: () => {
                gsap.set(panelTwoLeft, { clearProps: 'will-change' });
            }
        });
    };

    const initPanelTwoLeadReveal = (containerAnimation) => {
        if (!panelTwoLead) return;

        const chars = splitLeadChars(panelTwoLead);
        if (!chars.length) return;

        const existing = ScrollTrigger.getById('story-panel-2-lead');
        if (existing) existing.kill();

        gsap.set(chars, {
            yPercent: 100,
            autoAlpha: 0,
            transformOrigin: '50% 100%',
            willChange: 'transform,opacity'
        });

        gsap.to(chars, {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: 'back.inOut(2.7)',
            stagger: 0.06,
            scrollTrigger: {
                id: 'story-panel-2-lead',
                trigger: panelTwoLead,
                containerAnimation,
                start: 'left 80%',
                end: 'left 45%',
                scrub: 0.7
            },
            onComplete: () => {
                gsap.set(chars, { clearProps: 'will-change' });
            }
        });
    };

    const initPanelTwoSvgDraw = (containerAnimation) => {
        if (!panelTwoSvg) return;

        const existing = ScrollTrigger.getById('story-panel-2-svg');
        if (existing) existing.kill();

        const svgElement = panelTwoSvg.querySelector('svg');
        const maskPath = svgElement ? svgElement.querySelector('#story-panel-2-mask-path') : null;
        if (!svgElement || !maskPath) return;

        let pathLength = 0;
        try {
            pathLength = maskPath.getTotalLength();
        } catch (e) {
            pathLength = 0;
        }
        if (!pathLength) return;

        maskPath.style.strokeDasharray = `${pathLength}`;
        maskPath.style.strokeDashoffset = `${pathLength}`;
        maskPath.style.willChange = 'stroke-dashoffset';

        const applyDash = (progress) => {
            maskPath.style.strokeDashoffset = `${pathLength * (1 - progress)}`;
        };

        const trigger = ScrollTrigger.create({
            id: 'story-panel-2-svg',
            trigger: panelTwoSvg,
            containerAnimation,
            start: 'left 75%',
            end: 'left 30%',
            scrub: true,
            onUpdate: (self) => {
                applyDash(self.progress);
            },
            onRefresh: (self) => {
                applyDash(self.progress);
            }
        });

        applyDash(trigger.progress || 0);
    };

    const initPanelThreeAssemble = (containerAnimation) => {
        if (!panelThree || !slides.length) return;

        const existing = ScrollTrigger.getById('story-panel-3-assemble');
        if (existing) existing.kill();

        const offsetX = 240;
        const offsetY = 240;
        const targets = [];

        slides.forEach((slide, index) => {
            const relativePosition = (index - currentIndex + totalSlides) % totalSlides;
            const pos = positions[relativePosition];
            if (!pos) return;

            targets.push({ slide, pos });
            gsap.set(slide, {
                x: pos.x + offsetX,
                y: pos.y + offsetY,
                rotation: pos.r + 4,
                scale: pos.s * 0.92,
                autoAlpha: 0,
                zIndex: pos.z,
                transformOrigin: '50% 50%',
                willChange: 'transform,opacity'
            });
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                id: 'story-panel-3-assemble',
                trigger: panelThree,
                containerAnimation,
                start: 'left 85%',
                end: 'left 35%',
                scrub: true
            }
        });

        targets.forEach(({ slide, pos }, index) => {
            tl.to(slide, {
                x: pos.x,
                y: pos.y,
                rotation: pos.r,
                scale: pos.s,
                autoAlpha: 1,
                duration: 0.9,
                ease: 'power3.out'
            }, index * 0.15);
        });
    };

    const initPanelThreeQuoteReveal = (containerAnimation) => {
        if (!panelThree) return;

        const quotes = panelThree.querySelectorAll('.horizontal-story-card-quote');
        if (!quotes.length) return;

        quotes.forEach((quote, index) => {
            const chars = splitLeadChars(quote);
            if (!chars.length) return;

            const triggerId = `story-panel-3-quote-${index}`;
            const existing = ScrollTrigger.getById(triggerId);
            if (existing) existing.kill();

            gsap.set(chars, {
                yPercent: 100,
                autoAlpha: 0,
                transformOrigin: '50% 100%',
                willChange: 'transform,opacity'
            });

            gsap.to(chars, {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.001,
                ease: 'back.inOut(1.7)',
                stagger: 0.01,
                delay: 0.5,
                scrollTrigger: {
                    id: triggerId,
                    trigger: quote,
                    containerAnimation,
                    start: 'left 50%',
                    toggleActions: 'play none none none',
                    once: true
                },
                onComplete: () => {
                    gsap.set(chars, { clearProps: 'will-change' });
                }
            });
        });
    };

    const initPanelFourImageSlide = (containerAnimation) => {
        if (!panelFourImageWrap) return;

        const existing = ScrollTrigger.getById('story-panel-4-image');
        if (existing) existing.kill();

        const getBaseRotation = (element) => {
            if (element.dataset.baseRotation) {
                return parseFloat(element.dataset.baseRotation) || 0;
            }

            const style = window.getComputedStyle(element);
            const transform = style.transform || style.webkitTransform;
            if (!transform || transform === 'none') {
                element.dataset.baseRotation = '0';
                return 0;
            }

            const match = transform.match(/matrix(3d)?\(([^)]+)\)/);
            if (!match) {
                element.dataset.baseRotation = '0';
                return 0;
            }

            const values = match[2].split(',').map((value) => parseFloat(value));
            const a = values[0];
            const b = values[1];
            if (!Number.isFinite(a) || !Number.isFinite(b)) {
                element.dataset.baseRotation = '0';
                return 0;
            }

            const rotation = Math.atan2(b, a) * (180 / Math.PI);
            const rounded = Math.round(rotation * 100) / 100;
            element.dataset.baseRotation = String(rounded);
            return rounded;
        };

        const targetRotation = getBaseRotation(panelFourImageWrap);

        gsap.set(panelFourImageWrap, {
            x: -650,
            y: -350,
            rotation: targetRotation - 78,
            autoAlpha: 0,
            willChange: 'transform,opacity'
        });

        gsap.to(panelFourImageWrap, {
            x: 0,
            y: 0,
            rotation: targetRotation,
            autoAlpha: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
                id: 'story-panel-4-image',
                trigger: panelFourImageWrap,
                containerAnimation,
                start: 'left 50%',
                end: 'left 5%',
                scrub: 0.8,
                onLeave: () => {
                    gsap.set(panelFourImageWrap, { clearProps: 'will-change' });
                },
                onLeaveBack: () => {
                    gsap.set(panelFourImageWrap, { clearProps: 'will-change' });
                }
            }
        });
    };

    const initPanelFourTextReveal = (containerAnimation) => {
        if (!panelFourDesc) return;

        const textTargets = panelFourDesc.querySelectorAll('h5, p');
        if (!textTargets.length) return;

        textTargets.forEach((textEl, index) => {
            const chars = splitLeadChars(textEl);
            if (!chars.length) return;

            const triggerId = `story-panel-4-text-${index}`;
            const existing = ScrollTrigger.getById(triggerId);
            if (existing) existing.kill();

            gsap.set(chars, {
                yPercent: 100,
                autoAlpha: 0,
                transformOrigin: '50% 100%',
                willChange: 'transform,opacity'
            });

            gsap.to(chars, {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.9,
                ease: 'back.inOut(1.7)',
                stagger: 0.03,
                scrollTrigger: {
                    id: triggerId,
                    trigger: panelFourDesc,
                    containerAnimation,
                    start: 'left 70%',
                    end: 'left 30%',
                    scrub: 0.7,
                    onLeave: () => {
                        gsap.set(chars, { clearProps: 'will-change' });
                    },
                    onLeaveBack: () => {
                        gsap.set(chars, { clearProps: 'will-change' });
                    }
                },
            });
        });
    };

    const initStoryDescReveal = (containerAnimation) => {
        if (!storyDescWraps.length) return;

        storyDescWraps.forEach((wrap, index) => {
            const items = wrap.querySelectorAll('.story-desc');
            if (!items.length) return;

            const triggerId = `story-desc-wrap-${index}`;
            const existing = ScrollTrigger.getById(triggerId);
            if (existing) existing.kill();

            gsap.set(items, {
                x: 420,
                autoAlpha: 0,
                willChange: 'transform,opacity'
            });

            gsap.to(items, {
                x: 0,
                autoAlpha: 1,
                duration: 0.9,
                ease: 'power3.out',
                stagger: 0.5,
                scrollTrigger: {
                    id: triggerId,
                    trigger: wrap,
                    containerAnimation,
                    start: 'left 85%',
                    end: 'left 40%',
                    scrub: 0.7
                },
                onComplete: () => {
                    gsap.set(items, { clearProps: 'will-change' });
                }
            });
        });
    };

    const initPanelScrollAnimations = () => {
        const containerAnimation = getHorizontalScrollAnimation();
        if (!containerAnimation) return;
        initTestimonialCardScroll(containerAnimation);
        initPanelTwoDrop(containerAnimation);
        initPanelTwoLeadReveal(containerAnimation);
        initPanelTwoSvgDraw(containerAnimation);
        initPanelThreeAssemble(containerAnimation);
        initPanelThreeQuoteReveal(containerAnimation);
        initPanelFourImageSlide(containerAnimation);
        initPanelFourTextReveal(containerAnimation);
        initStoryDescReveal(containerAnimation);
    };

    requestAnimationFrame(initPanelScrollAnimations);
    ScrollTrigger.addEventListener('refresh', initPanelScrollAnimations);
});
