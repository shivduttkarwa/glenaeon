// Home Page Animations - GSAP ScrollTrigger
// Smooth scroll-triggered animations with scrub for various sections

class HomePageAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Wait for GSAP and ScrollTrigger to load
        if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
            gsap.registerPlugin(ScrollTrigger);
            this.setupMaskedImageAnimations();
            this.setupNurturingStartAnimations();
            this.setupVideoPromoAnimations();
            this.setupAudioTestimonialAnimations();
            this.setupMomentsClipAnimations();
            this.setupThreeCampusesAnimations();
            this.setupSectionTitleAnimations();
            this.setupCampusCardAnimations();
            this.setupWhatWeDoAnimations();
            this.setupLeadTextAnimation();
            this.setupWhatWeDoCircleCardsAnimation();
        } else {
            console.warn('GSAP or ScrollTrigger not loaded');
        }
    }

    // Reusable image zoom animation function
    // Usage examples:
    // this.animateImageZoomOut('.my-image', '.trigger-section'); // Basic usage
    // this.animateImageZoomOut('.my-image', '.trigger-section', { fromScale: 1.5, duration: 2 }); // Custom options
    // this.animateImageZoomOut(document.querySelector('.image'), document.querySelector('.section')); // DOM elements
    animateImageZoomOut(imageElement, triggerElement, options = {}) {
        const defaultOptions = {
            start: "top 50%",
            end: "bottom 20%",
            fromScale: 0,
            toScale: 1,
            duration: 1.25,
            ease: "power2.out",
            transformOrigin: "center center"
        };

        const opts = { ...defaultOptions, ...options };

        gsap.fromTo(
            imageElement,
            { scale: opts.fromScale },
            {
                duration: opts.duration,
                scale: opts.toScale,
                ease: opts.ease,
                transformOrigin: opts.transformOrigin,
                scrollTrigger: {
                    trigger: triggerElement,
                    start: opts.start,
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // Reusable clip reveal animation function
    // Usage examples:
    // this.animateClipReveal('.moments-card'); // Basic usage
    // this.animateClipReveal('.video-card', { staggerDelay: 0.15 }); // Custom stagger
    animateClipReveal(cardElements, options = {}) {
        const defaultOptions = {
            start: "top bottom-=100",
            duration: 1.1,
            ease: "power3.out",
            staggerDelay: 0.2
        };

        const opts = { ...defaultOptions, ...options };
        const cards = gsap.utils.toArray(cardElements);

        if (cards.length === 0) return;

        // Add clip reveal class to all cards
        cards.forEach(card => {
            card.classList.add('card-clip-reveal');
        });

        // Set initial clip state
        gsap.set(cards, {
            '--clip-value': '100%'
        });

        // Animate clip reveal on scroll with stagger
        ScrollTrigger.batch(cards, {
            start: opts.start,
            once: true,
            onEnter: elements => {
                elements.forEach((card, index) => {
                    gsap.fromTo(card, {
                        '--clip-value': '100%',
                    }, {
                        duration: opts.duration,
                        ease: opts.ease,
                        '--clip-value': '0%',
                        delay: index * opts.staggerDelay,
                        onStart: function () {
                            card.classList.add('animation-started');
                        },
                        onComplete: function () {
                            card.classList.add('clip-animation-complete', 'animation-finished');
                        }
                    });
                });
            }
        });
    }

    // Reusable content animation function
    // Usage examples:
    // this.animateContentSlideUp('.masked-image-content-block'); // Uses default selectors for masked-image
    // this.animateContentSlideUp('.section', { selectors: '.custom-class, .another-class' }); // Custom selectors
    // this.animateContentSlideUp('.section', { staggerDelay: 0.15 }); // Custom stagger
    animateContentSlideUp(containerElement, options = {}) {
        const defaultOptions = {
            start: "top 50%",
            end: "bottom 20%",
            fromY: 200,
            toY: 0,
            duration: 1.25,
            ease: "power2.out",
            staggerDelay: 0.1,
            fromOpacity: 0,
            toOpacity: 1,
            selectors: `
                .masked-image-content-block__description,
                .masked-image-content-block__cta,
                .masked-image-content-block__title-script,
                .masked-image-content-block__title-bold
            `,
            markers: false
        };

        const opts = { ...defaultOptions, ...options };

        // Find all content elements
        const containers = gsap.utils.toArray(containerElement);

        containers.forEach(container => {
            const contentElements = container.querySelectorAll(opts.selectors);

            if (contentElements.length === 0) return;

            // Set initial states for all content elements
            gsap.set(contentElements, {
                y: opts.fromY,
                autoAlpha: opts.fromOpacity
            });

            gsap.fromTo(
                contentElements,
                { y: opts.fromY, autoAlpha: opts.fromOpacity },
                {
                    duration: opts.duration,
                    y: opts.toY,
                    autoAlpha: opts.toOpacity,
                    ease: opts.ease,
                    stagger: opts.staggerDelay,
                    scrollTrigger: {
                        trigger: container,
                        start: opts.start,
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }

    // Original text slide-up function (kept for backward compatibility)
    animateTextSlideUp(textElements, triggerElement, options = {}) {
        const defaultOptions = {
            start: "top 70%",
            end: "bottom 20%",
            fromY: 200,
            toY: 0,
            duration: 1.25,
            ease: "power2.out",
            staggerDelay: 0.1,
            fromOpacity: 0,
            toOpacity: 1
        };

        const opts = { ...defaultOptions, ...options };

        gsap.utils.toArray(textElements).forEach(function (elem) {
            ScrollTrigger.create({
                trigger: triggerElement,
                start: opts.start,
                end: opts.end,
                onEnter: function () {
                    gsap.fromTo(
                        elem,
                        { y: opts.fromY, autoAlpha: opts.fromOpacity },
                        {
                            duration: opts.duration,
                            y: opts.toY,
                            autoAlpha: opts.toOpacity,
                            ease: opts.ease,
                            overwrite: "auto",
                            delay: gsap.utils.toArray(textElements).indexOf(elem) * opts.staggerDelay
                        }
                    );
                },
                onLeave: function () {
                    gsap.fromTo(elem, { autoAlpha: opts.toOpacity }, { autoAlpha: 0, overwrite: "auto" });
                },
                onEnterBack: function () {
                    gsap.fromTo(
                        elem,
                        { y: -opts.fromY, autoAlpha: opts.fromOpacity },
                        {
                            duration: opts.duration,
                            y: opts.toY,
                            autoAlpha: opts.toOpacity,
                            ease: opts.ease,
                            overwrite: "auto",
                            delay: gsap.utils.toArray(textElements).indexOf(elem) * opts.staggerDelay
                        }
                    );
                },
                onLeaveBack: function () {
                    gsap.fromTo(elem, { autoAlpha: opts.toOpacity }, { autoAlpha: 0, overwrite: "auto" });
                }
            });
        });
    }

    setupMaskedImageAnimations() {
        const maskedImageSections = document.querySelectorAll('.masked-image-content-block');

        maskedImageSections.forEach((section, index) => {
            // Find image block
            const imageBlock = section.querySelector('.masked-image-content-block-wrap');

            // Apply image zoom animation
            if (imageBlock) {
                this.animateImageZoomOut(imageBlock, section);
            }

            // Apply content slide-up animation (includes all content except titles)
            this.animateContentSlideUp(section);
        });
    }

    setupNurturingStartAnimations() {
        const section = document.querySelector('.nurturing-start-section');
        if (!section) return;

        // Use reusable content animation with custom selectors
        this.animateContentSlideUp(section, {
            selectors: `
                .nurturing-start-script,
                .nurturing-start-heading p,
                .nurturing-start-year,
                .nurturing-start-urgency,
                .nurturing-start-button
            `
        });
    }

    setupVideoPromoAnimations() {
        const section = document.querySelector('.full-width-video-promo');
        if (!section) return;

        // Use reusable content animation with custom selectors
        this.animateContentSlideUp(section, {
            selectors: `
                .video-promo-kicker,
                .video-promo-title-script,
                .video-promo-title-bold,
                .video-promo-description,
                .btn-philosophy
            `
        });
    }

    setupAudioTestimonialAnimations() {
        const section = document.querySelector('.full-width-testimonial-audio');
        if (!section) return;

        // Animate circular image wrapper (like masked-image)
        const imageWrapper = section.querySelector('.five-as-section__image-wrapper');
        if (imageWrapper) {
            this.animateImageZoomOut(imageWrapper, section);
        }

        // Use reusable content animation with custom selectors
        this.animateContentSlideUp(section, {
            selectors: `
                .testimonial-audio-kicker,
                .testimonial-audio-quote,
                .testimonial-audio-player
            `,
            start: "top 10%"
        });
    }

    setupMomentsClipAnimations() {
        const momentsSection = document.querySelector('.moments-section');
        if (!momentsSection) return;

        // Use reusable clip reveal animation
        this.animateClipReveal('.moments-section .moments-card');
    }

    setupThreeCampusesAnimations() {
        const campusCards = document.querySelectorAll('.three-campuses-section__card');

        campusCards.forEach(card => {
            const cardContent = card.querySelector('.three-campuses-section__card-content');
            if (!cardContent) return;

            const contentElements = cardContent.querySelectorAll('*');
            if (contentElements.length === 0) return;

            // Set initial states
            gsap.set(contentElements, {
                y: 20,
                autoAlpha: 0
            });

            // Animate with stagger
            gsap.fromTo(
                contentElements,
                { y: 20, autoAlpha: 0 },
                {
                    duration: 0.5,
                    y: 0,
                    autoAlpha: 1,
                    ease: "power2.out",
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 10%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }

    setupSectionTitleAnimations() {

        const sectionTitles = document.querySelectorAll(`
.three-campuses-section__title-script,
.three-campuses-section__title-bold,
.what-we-do-section h2,
.wellbeing-section h2,
.testimonial-section h2,
.moments-title-script,
.moments-title-bold,
.footer__title,

`);

        sectionTitles.forEach((title, index) => {
            this.animateTitleChars(title);
        });
    }


    splitChars(el) {
        if (!el) return [];
        if (el.querySelector(".bd-title-char")) {
            return Array.from(el.querySelectorAll(".bd-title-char"));
        }

        const text = el.textContent || "";
        el.textContent = "";
        const chars = [];
        let wordWrapper = null;

        [...text].forEach((char) => {
            const isSpace = /\s/.test(char);
            if (isSpace) {
                wordWrapper = null;
                el.appendChild(document.createTextNode(" "));
                return;
            }

            if (!wordWrapper) {
                wordWrapper = document.createElement("span");
                wordWrapper.className = "bd-title-word";
                wordWrapper.style.display = "inline-block";
                wordWrapper.style.whiteSpace = "nowrap";
                wordWrapper.style.transformOrigin = "50% 100%";
                el.appendChild(wordWrapper);
            }

            const span = document.createElement("span");
            span.className = "bd-title-char";
            span.textContent = char;
            span.style.display = "inline-block";
            span.style.transformOrigin = "50% 100%";
            wordWrapper.appendChild(span);
            chars.push(span);
        });

        return chars;
    }

    animateTitleChars(title) {
        const chars = this.splitChars(title);
        if (chars.length === 0) return;


        gsap.set(chars, {
            opacity: 0,
            yPercent: 90,
            rotateX: 70,
            transformOrigin: "50% 100%",
        });

        // Create timeline with scrub
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: title,
                start: "top 75%",
                end: "bottom 50%",
                scrub: 1,
                toggleActions: "play none none reverse"
            }
        });

        // Exact animation from test.html
        tl.to(chars, {
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            ease: "expo.out",
            duration: 0.9,
            stagger: 0.02,
        });
    }

    setupCampusCardAnimations() {
        // Find all three campus card images - exact animation from test.html
        const campusCards = document.querySelectorAll(`
.three-campuses-section__card-image-wrapper img,
.three-campuses-section .masked-image-content-block-wrap .image-wrap img
`);

        campusCards.forEach((img) => {
            const triggerElement = img.closest('.three-campuses-section__card') || img.closest('.col-lg-4') || img;
            gsap.set(img, { willChange: "transform, clip-path" });

            // One-time reveal on first entry, with a small delay for a softer start.
            gsap.fromTo(img,
                {
                    clipPath: "inset(50% 0 50% 0)",
                    y: 30,
                    opacity: 1
                },
                {
                    clipPath: "inset(0% 0 0% 0)",
                    y: 0,
                    opacity: 1,
                    duration: 0.9,

                    ease: "none",
                    scrollTrigger: {
                        trigger: triggerElement,
                        start: "top 55%",
                        toggleActions: "play none none none",
                        once: true
                    }
                }
            );
        });
    }

    setupWhatWeDoAnimations() {
        const section = document.querySelector('.what-we-do-section');
        if (!section) return;

        const leftTitle = section.querySelector('.section-title-left');
        const rightTitle = section.querySelector('.section-title-right');
        const logo = section.querySelector('.masked-logo-group img');

        if (!leftTitle || !rightTitle || !logo) return;

        // Set initial states
        gsap.set(leftTitle, { x: -window.innerWidth, opacity: 0 });
        gsap.set(rightTitle, { x: window.innerWidth, opacity: 0 });
        gsap.set(logo, { scale: 0, opacity: 0 });

        // Create timeline with scrub
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 60%",
                end: "bottom 40%",

                toggleActions: "play none none reverse"
            }
        });

        // Left title slides from left
        tl.to(leftTitle, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, 0);

        // Right title slides from right
        tl.to(rightTitle, {
            x: 0,
            opacity: 0.5,
            duration: 1,
            ease: "power2.out"
        }, 0);

        // Logo zooms out from center (slightly delayed)
        tl.to(logo, {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "back.out(1.7)"
        }, 0.3);
    }

    setupLeadTextAnimation() {
        const leadElements = document.querySelectorAll('p.lead');

        leadElements.forEach(lead => {
            // Set initial state
            gsap.set(lead, {
                y: 20,
                autoAlpha: 0
            });

            // Animate on scroll
            gsap.fromTo(
                lead,
                { y: 20, autoAlpha: 0 },
                {
                    duration: 1.25,
                    y: 0,
                    autoAlpha: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: lead,
                        start: "top 50%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }

    setupWhatWeDoCircleCardsAnimation() {
        const whatWeDoSection = document.querySelector('.what-we-do-section');
        if (!whatWeDoSection) return;

        const featureCards = whatWeDoSection.querySelectorAll('.feature-card');
        if (!featureCards.length) return;

        featureCards.forEach((card, index) => {
            // Animate both the outer frame and inner circle together
            const outerFrame = card.querySelector('.five-as-section__image-outer-circle img');
            const innerCircle = card.querySelector('.five-as-section__image-inner-circle img');

            if (outerFrame && innerCircle) {
                // Set initial state for both frame and circle
                gsap.set([outerFrame, innerCircle], {
                    scale: 0.4,
                    opacity: 0
                });

                // Animate both together
                gsap.to([outerFrame, innerCircle], {
                    scale: 1,
                    opacity: 1,
                    duration: 1.2,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 70%",
                        once: true
                    },
                    delay: index * 0.15
                });
            }

            // Content animation (same as masked-image-content)
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
                    ease: "power2.out",
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 70%",
                        once: true
                    },
                    delay: index * 0.15 + 0.3
                });
            }
        });
    }

}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new HomePageAnimations();
});