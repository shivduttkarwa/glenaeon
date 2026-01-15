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
        rotatedPill: slide.querySelector('.student-story-hero-rotated-image'),
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
        if (slide.rotatedPill) {
            gsap.set(slide.rotatedPill, { clearProps: 'transform,opacity,visibility,will-change' });
        }
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
            prev.rotatedPill,
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
            next.rotatedPill,
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
        // Flying pill animation setup (like intro)
        let pillTargetX = 0;
        let pillTargetY = 0;
        let pillTargetRotation = 0;
        let pillOffsetX = 0;
        let pillOffsetY = 0;

        if (next.rotatedPill) {
            const pillRect = next.rotatedPill.getBoundingClientRect();
            const offscreenPadding = 48;
            pillOffsetX = (-pillRect.width - offscreenPadding) - pillRect.left;
            pillOffsetY = (-pillRect.height - offscreenPadding) - pillRect.top;
            pillTargetX = gsap.getProperty(next.rotatedPill, 'x') || 0;
            pillTargetY = gsap.getProperty(next.rotatedPill, 'y') || 0;
            pillTargetRotation = gsap.getProperty(next.rotatedPill, 'rotation') || 0;
            const spinTurns = 0.5;

            gsap.set(next.rotatedPill, {
                x: pillTargetX + pillOffsetX,
                y: pillTargetY + pillOffsetY,
                rotation: pillTargetRotation - (360 * spinTurns),
                autoAlpha: 0,
                transformOrigin: '50% 50%',
                willChange: 'transform,opacity'
            });
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
                if (next.rotatedPill) {
                    gsap.set(next.rotatedPill, { clearProps: 'will-change' });
                }
                if (prev.rotatedPill) {
                    gsap.set(prev.rotatedPill, { clearProps: 'transform,opacity,visibility,will-change' });
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
        // Slide out previous pill to the right while fading
        if (prev.rotatedPill) {
            const prevPillRect = prev.rotatedPill.getBoundingClientRect();
            const offscreenPadding = 48;
            const prevPillCurrentX = gsap.getProperty(prev.rotatedPill, 'x') || 0;
            const prevPillCurrentY = gsap.getProperty(prev.rotatedPill, 'y') || 0;
            const prevPillCurrentRotation = gsap.getProperty(prev.rotatedPill, 'rotation') || 0;
            // Slide to right side (opposite of incoming)
            const exitOffsetX = window.innerWidth - prevPillRect.left + offscreenPadding;
            const exitOffsetY = (-prevPillRect.height - offscreenPadding) - prevPillRect.top;
            const spinTurns = 0.5;

            tl.to(prev.rotatedPill, {
                x: prevPillCurrentX + exitOffsetX,
                y: prevPillCurrentY + exitOffsetY,
                rotation: prevPillCurrentRotation + (360 * spinTurns),
                autoAlpha: 0,
                duration: 1.2,
                ease: 'sine.inOut'
            }, 0);
        }

        if (next.rotatedPill) {
            tl.to(next.rotatedPill, {
                autoAlpha: 1,
                duration: 0.8,
                ease: 'sine.out'
            }, 0);
            tl.to(next.rotatedPill, {
                x: pillTargetX,
                y: pillTargetY,
                rotation: pillTargetRotation,
                duration: 1.8,
                ease: 'sine.inOut'
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

    const isMobileLayout = () => window.matchMedia('(max-width: 767px)').matches;

    function initHorizontalScroll() {
        const isMobile = isMobileLayout();

        // Clear existing ScrollTrigger instances
        ScrollTrigger.getAll().forEach(st => {
            if (st.trigger === horizontalSection) st.kill();
        });

        if (isMobile) {
            gsap.set(scrollContainer, { clearProps: 'transform' });
            scrollContainer.style.width = '';
            return;
        }

        // Get current window width
        const vw = window.innerWidth;

        // Simple calculation: each section naturally takes its content width
        // Let the browser calculate the natural width with existing CSS gaps
        scrollContainer.style.width = 'auto';

        // Force a layout calculation
        const actualWidth = scrollContainer.scrollWidth;

        // Calculate how far to move (actual width minus one viewport width)
        const moveDistance = actualWidth - vw;

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
                    // Parallax removed - scroll-driven animations handle movement now.
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
            // Only refresh ScrollTrigger on desktop
            if (!isMobileLayout()) {
                ScrollTrigger.refresh();
            }
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

const SLIDER_EASE = 'power3.out';
const SLIDER_DURATION = 0.7;

function applySlideState(slide, pos, immediate) {
    if (!slide || !pos) return;
    const baseState = {
        x: pos.x,
        y: pos.y,
        rotation: pos.r,
        scale: pos.s,
        autoAlpha: 1
    };

    gsap.set(slide, {
        zIndex: pos.z,
        willChange: 'transform,opacity'
    });

    if (immediate) {
        gsap.set(slide, baseState);
        gsap.set(slide, { clearProps: 'will-change' });
        return;
    }

    gsap.to(slide, {
        ...baseState,
        duration: SLIDER_DURATION,
        ease: SLIDER_EASE,
        overwrite: 'auto',
        onComplete: () => {
            gsap.set(slide, { clearProps: 'will-change' });
        }
    });
}

let isAnimating = false;

function updateSlider(immediate = false, direction = 0, oldTopIndex = null) {
    if (immediate) {
        slides.forEach((slide, index) => {
            const relativePosition = (index - currentIndex + totalSlides) % totalSlides;
            const pos = positions[relativePosition];
            applySlideState(slide, pos, immediate);
        });
        return;
    }

    // Enhanced animation with card sliding out
    if (direction !== 0 && !isAnimating && oldTopIndex !== null) {
        isAnimating = true;

        // Get the old top card using the saved index
        const topCard = slides[oldTopIndex];

        // Slide out the top card to the side (keep it on top during exit)
        const slideOutDistance = direction === 1 ? 400 : -400;

        // Keep top card on top during exit animation
        gsap.set(topCard, { zIndex: 100 });

        gsap.to(topCard, {
            x: slideOutDistance,
            rotation: direction * 15,
            scale: 0.8,
            autoAlpha: 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
                // Set proper z-indexes for all cards AFTER top card has exited
                slides.forEach((slide, index) => {
                    const relativePosition = (index - currentIndex + totalSlides) % totalSlides;
                    const pos = positions[relativePosition];
                    gsap.set(slide, { zIndex: pos.z });
                });

                // Now animate all cards to their new positions
                slides.forEach((slide, index) => {
                    const relativePosition = (index - currentIndex + totalSlides) % totalSlides;
                    const pos = positions[relativePosition];

                    gsap.to(slide, {
                        x: pos.x,
                        y: pos.y,
                        rotation: pos.r,
                        scale: pos.s,
                        autoAlpha: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                        onComplete: () => {
                            isAnimating = false;
                        }
                    });
                });
            }
        });
    } else if (!isAnimating) {
        slides.forEach((slide, index) => {
            const relativePosition = (index - currentIndex + totalSlides) % totalSlides;
            const pos = positions[relativePosition];
            applySlideState(slide, pos, false);
        });
    }
}

function nextSlide() {
    if (isAnimating) return;
    const oldIndex = currentIndex;
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider(false, 1, oldIndex);
}

function prevSlide() {
    if (isAnimating) return;
    const oldIndex = currentIndex;
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider(false, -1, oldIndex);
}

// Button navigation - scoped to slider container only
if (sliderContainer) {
    sliderContainer.addEventListener('click', (e) => {
        if (e.target.closest('.next-btn') || e.target.closest('.arrow-navigation__arrow--right')) nextSlide();
        if (e.target.closest('.prev-btn') || e.target.closest('.arrow-navigation__arrow--left')) prevSlide();
    });

    // Touch/Swipe navigation for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swipe right - go to next
                nextSlide();
            } else {
                // Swipe left - go to previous
                prevSlide();
            }
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

if (slides.length) updateSlider(true);

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

let isAnimatingPanel5 = false;

function updateSliderPanel5(immediate = false, direction = 0, oldTopIndex = null) {
    if (immediate) {
        slidesPanel5.forEach((slide, index) => {
            const relativePosition = (index - currentIndexPanel5 + totalSlidesPanel5) % totalSlidesPanel5;
            const pos = positionsPanel5[relativePosition];
            applySlideState(slide, pos, immediate);
        });
        return;
    }

    // Enhanced animation with card sliding out
    if (direction !== 0 && !isAnimatingPanel5 && oldTopIndex !== null) {
        isAnimatingPanel5 = true;

        // Get the old top card using the saved index
        const topCard = slidesPanel5[oldTopIndex];

        // Slide out the top card to the side (keep it on top during exit)
        const slideOutDistance = direction === 1 ? 400 : -400;

        // Keep top card on top during exit animation
        gsap.set(topCard, { zIndex: 100 });

        gsap.to(topCard, {
            x: slideOutDistance,
            rotation: direction * 15,
            scale: 0.8,
            autoAlpha: 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
                // Set proper z-indexes for all cards AFTER top card has exited
                slidesPanel5.forEach((slide, index) => {
                    const relativePosition = (index - currentIndexPanel5 + totalSlidesPanel5) % totalSlidesPanel5;
                    const pos = positionsPanel5[relativePosition];
                    gsap.set(slide, { zIndex: pos.z });
                });

                // Now animate all cards to their new positions
                slidesPanel5.forEach((slide, index) => {
                    const relativePosition = (index - currentIndexPanel5 + totalSlidesPanel5) % totalSlidesPanel5;
                    const pos = positionsPanel5[relativePosition];

                    gsap.to(slide, {
                        x: pos.x,
                        y: pos.y,
                        rotation: pos.r,
                        scale: pos.s,
                        autoAlpha: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                        onComplete: () => {
                            isAnimatingPanel5 = false;
                        }
                    });
                });
            }
        });
    } else if (!isAnimatingPanel5) {
        slidesPanel5.forEach((slide, index) => {
            const relativePosition = (index - currentIndexPanel5 + totalSlidesPanel5) % totalSlidesPanel5;
            const pos = positionsPanel5[relativePosition];
            applySlideState(slide, pos, false);
        });
    }
}

function nextSlidePanel5() {
    if (isAnimatingPanel5) return;
    const oldIndex = currentIndexPanel5;
    currentIndexPanel5 = (currentIndexPanel5 + 1) % totalSlidesPanel5;
    updateSliderPanel5(false, 1, oldIndex);
}

function prevSlidePanel5() {
    if (isAnimatingPanel5) return;
    const oldIndex = currentIndexPanel5;
    currentIndexPanel5 = (currentIndexPanel5 - 1 + totalSlidesPanel5) % totalSlidesPanel5;
    updateSliderPanel5(false, -1, oldIndex);
}

// Button navigation - scoped to slider container only
const sliderContainerPanel5 = document.querySelector('.slider-container-panel5');
if (sliderContainerPanel5) {
    sliderContainerPanel5.addEventListener('click', (e) => {
        if (e.target.closest('.next-btn') || e.target.closest('.arrow-navigation__arrow--right')) nextSlidePanel5();
        if (e.target.closest('.prev-btn') || e.target.closest('.arrow-navigation__arrow--left')) prevSlidePanel5();
    });

    // Touch/Swipe navigation for mobile
    let touchStartX5 = 0;
    let touchEndX5 = 0;
    const minSwipeDistance5 = 50;

    sliderContainerPanel5.addEventListener('touchstart', (e) => {
        touchStartX5 = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainerPanel5.addEventListener('touchend', (e) => {
        touchEndX5 = e.changedTouches[0].screenX;
        handleSwipe5();
    }, { passive: true });

    function handleSwipe5() {
        const swipeDistance = touchEndX5 - touchStartX5;

        if (Math.abs(swipeDistance) > minSwipeDistance5) {
            if (swipeDistance > 0) {
                // Swipe right - go to next
                nextSlidePanel5();
            } else {
                // Swipe left - go to previous
                prevSlidePanel5();
            }
        }
    }
}

updateSliderPanel5(true);

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
            titleIn: 3.2,
            quoteIn: 3.4,
            buttonsIn: 3.6,
            navIn: 3.8
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
                ease: 'back.out(1.7)'
            }, introTimings.buttonsIn);
        }
        if (navigation) {
            introTimeline.to(navigation, {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.8,
                ease: 'back.out(1.7)'
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
    const panelOneTestimonial = document.querySelector('.horizontal-story-panel-1 .horizontal-story-testimonial-card');
    const panelSixTestimonial = document.querySelector('.horizontal-story-panel-6 .horizontal-story-testimonial-card');
    const panelSix = document.querySelector('.horizontal-story-panel-6');
    const panelTwoLeft = document.querySelector('.horizontal-story-panel-2 .horizontal-story-moments .left-block');
    const panelTwoLead = document.querySelector('.horizontal-story-panel-2 .right-block .lead');
    const panelTwoSvg = document.querySelector('.horizontal-story-panel-2 .svg-object');
    const panelTwoStar = document.querySelector('.horizontal-story-panel-2 .right-block .star');
    const panelThree = document.querySelector('.horizontal-story-panel-3');
    const panelFive = document.querySelector('.horizontal-story-panel-5');
    const panelFiveSlider = document.querySelector('.horizontal-story-panel-5 .slider-container-panel5');
    const panelFiveCircle = document.querySelector('.horizontal-story-panel-5 .circle-image');
    const panelSixSvgWrap = document.querySelector('.horizontal-story-panel-6 .svg-object');
    const panelSixSvgObject = panelSixSvgWrap ? panelSixSvgWrap.querySelector('object') : null;
    const panelSixWhatsNext = document.querySelector('.horizontal-story-panel-6 .horizontal-story-whats-next');
    const panelSixAvatar = panelSixWhatsNext ? panelSixWhatsNext.querySelector('.horizontal-story-whats-next-avatar') : null;
    const panelSixContent = panelSixWhatsNext ? panelSixWhatsNext.querySelector('.horizontal-story-whats-next-content') : null;
    const panelSeven = document.querySelector('.horizontal-story-panel-7');
    const panelSevenImageWrap = panelSeven ? panelSeven.querySelector('.image-wrap') : null;
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

    const resolveAxisPosition = (value, containerAnimation) => {
        if (!value || containerAnimation || typeof value !== 'string') return value;
        return value.replace('left', 'top');
    };

    const buildScrollTrigger = (containerAnimation, config) => {
        const triggerConfig = { ...config };
        if (containerAnimation) {
            triggerConfig.containerAnimation = containerAnimation;
            return triggerConfig;
        }
        if (triggerConfig.start) {
            triggerConfig.start = resolveAxisPosition(triggerConfig.start, containerAnimation);
        }
        if (triggerConfig.end) {
            triggerConfig.end = resolveAxisPosition(triggerConfig.end, containerAnimation);
        }
        return triggerConfig;
    };

    const initTestimonialCardScroll = (containerAnimation) => {
        if (!panelOneTestimonial) return;

        const existing = ScrollTrigger.getById('story-testimonial-card');
        if (existing) existing.kill();

        gsap.set(panelOneTestimonial, {
            x: 520,
            autoAlpha: 1,
            willChange: 'transform,opacity'
        });

        gsap.to(panelOneTestimonial, {
            x: 0,
            autoAlpha: 1,
            duration: 2,
            ease: 'back.out(1.4)',
            scrollTrigger: buildScrollTrigger(containerAnimation, {
                id: 'story-testimonial-card',
                trigger: panelOneTestimonial,
                start: 'left 130%',
                end: 'left 45%',
                scrub: true
            }),
            onComplete: () => {
                gsap.set(panelOneTestimonial, { clearProps: 'will-change' });
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
            y: 40,
            autoAlpha: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: buildScrollTrigger(containerAnimation, {
                id: 'story-panel-2-left-drop',
                trigger: panelTwoLeft,
                start: 'left 90%',
                end: 'left 55%',
                scrub: 0.9
            }),
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
            scrollTrigger: buildScrollTrigger(containerAnimation, {
                id: 'story-panel-2-lead',
                trigger: panelTwoLead,
                start: 'left 80%',
                end: 'left 45%',
                scrub: 0.7
            }),
            onComplete: () => {
                gsap.set(chars, { clearProps: 'will-change' });
            }
        });
    };

    const initPanelTwoStarReveal = (containerAnimation) => {
        if (!panelTwoStar) return;

        const existing = ScrollTrigger.getById('story-panel-2-star');
        if (existing) existing.kill();

        gsap.set(panelTwoStar, {
            y: 24,
            rotation: -35,
            scale: 0.6,
            autoAlpha: 0,
            transformOrigin: '50% 50%',
            willChange: 'transform,opacity'
        });

        gsap.to(panelTwoStar, {
            y: 0,
            rotation: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: buildScrollTrigger(containerAnimation, {
                id: 'story-panel-2-star',
                trigger: panelTwoStar,
                start: 'left 75%',
                end: 'left 45%',
                scrub: 0.7,
                onLeave: () => {
                    gsap.set(panelTwoStar, { clearProps: 'will-change' });
                },
                onLeaveBack: () => {
                    gsap.set(panelTwoStar, { clearProps: 'will-change' });
                }
            })
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

        const trigger = ScrollTrigger.create(buildScrollTrigger(containerAnimation, {
            id: 'story-panel-2-svg',
            trigger: panelTwoSvg,
            start: 'left 75%',
            end: 'left 30%',
            scrub: true,
            onUpdate: (self) => {
                applyDash(self.progress);
            },
            onRefresh: (self) => {
                applyDash(self.progress);
            }
        }));

        applyDash(trigger.progress || 0);
    };

    const initPanelSixSvgDraw = (containerAnimation) => {
        if (!panelSixSvgWrap) return;

        const triggerId = 'story-panel-6-svg';
        const existing = ScrollTrigger.getById(triggerId);
        if (existing) existing.kill();

        const run = (svgRoot) => {
            const maskPath = svgRoot ? svgRoot.querySelector('#story-panel-6-mask-path') : null;
            if (!maskPath) return;

            let pathLength = 0;
            try {
                pathLength = maskPath.getTotalLength();
            } catch (e) {
                pathLength = 0;
            }
            if (!pathLength) return;

            maskPath.style.strokeDasharray = `${pathLength}`;
            maskPath.style.strokeDashoffset = `-${pathLength}`;
            maskPath.style.willChange = 'stroke-dashoffset';

            const applyDash = (progress) => {
                maskPath.style.strokeDashoffset = `${-pathLength * (1 - progress)}`;
            };

            const trigger = ScrollTrigger.create(buildScrollTrigger(containerAnimation, {
                id: triggerId,
                trigger: panelSixSvgWrap,
                start: 'left 40%',
                end: 'left 10%',
                scrub: true,
                onUpdate: (self) => {
                    applyDash(self.progress);
                },
                onRefresh: (self) => {
                    applyDash(self.progress);
                }
            }));

            applyDash(trigger.progress || 0);
        };

        if (panelSixSvgObject) {
            const svgRoot = panelSixSvgObject.contentDocument
                ? panelSixSvgObject.contentDocument.querySelector('svg')
                : null;

            if (svgRoot) {
                run(svgRoot);
                return;
            }

            if (panelSixSvgObject.dataset.storySvgPending === 'true') return;
            panelSixSvgObject.dataset.storySvgPending = 'true';

            panelSixSvgObject.addEventListener('load', () => {
                panelSixSvgObject.dataset.storySvgPending = 'false';
                const loadedRoot = panelSixSvgObject.contentDocument
                    ? panelSixSvgObject.contentDocument.querySelector('svg')
                    : null;
                run(loadedRoot);
            }, { once: true });
            return;
        }

        const inlineSvg = panelSixSvgWrap.querySelector('svg');
        if (inlineSvg) run(inlineSvg);
    };

    const initPanelSixWhatsNextReveal = (containerAnimation) => {
        if (!panelSixWhatsNext) return;

        const existing = ScrollTrigger.getById('story-panel-6-whats-next');
        if (existing) existing.kill();

        const contentItems = panelSixContent
            ? Array.from(panelSixContent.querySelectorAll('h2, p, .horizontal-story-whats-next-buttons'))
            : [];

        if (panelSixAvatar) {
            gsap.set(panelSixAvatar, {
                scale: 0.2,
                autoAlpha: 0,
                transformOrigin: '50% 50%',
                willChange: 'transform,opacity'
            });
        }

        if (contentItems.length) {
            gsap.set(contentItems, {
                y: 40,
                autoAlpha: 0,
                willChange: 'transform,opacity'
            });
        }

        const tl = gsap.timeline({
            scrollTrigger: buildScrollTrigger(containerAnimation, {
                id: 'story-panel-6-whats-next',
                trigger: panelSixWhatsNext,
                start: 'left 70%',
                end: 'left 30%',
                scrub: 0.8,
                onLeave: () => {
                    gsap.set([panelSixAvatar, ...contentItems].filter(Boolean), { clearProps: 'will-change' });
                },
                onLeaveBack: () => {
                    gsap.set([panelSixAvatar, ...contentItems].filter(Boolean), { clearProps: 'will-change' });
                }
            })
        });

        if (panelSixAvatar) {
            tl.to(panelSixAvatar, {
                scale: 1,
                autoAlpha: 1,
                duration: 1,
                ease: 'power3.out'
            }, 0);
        }

        if (contentItems.length) {
            tl.to(contentItems, {
                y: 0,
                autoAlpha: 1,
                duration: 0.9,
                ease: 'power3.out',
                stagger: 0.2
            }, 0.15);
        }
    };

    const initPanelSevenSlideOut = (containerAnimation) => {
        if (!panelSevenImageWrap) return;

        const triggerId = 'story-panel-7-slide-out';
        const existing = ScrollTrigger.getById(triggerId);
        if (existing) existing.kill();

        gsap.set(panelSevenImageWrap, {
            x: -420,
            willChange: 'transform'
        });

        gsap.to(panelSevenImageWrap, {
            x: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: buildScrollTrigger(containerAnimation, {
                id: triggerId,
                trigger: panelSeven,
                start: 'left 90%',
                end: 'left 35%',
                scrub: 0.9,
                onLeave: () => {
                    gsap.set(panelSevenImageWrap, { clearProps: 'will-change' });
                },
                onLeaveBack: () => {
                    gsap.set(panelSevenImageWrap, { clearProps: 'will-change' });
                }
            })
        });
    };

    const initPanelThreeAssemble = (containerAnimation) => {
        if (!panelThree || !slides.length) return;

        const existing = ScrollTrigger.getById('story-panel-3-assemble');
        if (existing) existing.kill();

        const offsetX = 650;
        const offsetY = 650;
        const rotateOffset = -78;
        const targets = [];

        slides.forEach((slide, index) => {
            const relativePosition = (index - currentIndex + totalSlides) % totalSlides;
            const pos = positions[relativePosition];
            if (!pos) return;

            targets.push({ slide, pos });
            gsap.set(slide, {
                x: pos.x + offsetX,
                y: pos.y + offsetY,
                rotation: pos.r - rotateOffset,
                scale: pos.s,
                autoAlpha: 0,
                zIndex: pos.z,
                transformOrigin: '50% 50%',
                willChange: 'transform,opacity'
            });
        });

        const tl = gsap.timeline({
            scrollTrigger: buildScrollTrigger(containerAnimation, {
                id: 'story-panel-3-assemble',
                trigger: sliderContainer || panelThree,
                start: 'left 90%',
                end: 'left 25%',
                scrub: 0.8,
                onLeave: () => {
                    gsap.set(slides, { clearProps: 'will-change' });
                },
                onLeaveBack: () => {
                    gsap.set(slides, { clearProps: 'will-change' });
                }
            })
        });

        targets.forEach(({ slide, pos }, index) => {
            tl.to(slide, {
                x: pos.x,
                y: pos.y,
                rotation: pos.r,
                scale: pos.s,
                autoAlpha: 1,
                duration: 1.1,
                ease: 'power3.out'
            }, index * 0.25);
        });
    };



    const initPanelThreeQuoteSlide = (containerAnimation) => {
        if (!panelThree) return;

        const quotes = panelThree.querySelectorAll('.horizontal-story-card-quote');
        if (!quotes.length) return;

        quotes.forEach((quote, index) => {
            const triggerId = `story-panel-3-quote-slide-${index}`;
            const existing = ScrollTrigger.getById(triggerId);
            if (existing) existing.kill();

            gsap.set(quote, {
                yPercent: 120,
                autoAlpha: 0,
                willChange: 'transform,opacity'
            });

            gsap.to(quote, {
                yPercent: 0,
                autoAlpha: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: buildScrollTrigger(containerAnimation, {
                    id: triggerId,
                    trigger: quote,
                    start: 'left 70%',
                    end: 'left 25%',
                    scrub: 0.8,
                    onLeave: () => {
                        gsap.set(quote, { clearProps: 'will-change' });
                    },
                    onLeaveBack: () => {
                        gsap.set(quote, { clearProps: 'will-change' });
                    }
                })
            });
        });
    };

    const initPanelFiveAssemble = (containerAnimation) => {
        if (!panelFive || !slidesPanel5.length) return;

        const existing = ScrollTrigger.getById('story-panel-5-assemble');
        if (existing) existing.kill();

        const offsetX = 650;
        const offsetY = -650;
        const rotateOffset = 78;
        const targets = [];

        slidesPanel5.forEach((slide, index) => {
            const relativePosition = (index - currentIndexPanel5 + totalSlidesPanel5) % totalSlidesPanel5;
            const pos = positionsPanel5[relativePosition];
            if (!pos) return;

            targets.push({ slide, pos });
            gsap.set(slide, {
                x: pos.x + offsetX,
                y: pos.y + offsetY,
                rotation: pos.r - rotateOffset,
                scale: pos.s,
                autoAlpha: 0,
                zIndex: pos.z,
                transformOrigin: '50% 50%',
                willChange: 'transform,opacity'
            });
        });

        const tl = gsap.timeline({
            scrollTrigger: buildScrollTrigger(containerAnimation, {
                id: 'story-panel-5-assemble',
                trigger: panelFiveSlider || panelFive,
                start: 'left 90%',
                end: 'left 25%',
                scrub: 0.8,
                onLeave: () => {
                    gsap.set(slidesPanel5, { clearProps: 'will-change' });
                },
                onLeaveBack: () => {
                    gsap.set(slidesPanel5, { clearProps: 'will-change' });
                }
            })
        });

        targets.forEach(({ slide, pos }, index) => {
            tl.to(slide, {
                x: pos.x,
                y: pos.y,
                rotation: pos.r,
                scale: pos.s,
                autoAlpha: 1,
                duration: 1.1,
                ease: 'power3.out'
            }, index * 0.25);
        });
    };

    const initPanelFiveQuoteSlide = (containerAnimation) => {
        if (!panelFive) return;

        const quotes = panelFive.querySelectorAll('.horizontal-story-card-quote');
        if (!quotes.length) return;

        quotes.forEach((quote, index) => {
            const triggerId = `story-panel-5-quote-slide-${index}`;
            const existing = ScrollTrigger.getById(triggerId);
            if (existing) existing.kill();

            gsap.set(quote, {
                yPercent: 120,
                autoAlpha: 0,
                willChange: 'transform,opacity'
            });

            gsap.to(quote, {
                yPercent: 0,
                autoAlpha: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: buildScrollTrigger(containerAnimation, {
                    id: triggerId,
                    trigger: quote,
                    start: 'left 70%',
                    end: 'left 25%',
                    scrub: 0.8,
                    onLeave: () => {
                        gsap.set(quote, { clearProps: 'will-change' });
                    },
                    onLeaveBack: () => {
                        gsap.set(quote, { clearProps: 'will-change' });
                    }
                })
            });
        });
    };

    const initPanelFiveCircleReveal = (containerAnimation) => {
        if (!panelFiveCircle) return;

        const existing = ScrollTrigger.getById('story-panel-5-circle');
        if (existing) existing.kill();

        const dropOffset = panelSixTestimonial
            ? Math.max(window.innerHeight * 0.8, panelSixTestimonial.offsetHeight + 200)
            : 0;

        gsap.set(panelFiveCircle, {
            scale: 0.7,
            rotation: -18,
            y: 40,
            autoAlpha: 0,
            transformOrigin: '50% 50%',
            willChange: 'transform,opacity'
        });

        if (panelSixTestimonial) {
            gsap.set(panelSixTestimonial, {
                y: -dropOffset,
                willChange: 'transform'
            });
        }

        const cleanup = () => {
            gsap.set(panelFiveCircle, { clearProps: 'will-change' });
            if (panelSixTestimonial) {
                gsap.set(panelSixTestimonial, { clearProps: 'will-change' });
            }
        };

        const tl = gsap.timeline({
            scrollTrigger: buildScrollTrigger(containerAnimation, {
                id: 'story-panel-5-circle',
                trigger: panelFiveCircle,
                endTrigger: panelSixTestimonial || panelFiveCircle,
                start: 'left 60%',
                end: 'left 20%',
                scrub: 0.8,
                onLeave: cleanup,
                onLeaveBack: cleanup
            })
        });

        tl.to(panelFiveCircle, {
            scale: 1,
            rotation: 0,
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: 'power3.out'
        }, 0);

        if (panelSixTestimonial) {
            tl.to(panelSixTestimonial, {
                y: 0,
                duration: 1.1,
                ease: 'power3.out'
            }, 0);
        }
    };

    const initPanelFourImageSlide = (containerAnimation) => {
        if (!panelFourImageWrap) return;

        const existing = ScrollTrigger.getById('story-panel-4-image');
        if (existing) existing.kill();

        // Use the known CSS rotation value (5.53deg) to avoid issues with
        // getComputedStyle returning incorrect values during animations
        const CSS_BASE_ROTATION = 5.53;

        const targetRotation = CSS_BASE_ROTATION;

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
            scrollTrigger: buildScrollTrigger(containerAnimation, {
                id: 'story-panel-4-image',
                trigger: panelFourImageWrap,
                start: 'left 50%',
                end: 'left 5%',
                scrub: 0.8,
                onLeave: () => {
                    gsap.set(panelFourImageWrap, { clearProps: 'will-change' });
                },
                onLeaveBack: () => {
                    gsap.set(panelFourImageWrap, { clearProps: 'will-change' });
                }
            })
        });
    };

    const initPanelFourTextReveal = (containerAnimation) => {
        if (!panelFourDesc) return;

        const textTargets = panelFourDesc.querySelectorAll('h5, p');
        if (!textTargets.length) return;

        textTargets.forEach((textEl, index) => {
            const triggerId = `story-panel-4-text-${index}`;
            const existing = ScrollTrigger.getById(triggerId);
            if (existing) existing.kill();

            gsap.set(textEl, {
                yPercent: 120,
                autoAlpha: 0,
                willChange: 'transform,opacity'
            });

            gsap.to(textEl, {
                yPercent: 0,
                autoAlpha: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: buildScrollTrigger(containerAnimation, {
                    id: triggerId,
                    trigger: textEl,
                    start: 'left 70%',
                    end: 'left 25%',
                    scrub: 0.8,
                    onLeave: () => {
                        gsap.set(textEl, { clearProps: 'will-change' });
                    },
                    onLeaveBack: () => {
                        gsap.set(textEl, { clearProps: 'will-change' });
                    }
                })
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
                scrollTrigger: buildScrollTrigger(containerAnimation, {
                    id: triggerId,
                    trigger: wrap,
                    start: 'left 85%',
                    end: 'left 40%',
                    scrub: 0.7
                }),
                onComplete: () => {
                    gsap.set(items, { clearProps: 'will-change' });
                }
            });
        });
    };

    const initPanelScrollAnimations = () => {
        // Disable all desktop animations on mobile
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        if (isMobile) return;

        const containerAnimation = getHorizontalScrollAnimation();
        initTestimonialCardScroll(containerAnimation);
        initPanelTwoDrop(containerAnimation);
        initPanelTwoLeadReveal(containerAnimation);
        initPanelTwoStarReveal(containerAnimation);
        initPanelTwoSvgDraw(containerAnimation);
        initPanelSixSvgDraw(containerAnimation);
        initPanelSixWhatsNextReveal(containerAnimation);
        initPanelSevenSlideOut(containerAnimation);
        initPanelThreeAssemble(containerAnimation);
        initPanelThreeQuoteSlide(containerAnimation);
        initPanelFourImageSlide(containerAnimation);
        initPanelFourTextReveal(containerAnimation);
        initPanelFiveAssemble(containerAnimation);
        initPanelFiveQuoteSlide(containerAnimation);
        initPanelFiveCircleReveal(containerAnimation);
        initStoryDescReveal(containerAnimation);
    };

    requestAnimationFrame(initPanelScrollAnimations);
    ScrollTrigger.addEventListener('refresh', initPanelScrollAnimations);
});

// ==========================================================================
// MOBILE-ONLY ANIMATIONS - SEPARATE FROM DESKTOP
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

    // Only run on mobile
    if (!isMobile()) return;

    const panelOneCard = document.querySelector('.horizontal-story-panel-1 .horizontal-story-testimonial-card');
    const panelTwoSlider = document.querySelector('.horizontal-story-panel-2 .horizontal-story-moments .left-block');
    const panelTwoLead = document.querySelector('.horizontal-story-panel-2 .right-block .lead');
    const panelTwoStar = document.querySelector('.horizontal-story-panel-2 .right-block .star');
    const panelTwoSvg = document.querySelector('.horizontal-story-panel-2 .svg-object');
    const panelThree = document.querySelector('.horizontal-story-panel-3');
    const panelThreeSliderContainer = document.querySelector('.horizontal-story-panel-3 .slider-container');
    const panelThreeSlides = document.querySelectorAll('.horizontal-story-panel-3 .slide-card');
    const panelThreeQuote = document.querySelector('.horizontal-story-panel-3 .horizontal-story-card-quote');
    const panelThreeDescItems = document.querySelectorAll('.horizontal-story-panel-3 .story-desc');
    const panelFourThumb = document.querySelector('.horizontal-story-panel-4 .svg-block .circle-image');
    const panelFourContainer = document.querySelector('.horizontal-story-panel-4 .image-width-play-btn');
    const panelFourImage = panelFourContainer ? panelFourContainer.querySelector('.image-wrap') : null;
    const panelFourPlayBtn = panelFourImage ? panelFourImage.querySelector('.play-button') : null;
    const panelFourDesc = document.querySelector('.horizontal-story-panel-4 .image-description');
    const panelFive = document.querySelector('.horizontal-story-panel-5');
    const panelFiveSlides = document.querySelectorAll('.horizontal-story-panel-5 .slide-card-panel5');
    const panelFiveQuote = document.querySelector('.horizontal-story-panel-5 .horizontal-story-card-quote');
    const panelFiveCircle = document.querySelector('.horizontal-story-panel-5 .right-block .circle-image');
    const panelSixSvg = document.querySelector('.horizontal-story-panel-6 .svg-object');
    const panelSixTestimonial = document.querySelector('.horizontal-story-panel-6 .horizontal-story-testimonial-card');
    const panelSixAvatar = document.querySelector('.horizontal-story-panel-6 .horizontal-story-whats-next-avatar');
    const panelSixContent = document.querySelector('.horizontal-story-panel-6 .horizontal-story-whats-next-content');
    const panelSeven = document.querySelector('.horizontal-story-panel-7');
    const panelSevenImageWrap = panelSeven ? panelSeven.querySelector('.image-wrap') : null;

    // Panel 1: Testimonial Card - Slide in from left with scrub
    if (panelOneCard) {
        gsap.fromTo(panelOneCard,
            { x: -window.innerWidth, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: panelOneCard,
                    start: 'top 100%',
                    end: 'top 30%',
                    scrub: 1,
                    id: 'mobile-panel-1'
                }
            }
        );
    }

    // Panel 2: Moments slider - Slide in from right with scrub
    if (panelTwoSlider) {
        gsap.fromTo(panelTwoSlider,
            { x: window.innerWidth, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: panelTwoSlider,
                    start: 'top 100%',
                    end: 'top 30%',
                    scrub: 1,
                    id: 'mobile-panel-2-slider'
                }
            }
        );
    }

    // Panel 2: Quote text - Character animation with scrub (same as desktop)
    if (panelTwoLead) {
        // Use the same splitLeadChars function from desktop
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

        const chars = splitLeadChars(panelTwoLead);
        if (chars.length) {
            gsap.set(chars, {
                yPercent: 100,
                autoAlpha: 0,
                transformOrigin: '50% 100%',
                willChange: 'transform,opacity'
            });

            gsap.to(chars, {
                yPercent: 0,
                autoAlpha: 1,
                duration: 1.3,
                ease: 'back.inOut(1.7)',
                stagger: 0.06,
                scrollTrigger: {
                    trigger: panelTwoLead,
                    start: 'top 115%',
                    end: 'top 0%',
                    scrub: 0.7,
                    id: 'mobile-panel-2-lead'
                },
                onComplete: () => {
                    gsap.set(chars, { clearProps: 'will-change' });
                }
            });
        }
    }

    // Panel 2: Star - Same animation as desktop with scrub
    if (panelTwoStar) {
        gsap.fromTo(panelTwoStar,
            {
                y: 24,
                rotation: -35,
                scale: 0.6,
                autoAlpha: 0,
                transformOrigin: '50% 50%'
            },
            {
                y: 0,
                rotation: 0,
                scale: 1,
                autoAlpha: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: panelTwoStar,
                    start: 'top 85%',
                    end: 'top 40%',
                    scrub: 0.7,
                    id: 'mobile-panel-2-star'
                }
            }
        );
    }

    // Panel 2: SVG Path Drawing - Same as desktop with scrub
    if (panelTwoSvg) {
        const svgElement = panelTwoSvg.querySelector('svg');
        const maskPath = svgElement ? svgElement.querySelector('#story-panel-2-mask-path') : null;

        if (svgElement && maskPath) {
            let pathLength = 0;
            try {
                pathLength = maskPath.getTotalLength();
            } catch (e) {
                pathLength = 0;
            }

            if (pathLength) {
                maskPath.style.strokeDasharray = `${pathLength}`;
                maskPath.style.strokeDashoffset = `${pathLength}`;
                maskPath.style.willChange = 'stroke-dashoffset';

                ScrollTrigger.create({
                    trigger: panelTwoSvg,
                    start: 'top 85%',
                    end: 'top 30%',
                    scrub: true,
                    id: 'mobile-panel-2-svg',
                    onUpdate: (self) => {
                        maskPath.style.strokeDashoffset = `${pathLength * (1 - self.progress)}`;
                    },
                    onRefresh: (self) => {
                        maskPath.style.strokeDashoffset = `${pathLength * (1 - self.progress)}`;
                    }
                });
            }
        }
    }

    // Panel 3: Story Cards - Rotate from left bottom one by one (same as desktop)
    if (panelThree && panelThreeSlides.length) {
        const offsetX = -400;
        const offsetY = -400;
        const rotateOffset = 78;

        // Stacked positions (same as desktop)
        const positions = {
            0: { x: 0, y: 0, r: 0, s: 1, z: 40 },
            1: { x: -22, y: 19, r: -2.5, s: 0.98, z: 30 },
            2: { x: 30, y: -29, r: 5, s: 0.96, z: 20 },
            3: { x: 28, y: -56, r: 2.5, s: 0.94, z: 10 }
        };

        // Set initial state for all cards
        panelThreeSlides.forEach((slide, index) => {
            const pos = positions[index] || positions[0];
            gsap.set(slide, {
                x: pos.x + offsetX,
                y: pos.y + offsetY,
                rotation: pos.r - rotateOffset,
                scale: pos.s * 0.9,
                autoAlpha: 0,
                zIndex: pos.z,
                transformOrigin: '50% 50%'
            });
        });

        // Create timeline - plays once on first scroll
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: panelThreeSliderContainer || panelThree,
                start: 'top 80%',
                once: true,
                id: 'mobile-panel-3-cards'
            }
        });

        // Animate each card to its stacked position one by one
        panelThreeSlides.forEach((slide, index) => {
            const pos = positions[index] || positions[0];
            tl.to(slide, {
                x: pos.x,
                y: pos.y,
                rotation: pos.r,
                scale: pos.s,
                autoAlpha: 1,
                duration: 1.1,
                ease: 'power3.out'
            }, index * 0.25);
        });
    }

    // Panel 3: Quote text - Slide up
    if (panelThreeQuote) {
        gsap.fromTo(panelThreeQuote,
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: panelThreeQuote,
                    start: 'top 105%',
                    end: 'top 40%',
                    once: true,
                    id: 'mobile-panel-3-quote'
                }
            }
        );
    }

    // Panel 3: Description items - Slide up with stagger
    if (panelThreeDescItems.length) {
        gsap.fromTo(panelThreeDescItems,
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: 'power2.out',
                stagger: 0.15,
                scrollTrigger: {
                    trigger: panelThreeDescItems[0],
                    start: 'top 85%',
                    end: 'top 35%',
                    scrub: 1,
                    id: 'mobile-panel-3-desc'
                }
            }
        );
    }

    // Panel 4: Thumb SVG - Zoom in like star
    if (panelFourThumb) {
        gsap.fromTo(panelFourThumb,
            {
                rotation: -25,
                scale: 0.5,
                autoAlpha: 0,
                transformOrigin: '50% 50%'
            },
            {
                rotation: 0,
                scale: 1,
                autoAlpha: 1,
                ease: 'back.out(1.5)',
                scrollTrigger: {
                    trigger: panelFourThumb,
                    start: 'top 100%',
                    end: 'top 20%',
                    scrub: 0.7,
                    id: 'mobile-panel-4-thumb'
                }
            }
        );
    }

    // Panel 4: Image card - Rotate from top left like desktop (delayed)
    if (panelFourContainer && panelFourImage) {
        // Set play button invisible initially
        if (panelFourPlayBtn) {
            gsap.set(panelFourPlayBtn, { scale: 0, autoAlpha: 0 });
        }

        gsap.fromTo(panelFourImage,
            {
                x: -400,
                y: -400,
                rotation: -78,
                scale: 0.8,
                autoAlpha: 0,
                transformOrigin: '50% 50%'
            },
            {
                x: 0,
                y: 0,
                rotation: 5.53,
                scale: 1,
                autoAlpha: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: panelFourContainer,
                    start: 'top 70%',
                    end: 'top 20%',
                    scrub: 0.8,
                    id: 'mobile-panel-4-image'
                }
            }
        );

        // Play button - separate animation that triggers after image
        if (panelFourPlayBtn) {
            gsap.fromTo(panelFourPlayBtn,
                { scale: 0, autoAlpha: 0 },
                {
                    scale: 1,
                    autoAlpha: 1,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: panelFourContainer,
                        start: 'top 40%',
                        end: 'top 20%',
                        scrub: 0.5,
                        id: 'mobile-panel-4-playbtn'
                    }
                }
            );
        }
    }

    // Panel 4: Description - Slide in from bottom
    if (panelFourDesc) {
        gsap.fromTo(panelFourDesc,
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: panelFourDesc,
                    start: 'top 85%',
                    end: 'top 50%',
                    scrub: 1,
                    id: 'mobile-panel-4-desc'
                }
            }
        );
    }

    // Panel 5: Story Cards - Same as Panel 3 (rotate from left bottom)
    if (panelFive && panelFiveSlides.length) {
        const offsetX = -400;
        const offsetY = -400;
        const rotateOffset = 78;

        // Stacked positions (same as Panel 3)
        const positionsPanel5 = {
            0: { x: 0, y: 0, r: 0, s: 1, z: 40 },
            1: { x: -22, y: 19, r: -2.5, s: 0.98, z: 30 },
            2: { x: 30, y: -29, r: 5, s: 0.96, z: 20 },
            3: { x: 28, y: -56, r: 2.5, s: 0.94, z: 10 }
        };

        // Set initial state for all cards
        panelFiveSlides.forEach((slide, index) => {
            const pos = positionsPanel5[index] || positionsPanel5[0];
            gsap.set(slide, {
                x: pos.x + offsetX,
                y: pos.y + offsetY,
                rotation: pos.r - rotateOffset,
                scale: pos.s * 0.9,
                autoAlpha: 0,
                zIndex: pos.z,
                transformOrigin: '50% 50%'
            });
        });

        // Create timeline with scrub
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: panelFive,
                start: 'top 70%',
                end: 'bottom 30%',
                once: true,
                id: 'mobile-panel-5-cards'
            }
        });

        // Animate each card to its stacked position one by one
        panelFiveSlides.forEach((slide, index) => {
            const pos = positionsPanel5[index] || positionsPanel5[0];
            tl.to(slide, {
                x: pos.x,
                y: pos.y,
                rotation: pos.r,
                scale: pos.s,
                autoAlpha: 1,
                duration: 1.1,
                ease: 'power3.out'
            }, index * 0.25);
        });
    }

    // Panel 5: Quote text - Slide up
    if (panelFiveQuote) {
        gsap.fromTo(panelFiveQuote,
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: panelFiveQuote,
                    start: 'top 105%',
                    end: 'top 40%',
                    once: true,
                    id: 'mobile-panel-5-quote'
                }
            }
        );
    }

    // Panel 5: Circle SVG - Zoom in with rotation like star
    if (panelFiveCircle) {
        gsap.fromTo(panelFiveCircle,
            {
                rotation: -18,
                scale: 0.7,
                y: 40,
                autoAlpha: 0,
                transformOrigin: '50% 50%'
            },
            {
                rotation: 0,
                scale: 1,
                y: 0,
                autoAlpha: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: panelFiveCircle,
                    start: 'top 85%',
                    end: 'top 40%',
                    scrub: 0.8,
                    id: 'mobile-panel-5-circle'
                }
            }
        );
    }

    // Panel 6: SVG Path Drawing - Same as Panel 2
    if (panelSixSvg) {
        const initSvgDraw = (svgRoot) => {
            const maskPath = svgRoot ? svgRoot.querySelector('#story-panel-6-mask-path') : null;
            if (!maskPath) return;

            let pathLength = 0;
            try {
                pathLength = maskPath.getTotalLength();
            } catch (e) {
                return;
            }
            if (!pathLength) return;

            maskPath.style.strokeDasharray = `${pathLength}`;
            maskPath.style.strokeDashoffset = `${pathLength}`;
            maskPath.style.willChange = 'stroke-dashoffset';

            ScrollTrigger.create({
                trigger: panelSixSvg,
                start: 'top 85%',
                end: 'top 30%',
                scrub: true,
                id: 'mobile-panel-6-svg',
                onUpdate: (self) => {
                    maskPath.style.strokeDashoffset = `${pathLength * (1 - self.progress)}`;
                },
                onRefresh: (self) => {
                    maskPath.style.strokeDashoffset = `${pathLength * (1 - self.progress)}`;
                }
            });
        };

        const objectEl = panelSixSvg.querySelector('object');
        if (objectEl) {
            const svgRoot = objectEl.contentDocument ? objectEl.contentDocument.querySelector('svg') : null;
            if (svgRoot) {
                initSvgDraw(svgRoot);
            } else {
                objectEl.addEventListener('load', () => {
                    const loadedRoot = objectEl.contentDocument ? objectEl.contentDocument.querySelector('svg') : null;
                    initSvgDraw(loadedRoot);
                }, { once: true });
            }
        } else {
            const inlineSvg = panelSixSvg.querySelector('svg');
            if (inlineSvg) initSvgDraw(inlineSvg);
        }
    }

    // Panel 6: Testimonial Card - Slide in from right
    if (panelSixTestimonial) {
        gsap.fromTo(panelSixTestimonial,
            { x: window.innerWidth, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: panelSixTestimonial,
                    start: 'top 90%',
                    end: 'top 40%',
                    scrub: 1,
                    id: 'mobile-panel-6-testimonial'
                }
            }
        );
    }

    // Panel 6: Avatar Circle - Zoom in smoothly
    if (panelSixAvatar) {
        gsap.fromTo(panelSixAvatar,
            {
                scale: 0.2,
                autoAlpha: 0,
                transformOrigin: '50% 50%'
            },
            {
                scale: 1,
                autoAlpha: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: panelSixAvatar,
                    start: 'top 85%',
                    end: 'top 40%',
                    scrub: 0.8,
                    id: 'mobile-panel-6-avatar'
                }
            }
        );
    }

    // Panel 6: Content items - Slide up with stagger (including individual buttons)
    if (panelSixContent) {
        const contentItems = Array.from(panelSixContent.querySelectorAll('h2, p, .horizontal-story-whats-next-buttons a'));

        if (contentItems.length) {
            gsap.fromTo(contentItems,
                { y: 40, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    ease: 'power3.out',
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: panelSixContent,
                        start: 'top 80%',
                        end: 'top 35%',
                        scrub: 0.8,
                        id: 'mobile-panel-6-content'
                    }
                }
            );
        }
    }

    // Panel 7: Tour section - Slide up from below
    if (panelSevenImageWrap) {
        gsap.fromTo(panelSevenImageWrap,
            { y: -500 },
            {
                y: 0,

                ease: 'power3.out',
                scrollTrigger: {
                    trigger: panelSeven,
                    start: 'top 80%',
                    end: 'top 10%',
                    scrub: 1,
                    id: 'mobile-panel-7'
                }
            }
        );
    }

});

