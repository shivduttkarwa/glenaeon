/**
 * Mega Menu Animations
 * ====================
 * Simple GSAP stagger animation for mega menu items.
 * Menu items slide up from below with stagger effect.
 */

(function () {
  'use strict';

  /**
   * Initialize mega menu animations
   * @param {HTMLElement} megaMenu - The mega menu container element
   * @param {HTMLElement} megaMenuOverlay - The overlay element
   * @param {HTMLElement} menuToggle - The toggle button element
   * @param {HTMLElement} body - The body element
   */
  function initMegaMenuAnimations(megaMenu, megaMenuOverlay, menuToggle, body) {
    if (!megaMenu || !megaMenuOverlay) return null;

    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded - menu animations disabled');
      return null;
    }

    // Create timeline (paused initially)
    let menuTimeline = gsap.timeline({ paused: true });
    const animationSettings = {
      closeTimeScale: 5.35,
      overlay: {
        fadeIn: 0.35,
        fadeOut: 0.001,
        closeDelay: 0,
        yOffset: 12
      }
    };
    let overlayTween = null;

    // Get menu items, circle image, footer links, and mobile elements
    const navItems = megaMenu.querySelectorAll('.mega-menu__nav-item');
    const circleImage = megaMenu.querySelector('.mega-menu__circle-image');
    const footerLinks = megaMenu.querySelectorAll('.mega-menu__footer-links a, .mega-menu__social a');
    const desktopQuickLinks = document.querySelector('.site-header .header-quick-links');
    const quickLinksDesktopOnly = window.matchMedia('(min-width: 769px)').matches;
    
    // Mobile-only elements
    const mobileQuickLinksBtn = megaMenu.querySelector('#mobileQuickLinksToggle');
    const mobileSearchInput = megaMenu.querySelector('.mega-menu__footer .input-group');

    // Build animation timeline
    // Show menu and animate menu items from below
    menuTimeline
      .to(megaMenu, {
        autoAlpha: 1,
        duration: 0.3
      })
      .staggerFromTo(
        navItems,
        0.5,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1 },
        0.1
      );

    // animate desktop quick links right after nav items
    if (desktopQuickLinks && quickLinksDesktopOnly) {
      menuTimeline.fromTo(
        desktopQuickLinks,
        { y: 0, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
        '>-0.8' // immediately after nav items
      );
    }

    // Add footer links animation (same as menu items, starts after nav items)
    if (footerLinks && footerLinks.length > 0) {
      menuTimeline.staggerFromTo(
        footerLinks,
        0.5,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1 },
        0.1,
        0.3 // Start after menu items begin animating
      );
    }

    // Add mobile quick links button and search input animation (mobile only)
    const mobileElements = [];
    if (mobileQuickLinksBtn) mobileElements.push(mobileQuickLinksBtn);
    if (mobileSearchInput) mobileElements.push(mobileSearchInput);
    
    if (mobileElements.length > 0) {
      menuTimeline.staggerFromTo(
        mobileElements,
        0.5,
        { y: 0, opacity: 0 },
        { y: 0, opacity: 1 },
        0.1,
        0.4 // Start slightly after buttons
      );
    }

    // Add circle image zoom animation (runs simultaneously with menu items)
    if (circleImage) {
      // Animate the entire circle image container (this includes both frame and images)
      menuTimeline.fromTo(
        circleImage,
        {
          scale: 0,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'none',
          transformOrigin: 'center center'
        },
        0.3 // Start slightly after menu appears
      );
    }

    /**
     * Open menu - play timeline forward
     */
    function openMenu() {
      // Ensure opening animation runs at the baseline speed
      menuTimeline.timeScale(1);
      // Reset timeline to start
      menuTimeline.progress(0);
      
      // Set initial state for menu items BEFORE menu becomes visible
      gsap.set(navItems, {
        y: 100,
        opacity: 0
      });
      
      // Set initial state for circle image (zoomed out from center)
      if (circleImage) {
        gsap.set(circleImage, {
          scale: 0,
          opacity: 0,
          transformOrigin: 'center center'
        });
      }
      
      // Set initial state for footer links (hidden below)
      if (footerLinks && footerLinks.length > 0) {
        gsap.set(footerLinks, {
          y: 100,
          opacity: 0
        });
      }

      if (desktopQuickLinks && quickLinksDesktopOnly) {
        gsap.set(desktopQuickLinks, {
          y: -40,
          opacity: 0
        });
      }
      
      // Set initial state for all submenu items
      setInitialSubmenuState();
      
      // Set initial state for mobile elements (mobile only)
      if (mobileQuickLinksBtn) {
        gsap.set(mobileQuickLinksBtn, {
          y: 100,
          opacity: 0
        });
      }
      
      if (mobileSearchInput) {
        gsap.set(mobileSearchInput, {
          y: 100,
          opacity: 0
        });
      }
      
      // Set menu active states
      megaMenu.classList.add('is-active');
      megaMenuOverlay.classList.add('is-active');
      playOverlayEnter();
      body.classList.add('mega-menu-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      
      // Play animation from start
      menuTimeline.play(0);
      
      // Focus trap: focus first focusable element in menu
      const firstFocusable = megaMenu.querySelector('a, button, select');
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    }

    /**
     * Close menu - reverse timeline
     */
    function closeMenu() {
      // First, animate out any active submenu items with stagger (desktop/tablet only)
      const activeSubmenus = megaMenu.querySelectorAll('.mega-menu__subnav.is-active');
      const isMobile = window.innerWidth < 768;
      
      const shouldDelayReverse = activeSubmenus.length > 0 && !isMobile;
      playOverlayExit();
      
      if (shouldDelayReverse) {
        // Desktop/tablet: Animate submenu items out with stagger (similar to main menu)
        activeSubmenus.forEach(submenu => {
          const submenuItems = submenu.querySelectorAll('.mega-menu__subnav-item, .mobile-only');
          
          if (submenuItems.length > 0) {
            gsap.to(submenuItems, {
              y: 100,
              opacity: 0,
              duration: 0.4,
              stagger: {
                amount: 0.2,
                from: 'end'
              },
              ease: 'power2.in'
            });
          }
          
          // Remove submenu active state after items animate out
          setTimeout(() => {
            submenu.classList.remove('is-active', 'slide-out-right', 'slide-in-right', 'slide-in-left');
          }, 400);
        });
        
        // Delay main menu reverse animation to let submenu items animate out first
        setTimeout(() => {
          menuTimeline.timeScale(animationSettings.closeTimeScale);
          menuTimeline.reverse(0);
        }, 200);
      } else {
        // Mobile or no active submenus: reverse immediately, reset submenus on mobile
        if (isMobile && activeSubmenus.length > 0) {
          activeSubmenus.forEach(submenu => {
            submenu.classList.remove('is-active', 'slide-out-right', 'slide-in-right', 'slide-in-left');
            resetSubmenuItems(submenu);
          });
        }
        menuTimeline.timeScale(animationSettings.closeTimeScale);
        menuTimeline.reverse(0);
      }
      
      // Set reverse complete callback
      menuTimeline.eventCallback('onReverseComplete', () => {
        // Reset speed so the next open animation runs normally
        menuTimeline.timeScale(1);

        megaMenu.classList.remove('is-active');
        megaMenuOverlay.classList.remove('is-active');
        body.classList.remove('mega-menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        
        // Reset hamburger icon
        const hamburgerIcon = document.getElementById('hamburgerIcon');
        if (hamburgerIcon) {
          hamburgerIcon.classList.remove('is-active');
        }
        
        // Reset menu items to initial state (hidden below)
        gsap.set(navItems, {
          y: 100,
          opacity: 0
        });
        
        // Reset circle image to initial state (zoomed out)
        if (circleImage) {
          gsap.set(circleImage, {
            scale: 0,
            opacity: 0,
            transformOrigin: 'center center'
          });
        }
        
        // Reset footer links to initial state (hidden below)
        if (footerLinks && footerLinks.length > 0) {
          gsap.set(footerLinks, {
            y: 100,
            opacity: 0
          });
        }
        
        // Reset all submenu items
        resetAllSubmenuItems();
        
        // Reset mobile elements to initial state
        if (mobileQuickLinksBtn) {
          gsap.set(mobileQuickLinksBtn, {
            y: 100,
            opacity: 0
          });
        }
        
        if (mobileSearchInput) {
          gsap.set(mobileSearchInput, {
            y: 100,
            opacity: 0
          });
        }
        
        // Return focus to menu toggle
        menuToggle.focus();
      });
    }

    function playOverlayEnter() {
      if (!megaMenuOverlay) return;
      if (overlayTween) overlayTween.kill();
      gsap.set(megaMenuOverlay, {
        autoAlpha: 0,
        y: -animationSettings.overlay.yOffset
      });
      overlayTween = gsap.to(megaMenuOverlay, {
        autoAlpha: 1,
        y: 0,
        duration: animationSettings.overlay.fadeIn,
        ease: 'power2.out'
      });
    }

    function playOverlayExit() {
      if (!megaMenuOverlay) return;
      if (overlayTween) overlayTween.kill();
      overlayTween = gsap.to(megaMenuOverlay, {
        autoAlpha: 0,
        y: -animationSettings.overlay.yOffset,
        duration: animationSettings.overlay.fadeOut,
        delay: animationSettings.overlay.closeDelay,
        ease: 'power2.in',
        onComplete: () => {
          megaMenuOverlay.classList.remove('is-active');
          gsap.set(megaMenuOverlay, {
            autoAlpha: 0,
            y: -animationSettings.overlay.yOffset
          });
        }
      });
    }

    /**
     * Animate submenu items when submenu becomes active
     * @param {HTMLElement} submenu - The submenu element that became active
     * @param {string} direction - The direction: 'right' (forward), 'left' (backward), or 'bottom' (default)
     */
    function animateSubmenuItems(submenu, direction = 'bottom') {
      if (!submenu || typeof gsap === 'undefined') return;
      
      const submenuItems = submenu.querySelectorAll('.mega-menu__subnav-item, .mobile-only');
      
      if (submenuItems && submenuItems.length > 0) {
        let initialX = 0;
        let staggerDirection = 1;
        
        // Set initial position and stagger direction based on navigation direction
        if (direction === 'right') {
          initialX = 100; // Come from right
          staggerDirection = 1; // Stagger from left to right (first item animates first)
        } else if (direction === 'left') {
          initialX = -100; // Come from left  
          staggerDirection = 1; // Stagger from left to right (first item animates first) - same as forward
        } else {
          // Default bottom direction (existing behavior)
          initialX = 0;
          staggerDirection = 1;
        }
        
        // Set initial state
        gsap.set(submenuItems, {
          x: initialX,
          y: direction === 'bottom' ? 100 : 0,
          opacity: 0
        });
        
        // Animate with directional stagger and wave effect
        gsap.to(submenuItems, {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: {
            amount: 0.4, // Total time to stagger all items
            from: staggerDirection === 1 ? 'start' : 'end',
            ease: 'power2.inOut' // Wave-like easing for stagger
          },
          ease: 'back.out(1.4)' // Bouncy wave-like ease for individual items
        });
      }
    }

    /**
     * Reset submenu items animation
     * @param {HTMLElement} submenu - The submenu element
     */
    function resetSubmenuItems(submenu) {
      if (!submenu || typeof gsap === 'undefined') return;
      
      const submenuItems = submenu.querySelectorAll('.mega-menu__subnav-item, .mobile-only');
      
      if (submenuItems && submenuItems.length > 0) {
        gsap.set(submenuItems, {
          x: 0,
          y: 100,
          opacity: 0
        });
      }
    }

    // Set initial state for all submenu items when menu opens
    function setInitialSubmenuState() {
      const allSubmenus = megaMenu.querySelectorAll('.mega-menu__subnav');
      allSubmenus.forEach(submenu => {
        const submenuItems = submenu.querySelectorAll('.mega-menu__subnav-item, .mobile-only');
        if (submenuItems && submenuItems.length > 0) {
          gsap.set(submenuItems, {
            x: 0,
            y: 100,
            opacity: 0
          });
        }
      });
    }

    // Reset all submenu items on close
    function resetAllSubmenuItems() {
      const allSubmenus = megaMenu.querySelectorAll('.mega-menu__subnav');
      allSubmenus.forEach(submenu => {
        resetSubmenuItems(submenu);
      });
    }

    // Return control functions
    return {
      openMenu: openMenu,
      closeMenu: closeMenu,
      timeline: menuTimeline,
      animateSubmenuItems: animateSubmenuItems,
      resetSubmenuItems: resetSubmenuItems,
      setInitialSubmenuState: setInitialSubmenuState
    };
  }

  // Export function to global scope for use in main.js
  window.initMegaMenuAnimations = initMegaMenuAnimations;

  /**
   * Circle image layer switching (moved from main.js)
   */
  function initCircleImageLayerSwitching() {
    const circleImageContainer = document.querySelector('.mega-menu__circle-image');
    if (!circleImageContainer) return;
    
    const circleImages = {
      layer1: circleImageContainer.querySelector('.circle-image-layer-1'),
      layer2: circleImageContainer.querySelector('.circle-image-layer-2'),
      layer3: circleImageContainer.querySelector('.circle-image-layer-3')
    };
    
    if (typeof gsap !== 'undefined') {
      Object.values(circleImages).forEach(img => {
        if (img) {
          if (!img.classList.contains('active')) {
            gsap.set(img, {
              scale: 0,
              opacity: 0,
              transformOrigin: 'center center'
            });
          } else {
            gsap.set(img, {
              scale: 1,
              opacity: 1,
              transformOrigin: 'center center'
            });
          }
        }
      });
    }
    
    function switchToLayerImage(layerNumber) {
      if (typeof gsap === 'undefined') {
        Object.values(circleImages).forEach(img => {
          if (img) img.classList.remove('active');
        });
        
        const targetImage = circleImages[`layer${layerNumber}`];
        if (targetImage) {
          targetImage.classList.add('active');
        }

        
        circleImageContainer.setAttribute('data-layer', layerNumber);
        return;
      }
      
      const currentImage = circleImageContainer.querySelector('.circle-image-layer-1.active, .circle-image-layer-2.active, .circle-image-layer-3.active');
      const targetImage = circleImages[`layer${layerNumber}`];
      
      if (!targetImage || currentImage === targetImage) return;
      
      const timeline = gsap.timeline();
      
      if (currentImage) {
        timeline.to(currentImage, {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'none',
          transformOrigin: 'center center',
          onComplete: () => {
            currentImage.classList.remove('active');
          }
        });
      }
      
      timeline.fromTo(targetImage, {
        scale: 0,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'none',
        transformOrigin: 'center center',
        onStart: () => {
          targetImage.classList.add('active');
        }
      }, currentImage ? 0.15 : 0);
      
      circleImageContainer.setAttribute('data-layer', layerNumber);
    }
    
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          
          if (target.classList.contains('mega-menu__subnav') && 
              target.classList.contains('is-active')) {
            
            if (target.hasAttribute('data-layer')) {
              const layerNumber = target.getAttribute('data-layer');
              switchToLayerImage(layerNumber);
            } else {
              const submenuContent = target.getAttribute('data-submenu-content');
              if (submenuContent && ['learning', 'school-life', 'admissions', 'community'].includes(submenuContent)) {
                switchToLayerImage(1);
              }
            }
          }
        }
      });
    });
    
    const allSubmenus = document.querySelectorAll('.mega-menu__subnav');
    allSubmenus.forEach(submenu => {
      observer.observe(submenu, { attributes: true, attributeFilter: ['class'] });
    });
    
    const mainNavItems = document.querySelectorAll('.mega-menu__nav-item a[data-submenu]');
    mainNavItems.forEach(navLink => {
      navLink.addEventListener('mouseenter', function() {
        switchToLayerImage(1);
      });
    });
  }

  /**
   * Initialize mega menu interactions (moved from main.js)
   */
  function initMegaMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const megaMenu = document.getElementById('megaMenu');
    const megaMenuOverlay = document.getElementById('megaMenuOverlay');
    const body = document.body;

    if (!menuToggle || !megaMenu || !megaMenuOverlay) return;

    const menuAnimations = initMegaMenuAnimations
      ? initMegaMenuAnimations(megaMenu, megaMenuOverlay, menuToggle, body)
      : null;

    function openMenu() {
      if (menuAnimations && menuAnimations.openMenu) {
        menuAnimations.openMenu();
      } else {
        megaMenu.classList.add('is-active');
        megaMenuOverlay.classList.add('is-active');
        body.classList.add('mega-menu-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        
        const hamburgerIcon = document.getElementById('hamburgerIcon');
        if (hamburgerIcon) {
          hamburgerIcon.classList.add('is-active');
        }
        
        const firstFocusable = megaMenu.querySelector('a, button, select');
        if (firstFocusable) {
          setTimeout(() => firstFocusable.focus(), 100);
        }
      }
      
      setTimeout(() => {
        const isMobile = window.innerWidth < 768;
        if (!isMobile) {
          const learningSubmenu = megaMenu.querySelector('.mega-menu__subnav[data-submenu-content="learning"]');
          const learningNavLink = megaMenu.querySelector('a[data-submenu="learning"]');
          
          if (learningSubmenu && learningNavLink) {
            const allSubmenus = megaMenu.querySelectorAll('.mega-menu__subnav[data-submenu-content]');
            allSubmenus.forEach(submenu => {
              submenu.classList.remove('is-active');
            });
            
            const allNavLinks = megaMenu.querySelectorAll('.mega-menu__nav a[data-submenu]');
            allNavLinks.forEach(link => {
              link.classList.remove('is-active');
            });
            
            slideInSubmenu(learningSubmenu, 'right');
            learningNavLink.classList.add('is-active');
          }
        }
      }, 300);
    }

    function closeMenu() {
      const quickLinksDropdown = document.getElementById('quickLinksDropdown');
      const quickLinksToggle = document.getElementById('quickLinksToggle');
      const mobileQuickLinksDropdown = document.getElementById('mobileQuickLinksDropdown');
      const mobileQuickLinksToggle = document.getElementById('mobileQuickLinksToggle');
      
      if (quickLinksDropdown && quickLinksToggle) {
        quickLinksDropdown.classList.remove('is-open');
        quickLinksToggle.classList.remove('is-open');
        quickLinksToggle.setAttribute('aria-expanded', 'false');
      }
      
      if (mobileQuickLinksDropdown && mobileQuickLinksToggle) {
        mobileQuickLinksDropdown.classList.remove('is-open');
        mobileQuickLinksToggle.classList.remove('is-open');
        mobileQuickLinksToggle.setAttribute('aria-expanded', 'false');
      }

      if (menuAnimations && menuAnimations.closeMenu) {
        menuAnimations.closeMenu();
      } else {
        megaMenu.classList.remove('is-active');
        megaMenuOverlay.classList.remove('is-active');
        body.classList.remove('mega-menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        
        const hamburgerIcon = document.getElementById('hamburgerIcon');
        if (hamburgerIcon) {
          hamburgerIcon.classList.remove('is-active');
        }
        
        menuToggle.focus();
      }
    }

    function slideInSubmenu(submenu, direction = 'right') {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        submenu.classList.add('is-active');
        if (menuAnimations && menuAnimations.animateSubmenuItems) {
          menuAnimations.animateSubmenuItems(submenu, 'bottom');
        }
        return;
      }
      
      submenu.classList.remove('slide-in-right', 'slide-in-left', 'slide-out-right', 'slide-out-left');
      
      if (direction === 'right') {
        submenu.classList.add('slide-in-right');
      } else {
        submenu.classList.add('slide-in-left');
      }
      
      submenu.offsetHeight;
      submenu.classList.add('is-active');
      
      if (menuAnimations && menuAnimations.animateSubmenuItems) {
        setTimeout(() => {
          menuAnimations.animateSubmenuItems(submenu, direction);
        }, 150);
      }
    }
    
    function slideOutSubmenu(submenu, direction = 'right') {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        submenu.classList.remove('is-active');
        if (menuAnimations && menuAnimations.resetSubmenuItems) {
          menuAnimations.resetSubmenuItems(submenu);
        }
        return;
      }
      
      const isFirstLevel = !submenu.hasAttribute('data-layer') || submenu.getAttribute('data-layer') === '1';
      
      if (isFirstLevel && typeof gsap !== 'undefined') {
        const submenuItems = submenu.querySelectorAll('.mega-menu__subnav-item, .mobile-only');
        
        gsap.to(submenuItems, {
          x: direction === 'right' ? 100 : -100,
          opacity: 0,
          duration: 0.3,
          stagger: {
            amount: 0.2,
            from: 'start'
          },
          ease: 'power2.in',
          onComplete: () => {
            gsap.to(submenu, {
              opacity: 0,
              duration: 0.2,
              onComplete: () => {
                submenu.classList.remove('is-active');
                submenu.classList.remove('slide-out-right', 'slide-out-left', 'slide-in-right', 'slide-in-left');
                gsap.set(submenu, { opacity: 1 });
                gsap.set(submenuItems, { x: 0, y: 100, opacity: 0 });
              }
            });
          }
        });
      } else {
        if (direction === 'right') {
          submenu.classList.add('slide-out-right');
        } else {
          submenu.classList.add('slide-out-left');
        }
        
        setTimeout(() => {
          submenu.classList.remove('is-active');
          submenu.classList.remove('slide-out-right', 'slide-out-left', 'slide-in-right', 'slide-in-left');
          
          if (menuAnimations && menuAnimations.resetSubmenuItems) {
            menuAnimations.resetSubmenuItems(submenu);
          }
        }, 400);
      }
    }

    menuToggle.addEventListener('click', function (e) {
      e.preventDefault();
      const isOpen = megaMenu.classList.contains('is-active');
      const hamburgerIcon = document.getElementById('hamburgerIcon');
      
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
        if (hamburgerIcon) {
          hamburgerIcon.classList.add('is-active');
        }
      }
    });

    megaMenuOverlay.addEventListener('click', function () {
      closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && megaMenu.classList.contains('is-active')) {
        closeMenu();
      }
    });

    const menuLinks = megaMenu.querySelectorAll('.mega-menu__nav a[data-submenu]');
    menuLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        const submenuId = this.getAttribute('data-submenu');
        const isMobile = window.innerWidth < 768;
        
        let targetSubmenu = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${submenuId}"][data-layer="1"]`) ||
                           megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${submenuId}"][data-layer]`) ||
                           megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${submenuId}"]`);
        
        if (targetSubmenu) {
          if (isMobile) {
            slideInSubmenu(targetSubmenu, 'right');
            allSubmenus.forEach(submenu => {
              if (submenu !== targetSubmenu && submenu.classList.contains('is-active')) {
                slideOutSubmenu(submenu, 'left');
              }
            });
          } else {
            allSubmenus.forEach(submenu => {
              submenu.classList.remove('is-active');
              if (menuAnimations && menuAnimations.resetSubmenuItems) {
                menuAnimations.resetSubmenuItems(submenu);
              }
            });
            slideInSubmenu(targetSubmenu, 'right');
          }
        }
      });
    });

    const allSubmenus = megaMenu.querySelectorAll('.mega-menu__subnav[data-submenu-content]');
    allSubmenus.forEach(submenu => {
      submenu.classList.remove('is-active');
    });

    const mainNavItems = megaMenu.querySelectorAll('.mega-menu__nav-item a[data-submenu]');

    mainNavItems.forEach(navLink => {
      navLink.addEventListener('mouseenter', function () {
        const submenuId = this.getAttribute('data-submenu');
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;
        
        const allNavLinks = megaMenu.querySelectorAll('.mega-menu__nav a[data-submenu]');
        allNavLinks.forEach(link => {
          link.classList.remove('is-active');
        });
        
        allSubmenus.forEach(submenu => {
          submenu.classList.remove('is-active');
          if (menuAnimations && menuAnimations.resetSubmenuItems) {
            menuAnimations.resetSubmenuItems(submenu);
          }
        });
        
        this.classList.add('is-active');
        
        const targetSubmenu = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${submenuId}"][data-layer="1"]`);
        if (targetSubmenu) {
          targetSubmenu.classList.add('is-active');
          if (menuAnimations && menuAnimations.animateSubmenuItems) {
            menuAnimations.animateSubmenuItems(targetSubmenu, 'bottom');
          }
        } else {
          const fallbackSubmenu = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${submenuId}"]:not([data-layer])`);
          if (fallbackSubmenu) {
            fallbackSubmenu.classList.add('is-active');
            if (menuAnimations && menuAnimations.animateSubmenuItems) {
              menuAnimations.animateSubmenuItems(fallbackSubmenu, 'bottom');
            }
          }
        }
      });
    });

    function handleLayerNavigation() {
      const clickableItems = megaMenu.querySelectorAll('.mega-menu__subnav-item--clickable');
      
      clickableItems.forEach(item => {
        [item, item.querySelector('a')].filter(Boolean).forEach(element => {
          element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const nextLayer = item.getAttribute('data-next-layer');
            const isMobile = window.innerWidth < 768;
            
            if (nextLayer) {
              let targetLayer = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${nextLayer}"][data-layer]`) ||
                               megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${nextLayer}"]`);
              
              if (targetLayer) {
                const currentSubmenu = item.closest('.mega-menu__subnav');
                
                if (isMobile) {
                  slideInSubmenu(targetLayer, 'right');
                  if (currentSubmenu) slideOutSubmenu(currentSubmenu, 'left');
                } else {
                  allSubmenus.forEach(submenu => {
                    submenu.classList.remove('is-active');
                    if (menuAnimations && menuAnimations.resetSubmenuItems) {
                      menuAnimations.resetSubmenuItems(submenu);
                    }
                  });
                  targetLayer.classList.add('is-active');
                  if (menuAnimations && menuAnimations.animateSubmenuItems) {
                    menuAnimations.animateSubmenuItems(targetLayer, 'right');
                  }
                }
              }
            }
          });
        });
      });

      const backButtons = megaMenu.querySelectorAll('.mega-menu__subnav-item--back a');
      
      backButtons.forEach(backLink => {
        backLink.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          const backButton = backLink.closest('.mega-menu__subnav-item--back');
          const backTo = backButton.getAttribute('data-back-to');
          const currentSubmenu = backButton.closest('.mega-menu__subnav');
          const isMobile = window.innerWidth < 768;
          
          if (!currentSubmenu) return;
          
          if (!backTo || currentSubmenu.getAttribute('data-submenu-content') === backTo) {
            if (isMobile) {
              slideOutSubmenu(currentSubmenu, 'right');
            } else {
              currentSubmenu.classList.remove('is-active');
              if (menuAnimations && menuAnimations.resetSubmenuItems) {
                menuAnimations.resetSubmenuItems(currentSubmenu);
              }
            }
          } else {
            const targetLayer = megaMenu.querySelector(`.mega-menu__subnav[data-submenu-content="${backTo}"]`);
            
            if (targetLayer) {
              if (isMobile) {
                targetLayer.style.zIndex = '1005';
                slideInSubmenu(targetLayer, 'left');
                
                setTimeout(() => {
                  slideOutSubmenu(currentSubmenu, 'right');
                  setTimeout(() => {
                    targetLayer.style.zIndex = '';
                  }, 400);
                }, 200);
              } else {
                currentSubmenu.classList.remove('is-active');
                if (menuAnimations && menuAnimations.resetSubmenuItems) {
                  menuAnimations.resetSubmenuItems(currentSubmenu);
                }
                targetLayer.classList.add('is-active');
                if (menuAnimations && menuAnimations.animateSubmenuItems) {
                  menuAnimations.animateSubmenuItems(targetLayer, 'left');
                }
              }
            }
          }
        });
      });
    }

    handleLayerNavigation();
    initCircleImageLayerSwitching();

    const quickLinksToggle = document.getElementById('quickLinksToggle');
    const quickLinksDropdown = document.getElementById('quickLinksDropdown');

    if (quickLinksToggle && quickLinksDropdown) {
      quickLinksToggle.addEventListener('click', function () {
        const isOpen = quickLinksDropdown.classList.contains('is-open');
        
        if (isOpen) {
          quickLinksDropdown.classList.remove('is-open');
          quickLinksToggle.classList.remove('is-open');
          quickLinksToggle.setAttribute('aria-expanded', 'false');
        } else {
          quickLinksDropdown.classList.add('is-open');
          quickLinksToggle.classList.add('is-open');
          quickLinksToggle.setAttribute('aria-expanded', 'true');
        }
      });
    }

    const mobileQuickLinksToggle = document.getElementById('mobileQuickLinksToggle');
    const mobileQuickLinksDropdown = document.getElementById('mobileQuickLinksDropdown');

    if (mobileQuickLinksToggle && mobileQuickLinksDropdown) {
      mobileQuickLinksToggle.addEventListener('click', function () {
        const isOpen = mobileQuickLinksDropdown.classList.contains('is-open');
        
        if (isOpen) {
          mobileQuickLinksDropdown.classList.remove('is-open');
          mobileQuickLinksToggle.classList.remove('is-open');
          mobileQuickLinksToggle.setAttribute('aria-expanded', 'false');
        } else {
          mobileQuickLinksDropdown.classList.add('is-open');
          mobileQuickLinksToggle.classList.add('is-open');
          mobileQuickLinksToggle.setAttribute('aria-expanded', 'true');
        }
      });
    }

    const backButton = document.getElementById('megaMenuBack');
    if (backButton) {
      backButton.addEventListener('click', function (e) {
        e.preventDefault();
        closeMenu();
      });
    }
  }

  window.initMegaMenu = initMegaMenu;

})();