// ==========================================================================
// STORY TESTIMONIAL AUDIO PLAYER
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
    const players = document.querySelectorAll('.horizontal-story-testimonial-card .testimonial-audio-player');
    if (!players.length) return;

    let activeAudio = null;
    let activePlayer = null;

    const formatTime = (seconds) => {
        if (!Number.isFinite(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const setWaveProgress = (player, ratio) => {
        if (!player) return;
        const waveform = player.querySelector('.testimonial-audio-waveform');
        if (!waveform) return;
        const clamped = Math.min(1, Math.max(0, Number.isFinite(ratio) ? ratio : 0));
        waveform.style.setProperty('--wave-progress', `${(clamped * 100).toFixed(2)}%`);
    };

    const setPlayState = (player, isPlaying) => {
        if (!player) return;
        const toggle = player.querySelector('.testimonial-audio-toggle');
        player.classList.toggle('is-audio-playing', Boolean(isPlaying));
        if (!toggle) return;
        toggle.classList.toggle('is-playing', Boolean(isPlaying));
        toggle.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
        toggle.setAttribute('aria-label', isPlaying ? 'Pause audio' : 'Play audio');
    };

    const updateCurrentTime = (player, seconds) => {
        if (!player) return;
        const currentTimeEl = player.querySelector('.testimonial-audio-current-time');
        if (currentTimeEl) currentTimeEl.textContent = formatTime(seconds || 0);
    };

    const updateDuration = (player, audio) => {
        if (!player || !audio || !Number.isFinite(audio.duration)) return;
        const durationEl = player.querySelector('.testimonial-audio-duration');
        if (durationEl) durationEl.textContent = formatTime(audio.duration);
    };

    const resetPlayer = (player, audio, resetTime = false) => {
        if (audio && resetTime) audio.currentTime = 0;
        updateCurrentTime(player, 0);
        setWaveProgress(player, 0);
        setPlayState(player, false);
    };

    players.forEach((player) => {
        const audio = player.querySelector('audio');
        if (!audio) return;

        const toggle = player.querySelector('.testimonial-audio-toggle');
        const waveform = player.querySelector('.testimonial-audio-waveform');

        if (audio.readyState >= 1) {
            updateDuration(player, audio);
        }

        audio.addEventListener('loadedmetadata', () => {
            updateDuration(player, audio);
            updateCurrentTime(player, audio.currentTime || 0);
            setWaveProgress(player, audio.duration ? audio.currentTime / audio.duration : 0);
        });

        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                setWaveProgress(player, audio.currentTime / audio.duration);
            }
            updateCurrentTime(player, audio.currentTime || 0);
        });

        audio.addEventListener('play', () => {
            setPlayState(player, true);
        });

        audio.addEventListener('pause', () => {
            if (audio !== activeAudio) return;
            setPlayState(player, false);
        });

        audio.addEventListener('ended', () => {
            resetPlayer(player, audio, true);
            if (activeAudio === audio) {
                activeAudio = null;
                activePlayer = null;
            }
        });

        if (toggle) {
            toggle.addEventListener('click', () => {
                if (activeAudio && activeAudio !== audio) {
                    activeAudio.pause();
                    resetPlayer(activePlayer, activeAudio, true);
                }

                activeAudio = audio;
                activePlayer = player;

                if (audio.paused) {
                    audio.play().catch(() => { });
                    setPlayState(player, true);
                } else {
                    audio.pause();
                    setPlayState(player, false);
                }
            });
        }

        if (waveform) {
            waveform.addEventListener('click', (event) => {
                if (!audio.duration) return;
                const rect = waveform.getBoundingClientRect();
                const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
                audio.currentTime = ratio * audio.duration;
                setWaveProgress(player, ratio);
                updateCurrentTime(player, audio.currentTime || 0);

                if (audio.paused) {
                    if (activeAudio && activeAudio !== audio) {
                        activeAudio.pause();
                        resetPlayer(activePlayer, activeAudio, true);
                    }
                    activeAudio = audio;
                    activePlayer = player;
                    audio.play().catch(() => { });
                    setPlayState(player, true);
                }
            });
        }
    });
});

// Story Navigation: Start Story & Close Story buttons
document.addEventListener('DOMContentLoaded', function () {
    const horizontalSection = document.querySelector('.horizontal-story-section');
    const scrollContainer = document.querySelector('.horizontal-story-scroll-container');
    const heroSection = document.querySelector('.student-story-hero-section');
    const panel1 = document.querySelector('.horizontal-story-panel-1');

    if (!horizontalSection || !scrollContainer || !heroSection || !panel1) return;

    const isMobileLayout = () => window.matchMedia('(max-width: 767px)').matches;

    // Calculate scroll position for a target element within horizontal scroll
    function getScrollPositionForElement(targetElement) {
        if (isMobileLayout()) {
            // On mobile, use standard vertical scroll
            return targetElement.offsetTop;
        }

        const vw = window.innerWidth;
        const containerWidth = scrollContainer.scrollWidth;
        const moveDistance = containerWidth - vw;

        // Get the target's left position relative to the scroll container
        const targetLeft = targetElement.offsetLeft;

        // Calculate the ratio of how far into the horizontal scroll this element is
        const scrollRatio = targetLeft / moveDistance;

        // The horizontal section starts at its offsetTop, and the scroll range equals moveDistance
        const sectionTop = horizontalSection.offsetTop;

        return sectionTop + (scrollRatio * moveDistance);
    }

    // Scroll to a target element smoothly
    function scrollToElement(targetElement) {
        if (!targetElement) return;

        if (isMobileLayout()) {
            // Mobile: standard smooth scroll
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Desktop: calculate the correct scroll position for horizontal scroll
            const scrollY = getScrollPositionForElement(targetElement);
            window.scrollTo({
                top: scrollY,
                behavior: 'smooth'
            });
        }
    }

    // "Start Story" buttons - scroll to panel-1
    document.querySelectorAll('.student-story-hero-button-primary').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            scrollToElement(panel1);
        });
    });

    // "Close Story" button - scroll back to hero section
    document.querySelectorAll('.horizontal-story-button-outline').forEach(button => {
        if (button.textContent.trim() === 'Close Story') {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                if (isMobileLayout()) {
                    heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // Scroll to top of horizontal section (hero is at the start)
                    window.scrollTo({
                        top: horizontalSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
});
